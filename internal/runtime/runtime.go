package runtime

import (
	"context"
	"time"

	"github.com/empiricaly/tajriba/internal/auth/actor"
	"github.com/empiricaly/tajriba/internal/models"
	"github.com/pkg/errors"
	"github.com/rs/zerolog/log"
	"github.com/sasha-s/go-deadlock"
)

type Runtime struct {
	ctx context.Context
	*objectMap
	stepTimers  map[string]*time.Timer
	changesSubs map[string][]*changesSub
	onEventSubs map[string][]*onEventSub
	sattrSubs   map[string][]*scopedAttributesSub

	SystemService *models.Service

	deadlock.RWMutex
}

func Start(ctx context.Context, initialUsers []models.User) (*Runtime, error) {
	log.Ctx(ctx).Debug().Msg("runtime: started")

	r := &Runtime{
		ctx:         ctx,
		objectMap:   newObjectMap(),
		stepTimers:  make(map[string]*time.Timer),
		changesSubs: make(map[string][]*changesSub),
		onEventSubs: make(map[string][]*onEventSub),
		sattrSubs:   make(map[string][]*scopedAttributesSub),
	}

	if err := r.load(ctx); err != nil {
		return nil, errors.Wrap(err, "load values")
	}

	s, _, err := r.RegisterService(ctx, "system", false)
	if err != nil {
		return nil, errors.Wrap(err, "register service")
	}

	r.SystemService = s

	rCtx := actor.SetContext(ctx, s)

	name := "global"
	if glbl, err := r.AddScope(rCtx, &name, &name, nil); err != nil {
		return nil, errors.Wrap(err, "create global context")
	} else {
		log.Ctx(r.ctx).Trace().Interface("glbl", glbl).Msg("runtime: global created")
	}

	for _, u := range initialUsers {
		if _, err := r.AddUser(rCtx, u.Username, u.Name, u.Password); err != nil {
			return nil, errors.Wrap(err, "create initial user")
		}
	}

	return r, nil
}

func (r *Runtime) Stop() {
	r.Lock()
	defer r.Unlock()

	// Stop all step timers
	for stepID, timer := range r.stepTimers {
		if timer != nil {
			if !timer.Stop() {
				// Try to drain the timer channel if it already fired
				select {
				case <-timer.C:
				default:
				}
			}
			delete(r.stepTimers, stepID)
		}
	}

	// Clear all subscriptions to prevent goroutine leaks
	// Clear change subscriptions
	for pID, subs := range r.changesSubs {
		for _, sub := range subs {
			if sub != nil && sub.sendBuf != nil {
				sub.sendBuf.Close()
			}
		}
		delete(r.changesSubs, pID)
	}

	// Clear event subscriptions
	for actorID, subs := range r.onEventSubs {
		for _, sub := range subs {
			if sub != nil && sub.sendBuf != nil {
				sub.sendBuf.Close()
			}
		}
		delete(r.onEventSubs, actorID)
	}

	// Clear scoped attribute subscriptions
	for actorID, subs := range r.sattrSubs {
		for _, sub := range subs {
			if sub != nil && sub.sendBuf != nil {
				sub.sendBuf.Close()
			}
		}
		delete(r.sattrSubs, actorID)
	}

	log.Ctx(r.ctx).Debug().Msg("runtime: stopped")
}

// LogStats logs current runtime statistics for debugging
func (r *Runtime) LogStats(context string) {
	r.RLock()
	defer r.RUnlock()

	subscriptionCounts := map[string]int{
		"changes":    0,
		"events":     0,
		"attributes": 0,
	}

	for _, subs := range r.changesSubs {
		subscriptionCounts["changes"] += len(subs)
	}

	for _, subs := range r.onEventSubs {
		subscriptionCounts["events"] += len(subs)
	}

	for _, subs := range r.sattrSubs {
		subscriptionCounts["attributes"] += len(subs)
	}

	log.Ctx(r.ctx).Info().
		Str("context", context).
		Int("active_timers", len(r.stepTimers)).
		Int("total_subscriptions", subscriptionCounts["changes"]+subscriptionCounts["events"]+subscriptionCounts["attributes"]).
		Interface("subscription_breakdown", subscriptionCounts).
		Int("total_scopes", len(r.scopes)).
		Int("total_steps", len(r.steps)).
		Int("total_participants", len(r.participants)).
		Int("total_groups", len(r.groups)).
		Msg("runtime: state stats")
}
