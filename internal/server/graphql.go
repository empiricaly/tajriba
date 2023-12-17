package server

import (
	"context"
	"io"
	"net/http"
	"time"

	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/apollotracing"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/gorilla/websocket"
	"github.com/sasha-s/go-deadlock"

	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/empiricaly/tajriba/internal/auth/actor"
	"github.com/empiricaly/tajriba/internal/auth/authhttp"
	"github.com/empiricaly/tajriba/internal/models"
	"github.com/empiricaly/tajriba/internal/runtime"
	"github.com/julienschmidt/httprouter"
	"github.com/rs/zerolog/log"
)

// pingInterval is the interval at which a ping is sent to client.
const (
	pingInterval = 5 * time.Second
	initTimeout  = 5 * time.Second
)

// func init() {
// 	deadlock.Opts.DeadlockTimeout = 3 * time.Second
// }

type lockedMarshaller struct {
	rt *runtime.Runtime
	m  graphql.Marshaler
}

func (m *lockedMarshaller) MarshalGQL(w io.Writer) {
	m.rt.RLock()
	m.m.MarshalGQL(w)
	m.rt.RUnlock()
}

// Defining the Graphql handler.
func graphqlHandler(
	ctx context.Context,
	conf *Config,
	schema graphql.ExecutableSchema,
) httprouter.Handle {
	gqlsrv := handler.New(schema)

	var mut deadlock.Mutex
	connectedUsers := map[string]struct{}{}
	connectedParticipants := map[string]struct{}{}

	gqlsrv.AddTransport(transport.Options{})
	gqlsrv.AddTransport(transport.GET{})
	gqlsrv.AddTransport(transport.POST{})
	gqlsrv.AddTransport(transport.Websocket{
		ErrorFunc: func(ctx context.Context, err error) {
			log.Ctx(ctx).Trace().Err(err).Msg("graphql: websocket error")
		},
		KeepAlivePingInterval: pingInterval,
		PingPongInterval:      pingInterval,
		Upgrader: websocket.Upgrader{
			// Force new proto
			// Subprotocols: []string{"graphql-transport-ws"},
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
			EnableCompression: true,
		},
		InitTimeout: initTimeout,
		CloseFunc: func(ctx context.Context, closeCode int) {
			log.Ctx(ctx).Trace().Int("code", closeCode).Msg("graphql: websocket closed")
			user := actor.ForContext(ctx)

			mut.Lock()
			defer mut.Unlock()

			if conf.MaxUsers > 0 {
				u, isUser := user.(*models.User)
				if isUser {
					delete(connectedUsers, u.ID)
				}
			}

			if conf.MaxParticipants > 0 {
				p, isParticipant := user.(*models.Participant)
				if isParticipant {
					delete(connectedParticipants, p.ID)
				}

				log.Info().
					Int("connectedParticipants", len(connectedParticipants)).
					Uint("conf.MaxParticipants", conf.MaxParticipants).
					Bool("ispart", isParticipant).
					Msg("disconn")
			}
		},
		InitFunc: func(ctx context.Context, initPayload transport.InitPayload) (context.Context, error) {
			token, ok := initPayload["authToken"].(string)

			log.Ctx(ctx).Trace().Msg("graphql: websocket started")
			ctx2, cancel := context.WithCancel(ctx)
			go func(ctx context.Context) {
				defer cancel()
				<-ctx2.Done()
				log.Ctx(ctx).Trace().Msg("graphql: websocket ended")
			}(ctx)

			if !ok {
				return ctx, nil
			}

			user, err := authhttp.GetAuthentication(ctx, token, conf.Production)
			if err != nil || user == nil {
				log.Ctx(ctx).Trace().
					Err(err).
					Str("token", token).
					Msg("graphql: websocket auth failed")

				ctx = transport.AppendCloseReason(ctx, "auth failed")

				return ctx, nil
			}

			mut.Lock()
			defer mut.Unlock()

			if conf.MaxUsers > 0 {
				u, isUser := user.(*models.User)

				if isUser {
					if uint(len(connectedUsers)) >= conf.MaxUsers {
						ctx = transport.AppendCloseReason(ctx, "max users")

						return ctx, nil
					}

					connectedUsers[u.ID] = struct{}{}
				}
			}

			if conf.MaxParticipants > 0 {
				log.Info().Msg("max participants check")

				p, isParticipant := user.(*models.Participant)

				log.Info().
					Int("connectedParticipants", len(connectedParticipants)).
					Uint("conf.MaxParticipants", conf.MaxParticipants).
					Bool("ispart", isParticipant).
					Msg("is participant?")

				if isParticipant {
					if uint(len(connectedParticipants)) >= conf.MaxParticipants {
						log.Info().Msg("max participants check failed")
						ctx = transport.AppendCloseReason(ctx, "max participants")

						return ctx, nil
					}

					connectedParticipants[p.ID] = struct{}{}
				}
			}

			ctx = actor.SetContext(ctx, user)

			return ctx, nil
		},
	})

	if !conf.Production {
		gqlsrv.Use(extension.Introspection{})

		if conf.EnableTracer {
			gqlsrv.Use(apollotracing.Tracer{})
		}
	}

	gqlsrv.AroundOperations(func(ctx context.Context, next graphql.OperationHandler) graphql.ResponseHandler {
		oc := graphql.GetOperationContext(ctx)

		// Add .Str("query", oc.RawQuery) to get query
		log.Ctx(ctx).Trace().
			Str("name", oc.OperationName).
			Interface("vars", oc.Variables).
			Msg("graphql: request")

		defer log.Ctx(ctx).Trace().
			Str("name", oc.OperationName).
			Interface("vars", oc.Variables).
			Msg("graphql: request end")

		return next(ctx)
	})

	// gqlsrv.AroundRootFields(func(ctx context.Context, next graphql.RootResolver) graphql.Marshaler {
	// 	return &lockedMarshaller{m: next(ctx), rt: runtime.ForContext(ctx)}
	// })

	gqlsrv.AroundResponses(func(ctx context.Context, next graphql.ResponseHandler) *graphql.Response {
		oc := graphql.GetOperationContext(ctx)
		if oc.OperationName == "IntrospectionQuery" {
			return next(ctx)
		}

		// skipLock := oc.Operation == nil || oc.Operation.Operation == ast.Subscription

		// var rt *runtime.Runtime
		// if !skipLock {
		// 	rt = runtime.ForContext(ctx)
		// 	rt.RLock()
		// }

		t := time.Now()
		resp := next(ctx)
		d := time.Since(t).String()

		// if !skipLock {
		// 	rt.RUnlock()
		// }

		if resp != nil {
			var op string
			if oc.Operation != nil {
				op = string(oc.Operation.Operation)
			}

			l := log.Ctx(ctx).Trace().
				Str("op", op).
				Str("took", d)

			if len(resp.Data) > 0 {
				l = l.RawJSON("json", resp.Data)
			}

			l.Msg("graphql: response")
		} else {
			log.Ctx(ctx).Trace().
				Str("op", string(oc.Operation.Operation)).
				Str("took", d).
				Msg("graphql: no response")
		}

		return resp
	})

	return func(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
		t := time.Now()

		gqlsrv.ServeHTTP(w, r)

		log.Ctx(ctx).Trace().Str("lasted", time.Since(t).String()).Msg("graphql: connection ended")
	}
}
