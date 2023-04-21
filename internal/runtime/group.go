package runtime

import (
	"context"
	"time"

	"github.com/empiricaly/tajriba/internal/auth/actor"
	"github.com/empiricaly/tajriba/internal/graph/mgen"
	"github.com/empiricaly/tajriba/internal/models"
	"github.com/empiricaly/tajriba/internal/store"
	"github.com/empiricaly/tajriba/internal/utils/ids"
	"github.com/pkg/errors"
	"github.com/rs/zerolog/log"
)

func (r *Runtime) AddGroup(ctx context.Context, participantIDs []string) (*models.Group, error) {
	r.Lock()
	defer r.Unlock()

	actr := actor.ForContext(ctx)
	if actr == nil {
		return nil, ErrNotAuthorized
	}

	now := time.Now()
	actorID := actr.GetID()

	g := &models.Group{
		ID:          ids.ID(ctx),
		CreatedAt:   now,
		CreatedByID: actorID,
		CreatedBy:   actr,
	}

	participants := make([]*models.Participant, len(participantIDs))

	for i, participantID := range participantIDs {
		v, ok := r.participantsMap[participantID]
		if !ok {
			return nil, ErrNotFound
		}

		participants[i] = v
	}

	links := make([]*models.Link, 0, len(participants))

	for _, participant := range participants {
		link := &models.Link{
			ID:            ids.ID(ctx),
			CreatedAt:     now,
			CreatedByID:   actorID,
			CreatedBy:     actr,
			Link:          true,
			ParticipantID: participant.ID,
			Participant:   participant,
			NodeID:        g.ID,
			Node:          g,
		}
		links = append(links, link)
	}

	conn := store.ForContext(ctx)

	if err := conn.Save(g); err != nil {
		return nil, errors.Wrap(err, "save group")
	}

	r.groups = append(r.groups, g)
	r.groupsMap[g.ID] = g
	r.values[g.ID] = g

	r.propagateHook(ctx, mgen.EventTypeGroupAdd, g.ID, g)

	for _, link := range links {
		err := conn.Save(link)
		if err != nil {
			log.Ctx(r.ctx).Error().Err(err).Msg("runtime: failed to save link")

			continue
		}
	}

	g.Links = links

	// for _, pID := range participantIDs {
	// 	for _, c := range r.changesSubs[pID] {
	// 		if err := c.push(ctx, links, false); err != nil {
	// 			log.Ctx(r.ctx).Error().Err(err).Str("participantID", pID).Msg("runtime: failed to push nodes to participant")
	// 		}
	// 	}
	// }

	return g, nil
}

func (r *Runtime) Groups(
	ctx context.Context,
	after *string,
	first *int,
	before *string,
	last *int,
) (
	groups []*models.Group,
	total int,
	hasNext,
	hasPrev bool,
	err error,
) {
	r.RLock()
	defer r.RUnlock()

	items := make([]models.Cursorer, len(r.groups))
	for i := range r.groups {
		items[i] = r.groups[i]
	}

	items, total, hasNext, hasPrev, err = paginate(items, after, first, before, last)

	groups = make([]*models.Group, len(items))
	for i := range items {
		groups[i], _ = items[i].(*models.Group)
	}

	return groups, total, hasNext, hasPrev, err
}

func (r *Runtime) GroupLinks(
	ctx context.Context,
	groupID string,
	after *string,
	first *int,
	before *string,
	last *int,
) (
	links []*models.Link,
	total int,
	hasNext,
	hasPrev bool,
	err error,
) {
	r.RLock()
	defer r.RUnlock()

	group, ok := r.groupsMap[groupID]
	if !ok {
		return nil, 0, false, false, ErrNotFound
	}

	items := make([]models.Cursorer, len(group.Links))
	for i := range group.Links {
		items[i] = group.Links[i]
	}

	items, total, hasNext, hasPrev, err = paginate(items, after, first, before, last)

	links = make([]*models.Link, len(items))
	for i := range items {
		links[i], _ = items[i].(*models.Link)
	}

	return links, total, hasNext, hasPrev, err
}
