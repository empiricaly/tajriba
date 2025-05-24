package tajriba

import (
	"time"

	"github.com/empiricaly/tajriba/internal/auth"
	"github.com/empiricaly/tajriba/internal/server"
	"github.com/empiricaly/tajriba/internal/store"
	logger "github.com/empiricaly/tajriba/internal/utils/log"
	"github.com/pkg/errors"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

// Config is server configuration.
type Config struct {
	Server *server.Config `mapstructure:"server"`
	Store  *store.Config  `mapstructure:"store"`
	Auth   *auth.Config   `mapstructure:"auth"`
	Log    *logger.Config `mapstructure:"log"`

	Production bool             `mapstructure:"production"`
	MemProfile MemProfileConfig `mapstructure:"memprofile"`
}

// MemProfileConfig holds configuration for memory profiling
type MemProfileConfig struct {
	// Enable memory profiling
	Enabled bool `mapstructure:"enabled"`

	// Directory to write memory profiles (default: current directory)
	Dir string `mapstructure:"dir"`

	// Interval for writing memory profiles (default: 5 minutes)
	Interval time.Duration `mapstructure:"interval"`

	// Enable HTTP pprof endpoints
	HTTPEnabled bool `mapstructure:"http_enabled"`

	// HTTP port for pprof endpoints (default: 6060)
	HTTPPort int `mapstructure:"http_port"`
}

// Validate configuration is ok.
func (c *Config) Validate() error {
	c.Server.Production = c.Production
	c.Auth.Production = c.Production

	err := c.Server.Validate()
	if err != nil {
		return errors.Wrap(err, "validate server configuration")
	}

	err = c.Store.Validate()
	if err != nil {
		return errors.Wrap(err, "validate store configuration")
	}

	err = c.Auth.Validate()
	if err != nil {
		return errors.Wrap(err, "validate auth configuration")
	}

	err = c.Log.Validate()
	if err != nil {
		return errors.Wrap(err, "validate log configuration")
	}

	return nil
}

// ConfigFlags helps configure cobra and viper flags.
func ConfigFlags(cmd *cobra.Command, prefix, defaultDBFile string) error {
	if cmd == nil {
		return errors.New("command required")
	}

	if prefix != "" {
		prefix += "."
	}

	viper.SetDefault(prefix, &Config{})

	err := server.ConfigFlags(cmd, prefix+"server")
	if err != nil {
		return errors.Wrap(err, "set server configuration flags")
	}

	err = store.ConfigFlags(cmd, prefix+"store", defaultDBFile)
	if err != nil {
		return errors.Wrap(err, "set store configuration flags")
	}

	err = auth.ConfigFlags(cmd, prefix+"auth")
	if err != nil {
		return errors.Wrap(err, "set auth configuration flags")
	}

	err = logger.ConfigFlags(cmd, prefix+"log", "info")
	if err != nil {
		return errors.Wrap(err, "set logger configuration flags")
	}

	flag := prefix + ".production"
	bval := true
	cmd.Flags().Bool(flag, bval, "Run in production mode (e.g. enforce admin authenticate)")
	viper.SetDefault(flag, bval)

	// Memory profiling flags
	cmd.Flags().Bool(prefix+"memprofile.enabled", false, "Enable memory profiling")
	viper.SetDefault(prefix+"memprofile.enabled", false)

	cmd.Flags().String(prefix+"memprofile.dir", ".", "Directory to write memory profiles")
	viper.SetDefault(prefix+"memprofile.dir", ".")

	cmd.Flags().Duration(prefix+"memprofile.interval", 5*time.Minute, "Interval for writing memory profiles")
	viper.SetDefault(prefix+"memprofile.interval", 5*time.Minute)

	cmd.Flags().Bool(prefix+"memprofile.http_enabled", false, "Enable HTTP pprof endpoints")
	viper.SetDefault(prefix+"memprofile.http_enabled", false)

	cmd.Flags().Int(prefix+"memprofile.http_port", 6060, "HTTP port for pprof endpoints")
	viper.SetDefault(prefix+"memprofile.http_port", 6060)

	return nil
}
