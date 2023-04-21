package runtime

import (
	"context"
	"time"

	"github.com/empiricaly/tajriba/internal/auth/actor"
	"github.com/empiricaly/tajriba/internal/graph/mgen"
	"github.com/empiricaly/tajriba/internal/models"
	"github.com/pkg/errors"
	"github.com/rs/zerolog/log"
	"github.com/sasha-s/go-deadlock"
)

type changesSub struct {
	ctx context.Context
	p   *models.Participant

	// Map of co-participantIDs to which groupIDs they were added from.
	// When stepIDs is empty map, participant removed change sent.
	participants map[string]map[string]struct{}

	ch      chan *models.ChangePayload
	closing chan bool
	closed  bool

	deadlock.Mutex
}

func newChangesSub(ctx context.Context, p *models.Participant, ch chan *models.ChangePayload) *changesSub {
	s := &changesSub{
		ctx:          ctx,
		p:            p,
		ch:           ch,
		participants: make(map[string]map[string]struct{}),
		closing:      make(chan bool),
	}

	go s.wait()

	return s
}

// If you're wondering what on earth is going here, see "NOTE ABOUT CLOSING
// GQLGEN SUBSCRIPTION CHANNELS" in scope.go.

func (s *changesSub) Send(p []*models.ChangePayload) {
	if s.ctx.Err() != nil {
		return
	}

	for _, payload := range p {
	LOOP:
		for {
			select {
			case <-time.After(gqlgenSubChannelTimeout):
				if s.ctx.Err() != nil {
					return
				}
			case s.ch <- payload:
				break LOOP
			}
		}
	}
}

func (s *changesSub) wait() {
	<-s.ctx.Done()

	// Wait a bit to make sure the Done is noticed by Send.
	time.Sleep(gqlgenSubChannelWait)

	close(s.ch)
}

func (r *Runtime) pushStep(ctx context.Context, step *models.Step) error {
	if len(step.Transitions) == 0 {
		return errors.New("invalid step transitions")
	}

	var c models.Change

	if step.State == models.StateRunning {
		last := step.Transitions[len(step.Transitions)-1]

		r := int(last.Remaining / time.Second)
		e := int(last.Elapsed / time.Second)

		c = &models.StepChange{
			ID:        step.ID,
			Since:     &last.CreatedAt,
			State:     step.State,
			Remaining: &r,
			Elapsed:   &e,
			Running:   true,
		}
	} else {
		c = &models.StepChange{
			ID:      step.ID,
			State:   step.State,
			Running: false,
		}
	}

	chg := &models.ChangePayload{
		Change: c,
		Done:   true,
	}

	uniquePart := make(map[string]struct{})
	active := activeNodeLinks(step.Links)
	for _, link := range active {
		if _, ok := uniquePart[link.ParticipantID]; ok {
			continue
		}

		uniquePart[link.ParticipantID] = struct{}{}

		for _, sub := range r.changesSubs[link.ParticipantID] {
			sub.Send([]*models.ChangePayload{chg})
		}
	}

	return nil
}

func (r *Runtime) pushAttributesForChanges(ctx context.Context, attrs []*models.Attribute) error {
	changes := make(map[string][]*models.ChangePayload)

	for _, attr := range attrs {
		scope, ok := attr.Node.(*models.Scope)
		if !ok {
			return ErrInvalidNode
		}

		ac := &models.ChangePayload{
			Change: &models.AttributeChange{
				ID:        attr.ID,
				NodeID:    scope.ID,
				Key:       attr.Key,
				Val:       attr.Val,
				Index:     attr.Index,
				Version:   attr.Version,
				Deleted:   attr.DeletedAt != nil,
				CreatedAt: &attr.CreatedAt,
				IsNew:     attr.Version == 1,
				Vector:    attr.Vector,
			},
		}

		active := activeNodeLinks(scope.Links)
		for _, link := range active {
			changes[link.ParticipantID] = append(changes[link.ParticipantID], ac)
		}
	}

	for pID, pchanges := range changes {
		subs := r.changesSubs[pID]
		for _, sub := range subs {
			if err := sub.publish(ctx, pchanges); err != nil {
				return errors.Wrap(err, "publish changes")
			}
		}
	}

	return nil
}

