package runtime

import (
	"context"
	"time"

	"github.com/empiricaly/tajriba/internal/auth/actor"
	"github.com/empiricaly/tajriba/internal/graph/mgen"
	"github.com/empiricaly/tajriba/internal/models"
	"github.com/empiricaly/tajriba/internal/server/metadata"
	"github.com/empiricaly/tajriba/internal/store"
	"github.com/empiricaly/tajriba/internal/utils/ids"
	"github.com/pkg/errors"
	"github.com/rs/zerolog/log"
)

func (r *Runtime) AddStep(ctx context.Context, duration int) (*models.Step, error) {
	r.Lock()
	defer r.Unlock()

	actr := actor.ForContext(ctx)
	if actr == nil {
		return nil, ErrNotAuthorized
	}

	now := time.Now()
	actorID := actr.GetID()

	s := &models.Step{
		ID:          ids.ID(ctx),
		CreatedAt:   now,
		CreatedByID: actorID,
		CreatedBy:   actr,
		Duration:    duration,
		State:       models.StateCreated,
	}

	conn := store.ForContext(ctx)

	if err := conn.Save(s); err != nil {
		return nil, errors.Wrap(err, "save step")
	}

	r.steps = append(r.steps, s)
	r.stepsMap[s.ID] = s
	r.values[s.ID] = s

	r.propagateHook(ctx, mgen.EventTypeStepAdd, s.ID, s)

	return s, nil
}

func (r *Runtime) Transition(ctx context.Context, stepID string, from, to models.State, cause *string) (*models.Transition, error) {
	r.Lock()
	defer r.Unlock()

	actr := actor.ForContext(ctx)
	if actr == nil {
		return nil, ErrNotAuthorized
	}

	now := time.Now()
	actorID := actr.GetID()

	step, ok := r.stepsMap[stepID]
	if !ok {
		return nil, ErrNotFound
	}

	var caus string
	if cause != nil {
		caus = *cause
	}

	t := &models.Transition{
		ID:          ids.ID(ctx),
		CreatedAt:   now,
		CreatedByID: actorID,
		CreatedBy:   actr,
		From:        from,
		To:          to,
		Cause:       caus,
		NodeID:      stepID,
		Node:        step,
	}

	if len(step.Transitions) == 0 {
		if t.From != models.StateCreated {
			return nil, errors.New("invalid start state: not created")
		}

		if t.To == models.StatePaused {
			return nil, errors.New("invalid start state: cannot pause")
		}

		conn := store.ForContext(ctx)

		if err := conn.Save(t); err != nil {
			return nil, errors.Wrap(err, "save transition")
		}

		step.Transitions = append(step.Transitions, t)
		step.State = t.To
		step.StartedAt = &now

		r.transitions = append(r.transitions, t)
		r.transitionsMap[t.ID] = t
	} else {
		last := step.Transitions[len(step.Transitions)-1]

		if last.To != t.From {
			return nil, errors.New("invalid transition: from state mismatch with previous state")
		}

		if t.To == t.From {
			return nil, errors.New("invalid transition: from state is same as to state")
		}

		switch t.From {
		case models.StateCreated:
			log.Ctx(r.ctx).Error().
				Str("stepID", step.ID).
				Str("transitionID", last.To.String()).
				Msg("runtime: impossible from created transition")

			return nil, ErrServerError
		case models.StateRunning, models.StatePaused:
			if t.To == models.StateCreated {
				return nil, errors.New("invalid transition: cannot go back to created")
			}

			step.EndedAt = &now
		case models.StateEnded, models.StateTerminated, models.StateFailed:
			return nil, errors.New("invalid transition: already done")
		default:
			log.Ctx(r.ctx).Error().
				Str("stepID", step.ID).
				Str("transitionID", last.To.String()).
				Str("from", t.From.String()).
				Str("to", t.To.String()).
				Msg("runtime: unknown to state")

			return nil, ErrServerError
		}

		conn := store.ForContext(ctx)

		if err := conn.Save(t); err != nil {
			return nil, errors.Wrap(err, "save transition")
		}

		step.Transitions = append(step.Transitions, t)
		step.State = t.To

		r.transitions = append(r.transitions, t)
		r.transitionsMap[t.ID] = t
	}

	switch step.State {
	case models.StateRunning:
		if err := r.startStep(ctx, step); err != nil {
			return nil, errors.Wrap(err, "start step")
		}
	case models.StatePaused, models.StateEnded, models.StateTerminated, models.StateFailed:
		if err := r.stopStep(ctx, step.ID); err != nil {
			return nil, errors.Wrap(err, "stop step")
		}
	case models.StateCreated:
		log.Ctx(r.ctx).Error().
			Msg("runtime: transition with to state created")
		return nil, errors.New("transition with to state created")
	default:
		log.Ctx(r.ctx).Error().
			Str("stepID", step.ID).
			Str("transitionID", t.ID).
			Str("from", t.From.String()).
			Str("to", t.To.String()).
			Msg("runtime: unknown to state")

		return nil, ErrServerError
	}

	r.propagateHook(ctx, mgen.EventTypeTransitionAdd, step.ID, t)

	if err := r.pushStep(ctx, step); err != nil {
		log.Ctx(r.ctx).Error().Err(err).Msg("runtime: failed to push step transition to participants")
	}

	return t, nil
}

