package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"github.com/empiricaly/tajriba/internal/graph/mgen"
	"github.com/empiricaly/tajriba/internal/runtime"
	errs "github.com/pkg/errors"
)

func (r *subscriptionResolver) OnEvent(ctx context.Context, input *mgen.OnEventInput) (<-chan *mgen.OnEventPayload, error) {
	rt := runtime.ForContext(ctx)

	c, err := rt.SubOnEvent(ctx, input)
	if err != nil {
		return nil, errs.Wrap(err, "sub onEvent")
	}

	return c, nil
}

func (r *subscriptionResolver) OnAnyEvent(ctx context.Context, input *mgen.OnAnyEventInput) (<-chan *mgen.OnEventPayload, error) {
	rt := runtime.ForContext(ctx)

	c, err := rt.SubOnAnyEvent(ctx, input)
	if err != nil {
		return nil, errs.Wrap(err, "sub onAnyEvent")
	}

	return c, nil
}
