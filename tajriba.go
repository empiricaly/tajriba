package tajriba

import (
	"context"

	"github.com/99designs/gqlgen/graphql"
	"github.com/empiricaly/tajriba/internal/auth"
	"github.com/empiricaly/tajriba/internal/graph"
	"github.com/empiricaly/tajriba/internal/memprofile"
	"github.com/empiricaly/tajriba/internal/runtime"

	// "github.com/empiricaly/tajriba/internal/runtime".
	"github.com/empiricaly/tajriba/internal/server"
	"github.com/empiricaly/tajriba/internal/store"
	"github.com/empiricaly/tajriba/internal/utils/ids"
	logger "github.com/empiricaly/tajriba/internal/utils/log"
	"github.com/julienschmidt/httprouter"
	"github.com/pkg/errors"
	"github.com/rs/zerolog/log"
	"github.com/spf13/viper"
)

// Runner manages Tajriba's running state.
type Runner struct {
	ctx      context.Context
	conn     *store.Conn
	config   *Config
	server   *server.Server
	runtime  *runtime.Runtime
	profiler *memprofile.Profiler
}

// Close waits for Tajriba to be done.
func (r *Runner) Close() {
	if r.conn != nil {
		err := r.conn.Close()
		if err != nil {
			log.Error().Err(err).Msg("close conn")
		}
	}

	if r.runtime != nil {
		r.runtime.Stop()
	}

	if r.profiler != nil {
		r.profiler.Stop()
	}

	if r.server != nil {
		r.server.Close()
	}
}

// ForceMemoryProfile triggers an immediate memory profile write
func (r *Runner) ForceMemoryProfile() {
	if r.profiler != nil {
		r.profiler.ForceProfile()
	}
}

// Start sets up the Tajriba environment and creates an HTTP server.
func Start(ctx context.Context, config *Config, usingConfigFile bool) (*Runner, error) {
	ctx, r, schema, err := Setup(ctx, config, usingConfigFile)
	if err != nil {
		return nil, errors.Wrap(err, "setup tajriba")
	}

	r.server, err = server.Start(ctx, config.Server, schema)
	if err != nil {
		return nil, errors.Wrap(err, "init server")
	}

	return r, nil
}

// Init sets up the Tajriba environment for an existing HTTP server.
func (r *Runner) Init(schema graphql.ExecutableSchema, router *httprouter.Router) error {
	err := server.Enable(r.ctx, r.config.Server, router, schema)
	if err != nil {
		return errors.Wrap(err, "init server")
	}

	return nil
}

// Setup sets up the Tajriba environment.
func Setup(ctx context.Context, config *Config, usingConfigFile bool) (context.Context, *Runner, graphql.ExecutableSchema, error) {
	ctx, err := logger.Init(ctx, config.Log)
	if err != nil {
		return ctx, nil, nil, errors.Wrap(err, "init logs")
	}

	if usingConfigFile {
		log.Ctx(ctx).Trace().Str("file", viper.ConfigFileUsed()).Msg("Using config file")
	}

	log.Ctx(ctx).Trace().Interface("config", config).Msg("Configuration")

	ctx, err = ids.Init(ctx)
	if err != nil {
		return ctx, nil, nil, errors.Wrap(err, "init ids")
	}

	conn, err := store.Connect(ctx, config.Store)
	if err != nil {
		return ctx, nil, nil, errors.Wrap(err, "init store")
	}

	ctx = store.SetContext(ctx, conn)

	ctx = auth.SetContext(ctx, auth.Init(ctx, config.Auth))

	rt, err := runtime.Start(ctx, config.Auth.Users)
	if err != nil {
		return ctx, nil, nil, errors.Wrap(err, "init runtime")
	}

	ctx = runtime.SetContext(ctx, rt)

	// Initialize memory profiler
	profilerConfig := memprofile.Config{
		Enabled:     config.MemProfile.Enabled,
		Dir:         config.MemProfile.Dir,
		Interval:    config.MemProfile.Interval,
		HTTPEnabled: config.MemProfile.HTTPEnabled,
		HTTPPort:    config.MemProfile.HTTPPort,
	}

	profiler, err := memprofile.Start(ctx, profilerConfig)
	if err != nil {
		return ctx, nil, nil, errors.Wrap(err, "init memory profiler")
	}

	r := &Runner{
		ctx:      ctx,
		conn:     conn,
		config:   config,
		runtime:  rt,
		profiler: profiler,
	}

	// Set runtime stats callback for memory profiler
	if profiler != nil {
		profiler.SetRuntimeStatsCallback(func(context string) {
			rt.LogStats(context)
		})
	}

	schema := graph.NewSchema(ctx, config.Auth.ServiceRegistrationToken)

	return ctx, r, schema, nil
}
