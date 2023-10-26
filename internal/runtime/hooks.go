package runtime

import (
	"context"
	"net/http"

	"github.com/empiricaly/tajriba/internal/auth/actor"
	"github.com/empiricaly/tajriba/internal/graph/mgen"
	"github.com/empiricaly/tajriba/internal/models"
	"github.com/empiricaly/tajriba/internal/server/metadata"
	"github.com/pkg/errors"
	"github.com/rs/zerolog/log"
)

const eventIDLen = 16

func (r *Runtime) propagateHook(_ context.Context, eventType mgen.EventType, nodeID string, node models.Node) {
	eventID, err := generateRandomKey(eventIDLen)
	if err != nil {
		log.Ctx(r.ctx).Error().Err(err).Msg("runtime: failed to generate eventID")

		return
	}

	for _, subs := range r.onEventSubs {
		for _, sub := range subs {
			if !sub.et[eventType] || (sub.nodeID != nil && *sub.nodeID != nodeID) {
				continue
			}

			dc, ok := node.(models.DeepCopier)
			if ok {
				node = dc.DeepCopy()
			}

			sub.w.Send([]*mgen.OnEventPayload{
				{
					EventID:   eventID,
					EventType: eventType,
					Node:      node,
					Done:      true,
				},
			})
		}
	}
}

type onEventSub struct {
	nodeID *string
	et     map[mgen.EventType]bool
	req    *http.Request

	w *WebsocketWriter[*mgen.OnEventPayload]
}

func (r *Runtime) SubOnEvent(ctx context.Context, input *mgen.OnEventInput) (<-chan *mgen.OnEventPayload, error) {
	r.Lock()
	defer r.Unlock()

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

	w := NewWebsocketWriter[*mgen.OnEventPayload](ctx, "hooks")

	go r.setupOnEventSub(ctx, input, actorID, w)

	return w.outbound, nil
}

func (r *Runtime) setupOnEventSub(
	ctx context.Context,
	input *mgen.OnEventInput,
	actorID string,
	w *WebsocketWriter[*mgen.OnEventPayload],
) {
	et := make(map[mgen.EventType]bool)

	for _, e := range input.EventTypes {
		et[e] = true
	}

	md := metadata.RequestForContext(ctx)

	c := &onEventSub{
		w:      w,
		et:     et,
		req:    md.Request,
		nodeID: input.NodeID,
	}

	r.Lock()

	r.onEventSubs[actorID] = append(r.onEventSubs[actorID], c)

	if et[mgen.EventTypeParticipantConnected] {
		r.updateConnectedParticipants(w)
	}

	r.Unlock()

	<-ctx.Done()

	r.Lock()
	defer r.Unlock()

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
}

func (r *Runtime) updateConnectedParticipants(w *WebsocketWriter[*mgen.OnEventPayload]) {
	last := len(r.changesSubs)
	count := 0

	for pID, subs := range r.changesSubs {
		count++

		if len(subs) == 0 {
			log.Ctx(r.ctx).Warn().
				Str("participantID", pID).
				Msg("hooks: found change sub participant group without subs")

			continue
		}

		eventID, err := generateRandomKey(eventIDLen)
		if err != nil {
			log.Ctx(r.ctx).Error().Err(err).Msg("runtime: failed to generate eventID")

			continue
		}

		part := subs[0].p.DeepCopy()
		w.Send([]*mgen.OnEventPayload{
			{
				EventID:   eventID,
				EventType: mgen.EventTypeParticipantConnected,
				Node:      part,
				Done:      count == last,
			},
		})
	}

	if last == 0 {
		eventID, err := generateRandomKey(eventIDLen)
		if err != nil {
			log.Ctx(r.ctx).Error().Err(err).Msg("runtime: failed to generate eventID")
		} else {
			w.Send([]*mgen.OnEventPayload{
				{
					EventID:   eventID,
					EventType: mgen.EventTypeParticipantConnected,
					Done:      true,
				},
			})
		}
	}
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
