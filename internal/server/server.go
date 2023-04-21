// Package server handles the GraphQL HTTP server.
package server

import (
	"context"
	"net"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/99designs/gqlgen/graphql"
	"github.com/empiricaly/tajriba/internal/auth"
	"github.com/empiricaly/tajriba/internal/server/metadata"
	"github.com/julienschmidt/httprouter"
	"github.com/pkg/errors"
	"github.com/rs/cors"
	"github.com/rs/zerolog/log"
)

// Server holds the server state.
type Server struct {
	wg *sync.WaitGroup
}

// shutdownGracePeriod is the time to wait for the server to close gracefully.
const shutdownGracePeriod = 5 * time.Second

// Start creates and starts the GraphQL HTTP server.
func Start(
	ctx context.Context,
	config *Config,
	schema graphql.ExecutableSchema,
) (*Server, error) {
	s := &Server{
		wg: &sync.WaitGroup{},
	}

	router := httprouter.New()
	router.RedirectTrailingSlash = true
	router.RedirectFixedPath = true
	router.HandleMethodNotAllowed = true

	err := Enable(ctx, config, router, schema)
	if err != nil {
		return nil, errors.Wrap(err, "enable server")
	}

	router.GET("/", index)

	l, err := net.Listen("tcp", config.Addr)
	if err != nil {
		return nil, errors.Wrap(err, "listen addr")
	}

	srv := &http.Server{
		Handler:           cors.Default().Handler(router),
		BaseContext:       func(_ net.Listener) context.Context { return ctx },
		ReadHeaderTimeout: 10 * time.Second,
		ReadTimeout:       30 * time.Second,
		WriteTimeout:      2 * time.Minute,
		IdleTimeout:       5 * time.Minute,
	}

	s.wg.Add(1)

	go func() {
		log.Ctx(ctx).Debug().
			Str("addr", config.Addr).
			Int("port", l.Addr().(*net.TCPAddr).Port).
			Msg("Started Tajriba server")

		<-ctx.Done()

		log.Ctx(ctx).Debug().Msg("Stopping Tajriba server")
		s.wg.Add(1)

		shutdownCtx, cancel := context.WithTimeout(context.Background(), shutdownGracePeriod)
		defer cancel()

		err := srv.Shutdown(shutdownCtx)
		if err != nil {
			log.Ctx(ctx).Error().Err(err).Msg("Tajriba server shutdown failed")

			os.Exit(1)

			return
		}

		log.Ctx(ctx).Debug().Msg("Tajriba server gracefully shutdown")
		s.wg.Done()
	}()

	go func() {
		err := srv.Serve(l)
		if err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Ctx(ctx).Error().Err(err).Msg("Failed start Tajriba server")
		}

		s.wg.Done()
	}()

	return s, nil
}

// Close closes the server.
func (s *Server) Close() {
	s.wg.Wait()
}

// Enable adds Tajriba GraphQL endpoints to an HTTP router.
func Enable(
	ctx context.Context,
	conf *Config,
	router *httprouter.Router,
	schema graphql.ExecutableSchema,
) error {
	gqlh := requestMetadata(auth.Middleware(graphqlHandler(ctx, conf, schema), conf.Production))
	router.GET("/query", gqlh)
	router.POST("/query", gqlh)

	router.GET("/play", playground("Tajriba GraphQL", "/query"))
	router.GET("/graphiql", graphiql("Tajriba GraphQL", "/query"))

	return nil
}

func index(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	_, err := w.Write([]byte("Hello!"))
	if err != nil {
		log.Ctx(r.Context()).Error().Err(err).Msg("Failed to send response for index")
	}
}

// requestMetadata adds request info to the context.
func requestMetadata(h httprouter.Handle) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		headers := map[string][]string(r.Header)

		rm := &metadata.Request{
			Headers: headers,
			Request: r,
		}

		r = r.WithContext(metadata.SetRequestForContext(r.Context(), rm))

		h(w, r, ps)
	}
}

// type bodyLogWriter struct {
// 	http.ResponseWriter
// }

// func (w bodyLogWriter) Write(b []byte) (int, error) {
// 	os.Stderr.Write(b)
// 	return w.ResponseWriter.Write(b)
// }

// func resBodyLog(h httprouter.Handle) httprouter.Handle {
// 	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
// 		wr := bodyLogWriter{w}
// 		h(wr, r, ps)
// 	}
// }
