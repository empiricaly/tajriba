package store

import "context"

type ctxType struct{}

// A private key for context that only this package can access. This is
// important to prevent collisions between different context uses.
var ctxKey = ctxType{}

// ForContext finds the conn from the context.
func ForContext(ctx context.Context) *Conn {
	raw, _ := ctx.Value(ctxKey).(*Conn)

	return raw
}

// SetContext sets the user on the context.
func SetContext(ctx context.Context, c *Conn) context.Context {
	return context.WithValue(ctx, ctxKey, c)
}
