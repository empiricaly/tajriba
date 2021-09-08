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

func (r *groupResolver) Links(ctx context.Context, obj *models.Group, after *string, first *int, before *string, last *int) (*mgen.LinkConnection, error) {
	rt := runtime.ForContext(ctx)

	links, total, hasNext, hasPrev, err := rt.GroupLinks(ctx, obj.ID, after, first, before, last)
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

func (r *mutationResolver) AddGroups(ctx context.Context, input []*mgen.AddGroupInput) ([]*mgen.AddGroupPayload, error) {
	rt := runtime.ForContext(ctx)

	p := make([]*mgen.AddGroupPayload, len(input))

	for i, ginput := range input {
		g, err := rt.AddGroup(ctx, ginput.ParticipantIDs)
		if err != nil {
			return nil, errs.Wrap(err, "add group")
		}

		p[i] = &mgen.AddGroupPayload{Group: g}
	}

	return p, nil
}

func (r *queryResolver) Groups(ctx context.Context, after *string, first *int, before *string, last *int) (*mgen.GroupConnection, error) {
	rt := runtime.ForContext(ctx)

	groups, total, hasNext, hasPrev, err := rt.Groups(ctx, after, first, before, last)
	if err != nil {
		return nil, errs.Wrap(err, "get groups")
	}

	var start, end string

	l := len(groups)
	edges := make([]*mgen.GroupEdge, l)

	for i, group := range groups {
		edges[i] = &mgen.GroupEdge{
			Node:   group,
			Cursor: group.ID,
		}

		if i == 0 {
			start = group.ID
		}

		if i == l-1 {
			end = group.ID
		}
	}

	return &mgen.GroupConnection{
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

// Group returns GroupResolver implementation.
func (r *Resolver) Group() GroupResolver { return &groupResolver{r} }

type groupResolver struct{ *Resolver }
