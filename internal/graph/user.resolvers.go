package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"github.com/empiricaly/tajriba/internal/graph/mgen"
	"github.com/empiricaly/tajriba/internal/runtime"
	errs "github.com/pkg/errors"
)

func (r *mutationResolver) Login(ctx context.Context, input mgen.LoginInput) (*mgen.LoginPayload, error) {
	rt := runtime.ForContext(ctx)

	u, s, err := rt.Login(ctx, input.Username, input.Password)
	if err != nil {
		return nil, errs.Wrap(err, "transition step")
	}

	return &mgen.LoginPayload{User: u, SessionToken: s}, nil
}
