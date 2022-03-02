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
	*objectMap
	stepTimers  map[string]*time.Timer
	changesSubs map[string][]*changesSub
	onEventSubs map[string][]*onEventSub
	sattrSubs   map[string][]*scopedAttributesSub

	SystemService *models.Service

	deadlock.RWMutex
}

func Start(ctx context.Context) (*Runtime, error) {
	log.Debug().Msg("runtime: started")

	r := &Runtime{
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
		return nil, errors.Wrap(err, "transition step")
	}

	r.SystemService = s

	rCtx := actor.SetContext(ctx, s)

	name := "global"
	if glbl, err := r.AddScope(rCtx, &name, &name, nil); err != nil {
		return nil, errors.Wrap(err, "create global context")
	} else {
		log.Trace().Interface("glbl", glbl).Msg("runtime: global created")
	}

	return r, nil
}

// func (r *Runtime) Lock()    {}
// func (r *Runtime) Unlock()  {}
// func (r *Runtime) RLock()   {}
// func (r *Runtime) RUnlock() {}

// func (r *Runtime) RealLock() {
// 	r.m.Lock()
// }

// func (r *Runtime) RealUnlock() {
// 	r.m.Unlock()
// }

// func (r *Runtime) RealRLock() {
// 	r.m.RLock()
// }

// func (r *Runtime) RealRUnlock() {
// 	r.m.RUnlock()
// }

func (r *Runtime) Stop() {
}