func (r *Runtime) pushLinks(ctx context.Context, links []*models.Link, initParticipantSub *changesSub) error {
	changes := make(map[string][]*models.ChangePayload)

	for _, link := range links {
		pID := link.ParticipantID
		if _, ok := r.changesSubs[pID]; !ok {
			continue
		}

		switch v := link.Node.(type) {
		case *models.Scope:
			ac := &models.ChangePayload{
				Removed: !link.Link,
				Change: &models.ScopeChange{
					ID:   v.ID,
					Name: v.Name,
					Kind: v.Kind,
				},
			}
			changes[pID] = append(changes[pID], ac)

			for _, attr := range v.Attributes {
				ac := &models.ChangePayload{
					Removed: !link.Link,
					Change: &models.AttributeChange{
						ID:        attr.ID,
						NodeID:    v.ID,
						Key:       attr.Key,
						Val:       attr.Val,
						Version:   attr.Version,
						Index:     attr.Index,
						Deleted:   attr.DeletedAt != nil,
						CreatedAt: &attr.CreatedAt,
						Vector:    attr.Vector,
					},
				}

				changes[pID] = append(changes[pID], ac)
			}
		case *models.Step:
			if v.State != models.StateRunning {
				continue
			}

			if len(v.Transitions) == 0 {
				return errors.New("invalid step transitions")
			}

			last := v.Transitions[len(v.Transitions)-1]
			elapsedSinceLastStart := time.Since(last.CreatedAt)
			elapsed := int((elapsedSinceLastStart + last.Elapsed) / time.Second)
			remaining := v.Duration - elapsed

			if remaining < 0 {
				remaining = 0
			}

			running := true
			if remaining == 0 {
				running = false
			}

			changes[pID] = append(changes[pID], &models.ChangePayload{
				Removed: !link.Link,
				Change: &models.StepChange{
					ID:        v.ID,
					State:     v.State,
					Since:     &last.CreatedAt,
					Remaining: &remaining,
					Elapsed:   &elapsed,
					Running:   running, // see above, only sent when running
				},
			})
		case *models.Group:
			removed := !link.Link
			active := activeNodeLinks(v.Links)

			for _, link := range active {
				// if link.ParticipantID == pID {
				// 	continue
				// }

				changes[pID] = append(changes[pID], &models.ChangePayload{
					Removed: removed,
					Change: &models.ParticipantChange{
						ID:     link.ParticipantID,
						NodeID: v.ID,
					},
				})

				changes[link.ParticipantID] = append(changes[link.ParticipantID], &models.ChangePayload{
					Removed: removed,
					Change: &models.ParticipantChange{
						ID:     pID,
						NodeID: v.ID,
					},
				})
			}
		}
	}

	if len(changes) == 0 {
		if initParticipantSub != nil {
			initParticipantSub.Send([]*models.ChangePayload{
				{
					Done: true,
				},
			})
		}

		return nil
	}

	for pID, pchanges := range changes {
		subs := r.changesSubs[pID]
		for _, sub := range subs {
			if err := sub.publish(ctx, pchanges); err != nil {
				return errors.Wrap(err, "publish changes")
			}
		}
	}

	return nil
}

func (c *changesSub) publish(ctx context.Context, changes []*models.ChangePayload) error {
	n := 0

	// Tracking participant changes
	for _, change := range changes {
		pc, ok := change.Change.(*models.ParticipantChange)
		if !ok {
			changes[n] = change
			n++

			continue
		}

		gs, ok := c.participants[pc.ID]
		if !ok {
			if change.Removed {
				continue
			} else {
				changes[n] = change
				n++

				c.participants[pc.ID] = map[string]struct{}{pc.NodeID: {}}
				continue
			}
		}

		_, exist := gs[pc.NodeID]
		if exist {
			if change.Removed {
				changes[n] = change
				n++

				delete(c.participants[pc.ID], pc.NodeID)
				if len(c.participants[pc.ID]) == 0 {
					delete(c.participants, pc.ID)
				}
			} else {
				// Already added :shrug:
			}

			continue
		}

		if !change.Removed {
			changes[n] = change
			n++

			c.participants[pc.ID][pc.NodeID] = struct{}{}
		} else {
			// Never sent :shrug:
		}
	}

	changes = changes[:n]

	l := len(changes)

	chgs := make([]*models.ChangePayload, 0, len(changes))
	for i, change := range changes {
		change = change.DeepCopy()
		change.Done = i+1 == l
		chgs = append(chgs, change)
	}
	c.Send(chgs)

	return nil
}

func (r *Runtime) SubChanges(ctx context.Context) (<-chan *models.ChangePayload, error) {
	r.Lock()
	defer r.Unlock()

	actr := actor.ForContext(ctx)
	if actr == nil {
		return nil, ErrNotAuthorized
	}

	p, ok := actr.(*models.Participant)
	if !ok {
		return nil, errors.New("changes only for participants")
	}

	pchan := make(chan *models.ChangePayload, gqlgenSubChannelBuffer)

	go func() {
		r.Lock()

		c := newChangesSub(ctx, p, pchan)

		r.changesSubs[p.ID] = append(r.changesSubs[p.ID], c)

		if len(r.changesSubs[p.ID]) == 1 {
			r.propagateHook(ctx, mgen.EventTypeParticipantConnect, p.ID, p)
			r.propagateHook(ctx, mgen.EventTypeParticipantConnected, p.ID, p)
		}

		err := r.pushLinks(ctx, activeParticipantLinks(p.Links), c)

		r.Unlock()

		if err != nil {
			log.Ctx(r.ctx).Error().Err(err).Str("participantId", p.ID).Msg("runtime: failed initial push")
		} else {
			// Wait for end of connection
			<-ctx.Done()

			r.Lock()
			defer r.Unlock()
		}

		n := 0

		for _, cc := range r.changesSubs[p.ID] {
			if cc != c {
				r.changesSubs[p.ID][n] = cc
				n++
			}
		}

		r.changesSubs[p.ID] = r.changesSubs[p.ID][:n]

		if len(r.changesSubs[p.ID]) == 0 {
			delete(r.changesSubs, p.ID)
			r.propagateHook(ctx, mgen.EventTypeParticipantDisconnect, p.ID, p)
		}
	}()

	return pchan, nil
}
