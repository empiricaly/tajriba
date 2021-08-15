package runtime

import "context"

type ctxType int

// A private key for context that only this package can access. This is
// important to prevent collisions between different context uses.
const ctxKey = ctxType(0)

// ForContext finds the Runtime from the context.
func ForContext(ctx context.Context) *Runtime {
	raw, _ := ctx.Value(ctxKey).(*Runtime)

	return raw
}

// SetContext sets the user on the context.
func SetContext(ctx context.Context, c *Runtime) context.Context {
	return context.WithValue(ctx, ctxKey, c)
}
