package server

import (
	"context"
	"net/http"
	"time"

	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/apollotracing"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/gorilla/websocket"
	"github.com/pkg/errors"

	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/empiricaly/tajriba/internal/auth"
	"github.com/empiricaly/tajriba/internal/auth/actor"
	"github.com/julienschmidt/httprouter"
	"github.com/rs/zerolog/log"
	// vtransport "github.com/empiricaly/tajriba/internal/vendored/transport"
)

// pingInterval is the interval at which a ping is sent to client.
const pingInterval = 10 * time.Second

// Defining the Graphql handler.
func graphqlHandler(
	ctx context.Context,
	schema graphql.ExecutableSchema,
) httprouter.Handle {
	gqlsrv := handler.New(schema)

	gqlsrv.AddTransport(transport.Options{})
	gqlsrv.AddTransport(transport.GET{})
	gqlsrv.AddTransport(transport.POST{})
	// gqlsrv.AddTransport(vtransport.Websocket{
	// 	KeepAlivePingInterval: pingInterval,
	// })
	gqlsrv.AddTransport(transport.Websocket{
		KeepAlivePingInterval: pingInterval,
		Upgrader: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
		},
		InitFunc: func(ctx context.Context, initPayload transport.InitPayload) (context.Context, error) {
			token, ok := initPayload["authToken"].(string)

			log.Trace().Msg("graphql: websocket started")
			ctx2, cancel := context.WithCancel(ctx)
			go func() {
				defer cancel()
				<-ctx2.Done()
				log.Trace().Msg("graphql: websocket ended")
			}()

			if ok {
				user, err := auth.GetAuthentication(ctx, token)
				if err != nil {
					return nil, errors.Wrap(err, "check websocket auth")
				} else if user != nil {
					ctx = actor.SetContext(ctx, user)
				}
			}

			return ctx, nil
		},
	})
	gqlsrv.Use(extension.Introspection{})
	gqlsrv.Use(apollotracing.Tracer{})

	gqlsrv.AroundOperations(func(ctx context.Context, next graphql.OperationHandler) graphql.ResponseHandler {
		oc := graphql.GetOperationContext(ctx)

		// Add .Str("query", oc.RawQuery) to get query
		log.Trace().Str("name", oc.OperationName).Interface("vars", oc.Variables).Msg("graphql: request")

		return next(ctx)
	})

	gqlsrv.AroundResponses(func(ctx context.Context, next graphql.ResponseHandler) *graphql.Response {
		oc := graphql.GetOperationContext(ctx)
		if oc.OperationName == "IntrospectionQuery" {
			return next(ctx)
		}

		t := time.Now()
		resp := next(ctx)

		if resp != nil {
			log.Trace().RawJSON("json", resp.Data).Str("took", time.Since(t).String()).Msg("graphql: response")
		}

		return resp
	})

	return func(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
		t := time.Now()

		gqlsrv.ServeHTTP(w, r)

		log.Trace().Str("lasted", time.Since(t).String()).Msg("graphql: connection ended")
	}
}
