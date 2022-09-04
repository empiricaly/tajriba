package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"github.com/empiricaly/tajriba/internal/graph/mgen"
	"github.com/empiricaly/tajriba/internal/models"
	"github.com/empiricaly/tajriba/internal/runtime"
	errs "github.com/pkg/errors"
)

// AddScopes is the resolver for the addScopes field.
func (r *mutationResolver) AddScopes(ctx context.Context, input []*mgen.AddScopeInput) ([]*mgen.AddScopePayload, error) {
	rt := runtime.ForContext(ctx)

	p := make([]*mgen.AddScopePayload, len(input))

	for i, sinput := range input {
		s, err := rt.AddScope(ctx, sinput.Name, sinput.Kind, sinput.Attributes)
		if err != nil {
			return nil, errs.Wrap(err, "add scope")
		}

		p[i] = &mgen.AddScopePayload{Scope: s}
	}

	return p, nil
}

// Scopes is the resolver for the scopes field.
func (r *queryResolver) Scopes(ctx context.Context, filter []*models.ScopedAttributesInput, after *string, first *int, before *string, last *int) (*mgen.ScopeConnection, error) {
	rt := runtime.ForContext(ctx)

	scopes, total, hasNext, hasPrev, err := rt.Scopes(ctx, filter, after, first, before, last)
	if err != nil {
		return nil, errs.Wrap(err, "get scopes")
	}

	var start, end string

	l := len(scopes)
	edges := make([]*mgen.ScopeEdge, l)

	for i, scope := range scopes {
		edges[i] = &mgen.ScopeEdge{
			Node:   scope,
			Cursor: scope.ID,
		}

		if i == 0 {
			start = scope.ID
		}

		if i == l-1 {
			end = scope.ID
		}
	}

	return &mgen.ScopeConnection{
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

// Attributes is the resolver for the attributes field.
func (r *scopeResolver) Attributes(ctx context.Context, obj *models.Scope, deleted *bool, after *string, first *int, before *string, last *int) (*mgen.AttributeConnection, error) {
	rt := runtime.ForContext(ctx)

	attrs, total, hasNext, hasPrev, err := rt.ScopeAttributes(ctx, obj.ID, deleted, after, first, before, last)
	if err != nil {
		return nil, errs.Wrap(err, "get scope attributes")
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

// Links is the resolver for the links field.
func (r *scopeResolver) Links(ctx context.Context, obj *models.Scope, after *string, first *int, before *string, last *int) (*mgen.LinkConnection, error) {
	rt := runtime.ForContext(ctx)

	links, total, hasNext, hasPrev, err := rt.ScopeLinks(ctx, obj.ID, after, first, before, last)
	if err != nil {
		return nil, errs.Wrap(err, "get step links")
	}

	var start, end string

	l := len(links)
	edges := make([]*mgen.LinkEdge, l)

	for i, link := range links {
		edges[i] = &mgen.LinkEdge{
			Node:   link,
			Cursor: link.ID,
		}

		if i == 0 {
			start = link.ID
		}

		if i == l-1 {
			end = link.ID
		}
	}

	return &mgen.LinkConnection{
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

// ScopedAttributes is the resolver for the scopedAttributes field.
func (r *subscriptionResolver) ScopedAttributes(ctx context.Context, input []*models.ScopedAttributesInput) (<-chan *mgen.SubAttributesPayload, error) {
	rt := runtime.ForContext(ctx)

	c, err := rt.SubScopedAttributes(ctx, input, false)
	if err != nil {
		return nil, errs.Wrap(err, "sub scoped attributes")
	}

	return c, nil
}

// GlobalAttributes is the resolver for the globalAttributes field.
func (r *subscriptionResolver) GlobalAttributes(ctx context.Context) (<-chan *mgen.SubAttributesPayload, error) {
	rt := runtime.ForContext(ctx)

	input := []*models.ScopedAttributesInput{{Names: []string{"global"}}}

	c, err := rt.SubScopedAttributes(ctx, input, true)
	if err != nil {
		return nil, errs.Wrap(err, "sub scoped attributes")
	}

	return c, nil
}

// Scope returns ScopeResolver implementation.
func (r *Resolver) Scope() ScopeResolver { return &scopeResolver{r} }

type scopeResolver struct{ *Resolver }
