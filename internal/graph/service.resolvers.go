package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"github.com/empiricaly/tajriba/internal/graph/mgen"
	"github.com/empiricaly/tajriba/internal/runtime"
	errs "github.com/pkg/errors"
)

func (r *mutationResolver) RegisterService(ctx context.Context, input mgen.RegisterServiceInput) (*mgen.RegisterServicePayload, error) {
	rt := runtime.ForContext(ctx)

	if r.srt != input.Token {
		return nil, runtime.ErrNotAuthorized
	}

	s, t, err := rt.RegisterService(ctx, input.Name)
	if err != nil {
		return nil, errs.Wrap(err, "transition step")
	}

	return &mgen.RegisterServicePayload{Service: s, SessionToken: t}, nil
}
