package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"github.com/empiricaly/tajriba/internal/graph/mgen"
	"github.com/empiricaly/tajriba/internal/runtime"
	errs "github.com/pkg/errors"
)

// Transition is the resolver for the transition field.
func (r *mutationResolver) Transition(ctx context.Context, input mgen.TransitionInput) (*mgen.TransitionPayload, error) {
	rt := runtime.ForContext(ctx)

	t, err := rt.Transition(ctx, input.NodeID, input.From, input.To, input.Cause)
	if err != nil {
		return nil, errs.Wrap(err, "transition step")
	}

	return &mgen.TransitionPayload{Transition: t}, nil
}
