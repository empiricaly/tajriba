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

// AddParticipant is the resolver for the addParticipant field.
func (r *mutationResolver) AddParticipant(ctx context.Context, input mgen.AddParticipantInput) (*mgen.AddParticipantPayload, error) {
	rt := runtime.ForContext(ctx)

	p, session, err := rt.AddParticipant(ctx, input.Identifier)
	if err != nil {
		return nil, errs.Wrap(err, "add participant")
	}

	return &mgen.AddParticipantPayload{Participant: p, SessionToken: session}, nil
}

// Links is the resolver for the links field.
func (r *participantResolver) Links(ctx context.Context, obj *models.Participant, after *string, first *int, before *string, last *int) (*mgen.LinkConnection, error) {
	rt := runtime.ForContext(ctx)

	links, total, hasNext, hasPrev, err := rt.ParticpantLinks(ctx, obj.ID, after, first, before, last)
	if err != nil {
		return nil, errs.Wrap(err, "get participant links")
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

// Participants is the resolver for the participants field.
func (r *queryResolver) Participants(ctx context.Context, after *string, first *int, before *string, last *int) (*mgen.ParticipantConnection, error) {
	rt := runtime.ForContext(ctx)

	participants, total, hasNext, hasPrev, err := rt.Particpants(ctx, after, first, before, last)
	if err != nil {
		return nil, errs.Wrap(err, "get participants")
	}

	var start, end string

	l := len(participants)
	edges := make([]*mgen.ParticipantEdge, l)

	for i, participant := range participants {
		edges[i] = &mgen.ParticipantEdge{
			Node:   participant,
			Cursor: participant.ID,
		}

		if i == 0 {
			start = participant.ID
		}

		if i == l-1 {
			end = participant.ID
		}
	}

	return &mgen.ParticipantConnection{
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

// Participant returns ParticipantResolver implementation.
func (r *Resolver) Participant() ParticipantResolver { return &participantResolver{r} }

type participantResolver struct{ *Resolver }
