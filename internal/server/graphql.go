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
	"github.com/vektah/gqlparser/v2/ast"

	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/empiricaly/tajriba/internal/auth"
	"github.com/empiricaly/tajriba/internal/auth/actor"
	"github.com/empiricaly/tajriba/internal/runtime"
	"github.com/julienschmidt/httprouter"
	"github.com/rs/zerolog/log"
	// vtransport "github.com/empiricaly/tajriba/internal/vendored/transport"
)

// pingInterval is the interval at which a ping is sent to client.
const pingInterval = 10 * time.Second

// Defining the Graphql handler.
func graphqlHandler(
	ctx context.Context,
	conf *Config,
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
				user, err := auth.GetAuthentication(ctx, token, conf.Production)
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

	// gqlsrv.AroundFields(func(ctx context.Context, next graphql.Resolver) (res interface{}, err error) {
	// 	oc := graphql.GetOperationContext(ctx)
	// 	if oc.OperationName == "IntrospectionQuery" || oc.Operation.Operation != ast.Subscription {
	// 		return next(ctx)
	// 	}

	// 	fc := graphql.GetFieldContext(ctx)
	// 	// if !fc.IsResolver || fc.Field.Name != "changes" {
	// 	// 	return next(ctx)
	// 	// }

	// 	// Add .Str("query", oc.RawQuery) to get query
	// 	log.Trace().Str("field", fc.Field.Name).Bool("resolver", fc.IsResolver).Bool("method", fc.IsMethod).Interface("type", fc.Field.Definition.Type.String()).Msg("graphql: sub push")

	// 	// rt := runtime.ForContext(ctx)
	// 	// rt.RLock()
	// 	// defer rt.RUnlock()

	// 	defer func() {
	// 		log.Trace().Str("field", fc.Field.Name).Interface("res", fc.Result).Msg("graphql: sub push end")
	// 	}()

	// 	return next(ctx)
	// })

	gqlsrv.AroundOperations(func(ctx context.Context, next graphql.OperationHandler) graphql.ResponseHandler {
		oc := graphql.GetOperationContext(ctx)

		rt := runtime.ForContext(ctx)
		rt.Lock()
		defer rt.Unlock()

		// Add .Str("query", oc.RawQuery) to get query
		log.Trace().
			Str("name", oc.OperationName).
			Interface("vars", oc.Variables).
			Msg("graphql: request")

		defer log.Trace().
			Str("name", oc.OperationName).
			Interface("vars", oc.Variables).
			Msg("graphql: request end")

		return next(ctx)
	})

	gqlsrv.AroundResponses(func(ctx context.Context, next graphql.ResponseHandler) *graphql.Response {
		oc := graphql.GetOperationContext(ctx)
		if oc.OperationName == "IntrospectionQuery" {
			return next(ctx)
		}

		skipLock := oc.Operation == nil || oc.Operation.Operation == ast.Subscription
		// skipLock := false
		// spew.Dump(oc)

		var rt *runtime.Runtime
		if !skipLock {
			rt = runtime.ForContext(ctx)
			if oc.Operation.Operation == ast.Mutation {
				rt.Lock()
			} else {
				rt.RLock()
			}
		}

		t := time.Now()
		resp := next(ctx)
		d := time.Since(t).String()

		if !skipLock {
			if oc.Operation.Operation == ast.Mutation {
				rt.Unlock()
			} else {
				rt.RUnlock()
			}
		}

		if resp != nil {
			var op string
			if oc.Operation != nil {
				op = string(oc.Operation.Operation)
			}
			log.Trace().
				Str("op", op).
				Str("took", d).
				RawJSON("json", resp.Data).
				Msg("graphql: response")
		} else {
			log.Trace().
				Str("op", string(oc.Operation.Operation)).
				Str("took", d).
				Msg("graphql: no response")
		}

		return resp
	})

	return func(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
		t := time.Now()

		gqlsrv.ServeHTTP(w, r)

		log.Trace().Str("lasted", time.Since(t).String()).Msg("graphql: connection ended")
	}
}
