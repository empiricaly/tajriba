package runtime

import (
	"context"
	"time"

	"github.com/empiricaly/tajriba/internal/graph/mgen"
	"github.com/empiricaly/tajriba/internal/models"
	"github.com/empiricaly/tajriba/internal/store"
	"github.com/empiricaly/tajriba/internal/utils/ids"
	"github.com/pkg/errors"
)

func (r *Runtime) AddParticipant(ctx context.Context, identifier string) (*models.Participant, string, error) {
	r.Lock()
	defer r.Unlock()

	var participant *models.Participant

	for _, p := range r.participants {
		if p.Identifier == identifier {
			participant = p
			break
		}
	}

	if participant == nil {
		participant = &models.Participant{
			ID:         ids.ID(ctx),
			CreatedAt:  time.Now(),
			Identifier: identifier,
		}

		conn := store.ForContext(ctx)

		err := conn.Save(participant)
		if err != nil {
			return nil, "", errors.Wrap(err, "save participant")
		}

		r.participants = append(r.participants, participant)
		r.participantsMap[participant.ID] = participant
		r.values[participant.ID] = participant

		r.propagateHook(ctx, mgen.EventTypeParticipantAdd, participant.ID, participant)
	}

	sess, err := r.createSession(ctx, participant)
	if err != nil {
		return nil, "", errors.Wrap(err, "create session")
	}

	return participant, sess.Token, nil
}

func (r *Runtime) ParticpantLinks(
	ctx context.Context,
	particpantID string,
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

	p, ok := r.participantsMap[particpantID]
	if !ok {
		return nil, 0, false, false, ErrNotFound
	}

	items := make([]models.Cursorer, len(p.Links))
	for i := range p.Links {
		items[i] = p.Links[i]
	}

	items, total, hasNext, hasPrev, err = paginate(items, after, first, before, last)

	links = make([]*models.Link, len(items))
	for i := range items {
		links[i], _ = items[i].(*models.Link)
	}

	return links, total, hasNext, hasPrev, err
}

func (r *Runtime) Particpants(
	ctx context.Context,
	after *string,
	first *int,
	before *string,
	last *int,
) (
	participants []*models.Participant,
	total int,
	hasNext,
	hasPrev bool,
	err error,
) {
	r.RLock()
	defer r.RUnlock()

	items := make([]models.Cursorer, len(r.participants))
	for i := range r.participants {
		items[i] = r.participants[i]
	}

	items, total, hasNext, hasPrev, err = paginate(items, after, first, before, last)

	participants = make([]*models.Participant, len(items))
	for i := range items {
		participants[i], _ = items[i].(*models.Participant)
	}

	return participants, total, hasNext, hasPrev, err
}
