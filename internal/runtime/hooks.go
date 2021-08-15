package runtime

import (
	"context"

	"github.com/empiricaly/tajriba/internal/auth/actor"
	"github.com/empiricaly/tajriba/internal/graph/mgen"
	"github.com/empiricaly/tajriba/internal/models"
	"github.com/pkg/errors"
	"github.com/rs/zerolog/log"
)

const eventIDLen = 16

func (r *Runtime) propagateHook(ctx context.Context, eventType mgen.EventType, nodeID string, node models.Node) {
	eventID, err := generateRandomKey(eventIDLen)
	if err != nil {
		log.Error().Err(err).Msg("runtime: failed to generate eventID")

		return
	}

	for _, subs := range r.onEventSubs {
		for _, sub := range subs {
			if sub.et[eventType] {
				if sub.nodeID != nil && *sub.nodeID != nodeID {
					continue
				}

				sub.c <- &mgen.OnEventPayload{
					EventID:   eventID,
					EventType: eventType,
					Node:      node,
				}
			}
		}
	}
}

type onEventSub struct {
	nodeID *string
	c      chan *mgen.OnEventPayload
	et     map[mgen.EventType]bool
}

func (r *Runtime) SubOnEvent(
	ctx context.Context,
	input *mgen.OnEventInput,
) (<-chan *mgen.OnEventPayload, error) {
	actr := actor.ForContext(ctx)
	if actr == nil {
		return nil, ErrNotAuthorized
	}

	_, ok := actr.(*models.User)
	if !ok {
		_, ok = actr.(*models.Service)
		if !ok {
			return nil, errors.New("event sub only for admins")
		}
	}

	actorID := actr.GetID()

	pchan := make(chan *mgen.OnEventPayload)

	go func() {
		et := make(map[mgen.EventType]bool)

		for _, e := range input.EventTypes {
			et[e] = true
		}

		c := &onEventSub{c: pchan, et: et}

		r.Lock()
		r.onEventSubs[actorID] = append(r.onEventSubs[actorID], c)
		r.Unlock()

		<-ctx.Done()

		r.Lock()
		defer r.Unlock()

		close(c.c)

		n := 0

		for _, cc := range r.onEventSubs[actorID] {
			if cc != c {
				r.onEventSubs[actorID][n] = cc
				n++
			}
		}

		r.onEventSubs[actorID] = r.onEventSubs[actorID][:n]

		if len(r.onEventSubs[actorID]) == 0 {
			delete(r.onEventSubs, actorID)
		}
	}()

	return pchan, nil
}

func (r *Runtime) SubOnAnyEvent(
	ctx context.Context,
	input *mgen.OnAnyEventInput,
) (<-chan *mgen.OnEventPayload, error) {
	return r.SubOnEvent(ctx, &mgen.OnEventInput{
		EventTypes: mgen.AllEventType,
		NodeID:     input.NodeID,
	})
}
