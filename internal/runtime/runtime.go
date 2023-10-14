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
	ctx    context.Context
	config *Config
	*objectMap
	stepTimers  map[string]*time.Timer
	changesSubs map[string][]*changesSub
	onEventSubs map[string][]*onEventSub
	sattrSubs   map[string][]*scopedAttributesSub

	SystemService *models.Service

	deadlock.RWMutex
}

func Start(ctx context.Context, config *Config, initialUsers []models.User) (*Runtime, error) {
	log.Ctx(ctx).Debug().Msg("runtime: started")

	r := &Runtime{
		ctx:         ctx,
		config:      config,
		objectMap:   newObjectMap(),
		stepTimers:  make(map[string]*time.Timer),
		changesSubs: make(map[string][]*changesSub),
		onEventSubs: make(map[string][]*onEventSub),
		sattrSubs:   make(map[string][]*scopedAttributesSub),
	}

	MaxWebsocketMsgBuf = config.WebsocketMsgBuf

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
}
