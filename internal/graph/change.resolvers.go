package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"github.com/empiricaly/tajriba/internal/models"
	"github.com/empiricaly/tajriba/internal/runtime"
	errs "github.com/pkg/errors"
)

// Changes is the resolver for the changes field.
func (r *subscriptionResolver) Changes(ctx context.Context) (<-chan *models.ChangePayload, error) {
	rt := runtime.ForContext(ctx)

	c, err := rt.SubChanges(ctx)
	if err != nil {
		return nil, errs.Wrap(err, "sub changes")
	}

	return c, nil
}

// Subscription returns SubscriptionResolver implementation.
func (r *Resolver) Subscription() SubscriptionResolver { return &subscriptionResolver{r} }

type subscriptionResolver struct{ *Resolver }
