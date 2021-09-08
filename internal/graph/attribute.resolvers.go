package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/empiricaly/tajriba/internal/graph/mgen"
	"github.com/empiricaly/tajriba/internal/models"
	"github.com/empiricaly/tajriba/internal/runtime"
	errs "github.com/pkg/errors"
)

func (r *attributeResolver) Versions(ctx context.Context, obj *models.Attribute, after *string, first *int, before *string, last *int) (*mgen.AttributeConnection, error) {
	rt := runtime.ForContext(ctx)

	attrs, total, hasNext, hasPrev, err := rt.AttributeVersions(ctx, obj.ID, after, first, before, last)
	if err != nil {
		return nil, errs.Wrap(err, "get attribute versions")
	}

	var start, end string

	l := len(attrs)
	edges := make([]*mgen.AttributeEdge, l)

	for i, attr := range attrs {
		edges[i] = &mgen.AttributeEdge{
			Node:   attr,
			Cursor: attr.ID,
		}

		if i == 0 {
			start = attr.ID
		}

		if i == l-1 {
			end = attr.ID
		}
	}

	return &mgen.AttributeConnection{
		TotalCount: total,
		PageInfo: &mgen.PageInfo{
			HasNextPage:     hasNext,
			HasPreviousPage: hasPrev,
			StartCursor:     &start,
			EndCursor:       &end,
		},
		Edges: edges,
	}, nil
}

func (r *mutationResolver) SetAttributes(ctx context.Context, input []*mgen.SetAttributeInput) ([]*mgen.SetAttributePayload, error) {
	rt := runtime.ForContext(ctx)

	attrs, err := rt.SetAttributes(ctx, input)
	if err != nil {
		return nil, errs.Wrap(err, "set attributes")
	}

	aa := make([]*mgen.SetAttributePayload, len(attrs))

	for i, attr := range attrs {
		aa[i] = &mgen.SetAttributePayload{
			Attribute: attr,
		}
	}

	return aa, nil
}

func (r *queryResolver) Attributes(ctx context.Context, scopeID string, after *string, first *int, before *string, last *int) (*mgen.AttributeConnection, error) {
	panic(fmt.Errorf("not implemented"))
}

// Attribute returns AttributeResolver implementation.
func (r *Resolver) Attribute() AttributeResolver { return &attributeResolver{r} }

// Mutation returns MutationResolver implementation.
func (r *Resolver) Mutation() MutationResolver { return &mutationResolver{r} }

// Query returns QueryResolver implementation.
func (r *Resolver) Query() QueryResolver { return &queryResolver{r} }

type attributeResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
