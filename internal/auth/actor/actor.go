package actor

import (
	"context"
)

// Actor is whoever is authenticated to the API, whether it's a Participant, a
// User or a Service.
type Actor interface {
	IsActor()
	GetID() string
}

type ctxType struct{}

// A private key for context that only this package can access. This is
// important to prevent collisions between different context uses.
var ctxKey = ctxType{}

// ForContext finds the user from the context. REQUIRES Middleware to have run.
func ForContext(ctx context.Context) Actor {
	raw, _ := ctx.Value(ctxKey).(Actor)

	return raw
}

// SetContext sets the user on the context.
func SetContext(ctx context.Context, user Actor) context.Context {
	return context.WithValue(ctx, ctxKey, user)
}
