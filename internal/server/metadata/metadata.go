package metadata

import (
	"context"
	"net/http"

	"github.com/empiricaly/tajriba/internal/auth/actor"
)

type request int

const requestKey = request(0)

// RequestForContext gets Request metadata on the context.
func RequestForContext(ctx context.Context) *Request {
	raw, _ := ctx.Value(requestKey).(*Request)

	return raw
}

// SetRequestForContext sets Request on the context.
func SetRequestForContext(ctx context.Context, r *Request) context.Context {
	return context.WithValue(ctx, requestKey, r)
}

type Request struct {
	Headers map[string][]string
	Request *http.Request
	Token   string
	Actor   actor.Actor
}
