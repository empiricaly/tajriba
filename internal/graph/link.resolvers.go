package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"github.com/empiricaly/tajriba/internal/graph/mgen"
	"github.com/empiricaly/tajriba/internal/runtime"
	errs "github.com/pkg/errors"
)

// Link is the resolver for the link field.
func (r *mutationResolver) Link(ctx context.Context, input mgen.LinkInput) (*mgen.LinkPayload, error) {
	rt := runtime.ForContext(ctx)

	l, err := rt.Link(ctx, input)
	if err != nil {
		return nil, errs.Wrap(err, "add link")
	}

	return l, nil
}
