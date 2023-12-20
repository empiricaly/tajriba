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

func (r *Runtime) Link(ctx context.Context, input mgen.LinkInput) (*mgen.LinkPayload, error) {
	// startAt := time.Now()
	// defer func() {
	// 	sort.StringSlice(input.NodeIDs).Sort()

	// 	h := sha1.New()
	// 	for _, id := range input.NodeIDs {
	// 		h.Write([]byte(id))
	// 	}

	// 	log.Ctx(ctx).Info().
	// 		Str("took", time.Since(startAt).String()).
	// 		Str("hash", base64.StdEncoding.EncodeToString(h.Sum(nil))).
	// 		Int("nodeIDs", len(input.NodeIDs)).
	// 		Int("participantIDs", len(input.ParticipantIDs)).
	// 		Msg("runtime: Link")
	// }()

	r.Lock()
	defer r.Unlock()

	// startActualAt := time.Now()
	// defer func() {
	// 	log.Ctx(ctx).Info().
	// 		Str("took", time.Since(startActualAt).String()).
	// 		Int("nodeIDs", len(input.NodeIDs)).
	// 		Int("participantIDs", len(input.ParticipantIDs)).
	// 		Msg("runtime: Link inner")
	// }()

	if !input.Link {
		log.Ctx(r.ctx).Debug().Msg("runtime: unlinking is untested")
	}

	actr := actor.ForContext(ctx)
	if actr == nil {
		return nil, ErrNotAuthorized
	}

	nodes := make([]models.Node, len(input.NodeIDs))
	nodesDups := make(map[string]struct{}, len(input.NodeIDs))

	for i, nodeID := range input.NodeIDs {
		if _, ok := nodesDups[nodeID]; ok {
			return nil, errors.New("duplicate node id")
		}
		nodesDups[nodeID] = struct{}{}

		v, ok := r.values[nodeID]
		if !ok {
			return nil, ErrNotFound
		}

		node, ok := v.(models.Node)
		if !ok {
			return nil, ErrInvalidNode
		}

		switch node.(type) {
		case *models.Step, *models.Scope, *models.Group:
			// Noop
		default:
			return nil, ErrInvalidNode
		}

		nodes[i] = node
	}

	participants := make([]*models.Participant, len(input.ParticipantIDs))

	for i, participantID := range input.ParticipantIDs {
		v, ok := r.participantsMap[participantID]
		if !ok {
			log.Ctx(r.ctx).Info().Interface("participantsMap", r.participantsMap).Interface("input", input).Msg("-----------------------")
			return nil, ErrNotFound
		}

		participants[i] = v
	}

	now := time.Now()
	actorID := actr.GetID()
	conn := store.ForContext(ctx)

	links := make([]*models.Link, 0, len(nodes)*len(participants))

	// pushingAt := time.Now()
	for _, participant := range participants {
		active := activeParticipantLinks(participant.Links)

	LOOP:
		for i, node := range nodes {

			for _, link := range active {
				if link.NodeID == input.NodeIDs[i] && link.Link == input.Link {
					continue LOOP
					// return nil, ErrAlreadyExists
				}
			}

			// for _, l := range participant.Links {
			// 	if l.NodeID == input.NodeIDs[i] {
			// 		return nil, ErrAlreadyExists
			// 	}
			// }

			link := &models.Link{
				ID:            ids.ID(ctx),
				CreatedAt:     now,
				CreatedByID:   actorID,
				CreatedBy:     actr,
				Link:          input.Link,
				ParticipantID: participant.ID,
				Participant:   participant,
				NodeID:        input.NodeIDs[i],
				Node:          node,
			}
			links = append(links, link)
			participant.Links = append(participant.Links, link)
		}
	}
	// log.Ctx(r.ctx).Info().Str("took", time.Since(pushingAt).String()).Msg("links: find links")

	// pushingAt = time.Now()
	for _, link := range links {
		err := conn.Save(link)
		if err != nil {
			log.Ctx(r.ctx).Error().Err(err).Msg("runtime: failed to save link")

			continue
		}

		r.links = append(r.links, link)
		r.linksMap[link.ID] = link

		r.propagateHook(ctx, mgen.EventTypeLinkAdd, link.ID, link)

		switch v := link.Node.(type) {
		case *models.Scope:
			v.Links = append(v.Links, link)
		case *models.Step:
			v.Links = append(v.Links, link)
		case *models.Group:
			v.Links = append(v.Links, link)
		}
	}
	// log.Ctx(r.ctx).Info().Str("took", time.Since(pushingAt).String()).Msg("links: propagate hooks")

	// pushingAt = time.Now()
	if err := r.pushLinks(ctx, links, nil); err != nil {
		log.Ctx(r.ctx).Error().Err(err).Msg("runtime: failed to push new links to participant")
	}
	// log.Ctx(r.ctx).Info().Str("took", time.Since(pushingAt).String()).Msg("links: push to participants")

	return &mgen.LinkPayload{
		Nodes:        nodes,
		Participants: participants,
	}, nil
}

func activeNodeLinks(links []*models.Link) []*models.Link {
	seen := make(map[string]struct{})
	active := make([]*models.Link, 0)

	for i := len(links) - 1; i >= 0; i-- {
		link := links[i]

		if _, ok := seen[link.ParticipantID]; ok {
			continue
		}

		seen[link.ParticipantID] = struct{}{}

		if !link.Link {
			continue
		}

		active = append(active, link)
	}

	return active
}

func activeParticipantLinks(links []*models.Link) []*models.Link {
	seen := make(map[string]struct{})
	active := make([]*models.Link, 0)

	for i := len(links) - 1; i >= 0; i-- {
		link := links[i]

		if _, ok := seen[link.NodeID]; ok {
			continue
		}

		seen[link.NodeID] = struct{}{}

		if !link.Link {
			continue
		}

		active = append(active, link)
	}

	for i := len(active)/2 - 1; i >= 0; i-- {
		opp := len(active) - 1 - i
		active[i], active[opp] = active[opp], active[i]
	}

	return active
}