func (r *Runtime) startStep(ctx context.Context, s *models.Step) error {
	if len(s.Transitions) == 0 {
		return errors.New("invalid start state: no transitions")
	}

	last := s.Transitions[len(s.Transitions)-1]
	if last.To != models.StateRunning {
		return errors.New("invalid start state: not running")
	}

	var (
		elapsed     time.Duration
		lastStarted *time.Time
	)

	for _, t := range s.Transitions {
		switch t.To {
		case models.StateRunning:
			lastStarted = &t.CreatedAt
		case models.StatePaused:
			if lastStarted == nil {
				return errors.New("invalid transition: pause before running")
			}

			e := t.CreatedAt.Sub(*lastStarted)
			if e < 0 {
				return errors.New("invalid transition: pause before running")
			}

			elapsed += e
			lastStarted = nil
		case models.StateCreated:
			return errors.New("invalid start state: not started yet")
		case models.StateEnded, models.StateFailed, models.StateTerminated:
			return errors.New("invalid start state: already done")
		default:
			return errors.New("invalid start state: unknown")
		}
	}

	remaining := time.Second*time.Duration(s.Duration) - elapsed
	if remaining <= 0 {
		return errors.New("invalid start state: duration exhausted")
	}

	// log.Ctx(r.ctx).Info().Str("id", s.ID).Msg("STARTING STEP")

	if _, ok := r.stepTimers[s.ID]; ok {
		return errors.New("step already started")
	}

	last.Remaining = remaining
	last.Elapsed = elapsed

	ctxStop := metadata.SetRequestForContext(ctx, nil)
	r.stepTimers[s.ID] = time.AfterFunc(remaining, func() {
		r.Lock()
		delete(r.stepTimers, s.ID)
		r.Unlock()

		_, err := r.Transition(ctxStop, s.ID, models.StateRunning, models.StateEnded, nil)
		if err != nil {
			log.Ctx(r.ctx).Error().Err(err).Str("stepID", s.ID).Msg("runtime: failed scheduled step stop")
		}
	})

	return nil
}

func (r *Runtime) stopStep(ctx context.Context, stepID string) error {
	// log.Ctx(r.ctx).Info().Str("id", stepID).Msg("step: stopping")
	if t, ok := r.stepTimers[stepID]; ok {
		if !t.Stop() {
			<-t.C
		}
		// log.Ctx(r.ctx).Info().Str("id", stepID).Msg("step: stopped")
	}

	return nil
}

func (r *Runtime) Steps(
	ctx context.Context,
	after *string,
	first *int,
	before *string,
	last *int,
) (
	steps []*models.Step,
	total int,
	hasNext,
	hasPrev bool,
	err error,
) {
	r.RLock()
	defer r.RUnlock()

	items := make([]models.Cursorer, len(r.steps))
	for i := range r.steps {
		items[i] = r.steps[i]
	}

	items, total, hasNext, hasPrev, err = paginate(items, after, first, before, last)

	steps = make([]*models.Step, len(items))
	for i := range items {
		steps[i], _ = items[i].(*models.Step)
	}

	return steps, total, hasNext, hasPrev, err
}

func (r *Runtime) StepLinks(
	ctx context.Context,
	step *models.Step,
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

	items := make([]models.Cursorer, len(step.Links))
	for i := range step.Links {
		items[i] = step.Links[i]
	}

	items, total, hasNext, hasPrev, err = paginate(items, after, first, before, last)

	links = make([]*models.Link, len(items))
	for i := range items {
		links[i], _ = items[i].(*models.Link)
	}

	return links, total, hasNext, hasPrev, err
}

func (r *Runtime) StepTransitions(
	ctx context.Context,
	step *models.Step,
	after *string,
	first *int,
	before *string,
	last *int,
) (
	transitions []*models.Transition,
	total int,
	hasNext,
	hasPrev bool,
	err error,
) {
	r.RLock()
	defer r.RUnlock()

	items := make([]models.Cursorer, len(step.Transitions))
	for i := range step.Transitions {
		items[i] = step.Transitions[i]
	}

	items, total, hasNext, hasPrev, err = paginate(items, after, first, before, last)

	transitions = make([]*models.Transition, len(items))
	for i := range items {
		transitions[i], _ = items[i].(*models.Transition)
	}

	return transitions, total, hasNext, hasPrev, err
}
