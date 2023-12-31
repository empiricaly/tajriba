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
	r.Lock()
	defer r.Unlock()

	if !input.Link {
		log.Ctx(r.ctx).Debug().
			Msg("runtime: unlinking is untested")
	}

	actr := actor.ForContext(ctx)
	if actr == nil {
		return nil, ErrNotAuthorized
	}

	nodes, nodeIDs, err := inputLinkNodes(r, input)
	if err != nil {
		return nil, errors.Wrap(err, "get unique input nodes")
	}

	participants, err := inputLinkParticipants(r, input)
	if err != nil {
		return nil, errors.Wrap(err, "get unique input participants")
	}

	now := time.Now()
	actorID := actr.GetID()
	conn := store.ForContext(ctx)

	links := make([]*models.Link, 0, len(nodes)*len(participants))

	for _, participant := range participants {
		active := activeParticipantLinks(participant.Links)

	LOOP:
		for i, node := range nodes {
			for _, link := range active {
				if link.NodeID == nodeIDs[i] && link.Link == input.Link {
					continue LOOP
				}
			}

			link := &models.Link{
				ID:            ids.ID(ctx),
				CreatedAt:     now,
				CreatedByID:   actorID,
				CreatedBy:     actr,
				Link:          input.Link,
				ParticipantID: participant.ID,
				Participant:   participant,
				NodeID:        nodeIDs[i],
				Node:          node,
			}
			links = append(links, link)
			participant.Links = append(participant.Links, link)
		}
	}

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

	if err := r.pushLinks(ctx, links, nil); err != nil {
		log.Ctx(r.ctx).Error().
			Err(err).
			Msg("runtime: failed to push new links to participant")
	}

	return &mgen.LinkPayload{
		Nodes:        nodes,
		Participants: participants,
	}, nil
}

func inputLinkParticipants(r *Runtime, input mgen.LinkInput) ([]*models.Participant, error) {
	participants := make([]*models.Participant, len(input.ParticipantIDs))
	partDups := make(map[string]struct{}, len(input.NodeIDs))

	for i, participantID := range input.ParticipantIDs {
		if _, ok := partDups[participantID]; ok {
			log.Ctx(r.ctx).Debug().
				Str("participantID", participantID).
				Interface("link", input).
				Msg("runtime: duplicate participant id")

			continue
		}

		partDups[participantID] = struct{}{}

		v, ok := r.participantsMap[participantID]
		if !ok {
			log.Ctx(r.ctx).
				Error().
				Interface("participantsMap", r.participantsMap).
				Interface("input", input).
				Msg("-----------------------")

			return nil, ErrNotFound
		}

		participants[i] = v
	}

	return participants, nil
}

func inputLinkNodes(r *Runtime, input mgen.LinkInput) ([]models.Node, []string, error) {
	nodes := make([]models.Node, 0, len(input.NodeIDs))
	nodeIDs := make([]string, 0, len(input.NodeIDs))
	nodesDups := make(map[string]struct{}, len(input.NodeIDs))

	for _, nodeID := range input.NodeIDs {
		if _, ok := nodesDups[nodeID]; ok {
			log.Ctx(r.ctx).Debug().
				Str("nodeID", nodeID).
				Interface("link", input).
				Msg("runtime: duplicate node id")

			continue
		}

		nodesDups[nodeID] = struct{}{}

		v, ok := r.values[nodeID]
		if !ok {
			return nil, nil, ErrNotFound
		}

		node, ok := v.(models.Node)
		if !ok {
			return nil, nil, ErrInvalidNode
		}

		switch node.(type) {
		case *models.Step, *models.Scope, *models.Group:
			// Noop
		default:
			return nil, nil, ErrInvalidNode
		}

		nodes = append(nodes, node)
		nodeIDs = append(nodeIDs, nodeID)
	}

	return nodes, nodeIDs, nil
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
