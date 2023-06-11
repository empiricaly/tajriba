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
	"github.com/sasha-s/go-deadlock"
)

func (r *Runtime) AddScope(ctx context.Context, name *string, kind *string, attributes []*mgen.SetAttributeInput) (*models.Scope, error) {
	r.Lock()
	defer r.Unlock()

	actr := actor.ForContext(ctx)
	if actr == nil {
		return nil, ErrNotAuthorized
	}

	// var ki, na string
	// if kind != nil {
	// 	ki = *kind
	// }
	// if name != nil {
	// 	na = *name
	// }
	// spew.Dump("NEW SCOPE", ki, na, attributes)

	if name != nil {
		for _, s := range r.scopes {
			if s.Name != nil && *s.Name == *name {
				// return nil, errors.Errorf("%s (%s)", ErrAlreadyExists.Error(), *name)
				return s, nil
			}
		}
	}

	now := time.Now()
	actorID := actr.GetID()

	s := &models.Scope{
		ID:            ids.ID(ctx),
		CreatedAt:     now,
		CreatedByID:   actorID,
		CreatedBy:     actr,
		Kind:          kind,
		Name:          name,
		AttributesMap: make(map[string]*models.Attribute),
	}

	conn := store.ForContext(ctx)

	if err := conn.Save(s); err != nil {
		return nil, errors.Wrap(err, "save scope")
	}

	r.scopes = append(r.scopes, s)
	r.scopesMap[s.ID] = s
	r.values[s.ID] = s

	for _, attr := range attributes {
		attr.NodeID = &s.ID
	}

	attr, err := r.prepAttributes(ctx, attributes)
	if err != nil {
		return nil, errors.Wrap(err, "check attributes")
	}

	if _, err := r.setAttributes(ctx, attr); err != nil {
		return nil, errors.Wrap(err, "save attributes")
	}

	r.propagateHook(ctx, mgen.EventTypeScopeAdd, s.ID, s)

	return s, nil
}

func (r *Runtime) Scopes(
	ctx context.Context,
	filter models.ScopedAttributesInputs,
	after *string,
	first *int,
	before *string,
	last *int,
) (
	scopes []*models.Scope,
	total int,
	hasNext,
	hasPrev bool,
	err error,
) {
	r.RLock()
	defer r.RUnlock()

	if err := filter.Validate(true); err != nil {
		return nil, 0, false, false, errors.Wrap(err, "validate filter")
	}

	scopes = r.scopes

	// names := make([]string, len(scopes))
	// for i, s := range scopes {
	// 	names[i] = s.Name
	// }

	// spew.Dump(names)

	if !filter.IsEmpty() {
		fscopes := make([]*models.Scope, 0)

		for _, scope := range scopes {
			if filter.Match(scope) {
				fscopes = append(fscopes, scope)
			}
		}

		scopes = fscopes
	}

	items := make([]models.Cursorer, len(scopes))
	for i := range scopes {
		items[i] = scopes[i]
	}

	items, total, hasNext, hasPrev, err = paginate(items, after, first, before, last)

	scopes = make([]*models.Scope, len(items))
	for i := range items {
		scopes[i], _ = items[i].(*models.Scope)
	}

	return scopes, total, hasNext, hasPrev, err
}

func (r *Runtime) ScopeAttributes(
	ctx context.Context,
	scopeID string,
	deleted *bool,
	after *string,
	first *int,
	before *string,
	last *int,
) (
	attributes []*models.Attribute,
	total int,
	hasNext,
	hasPrev bool,
	err error,
) {
	r.RLock()
	defer r.RUnlock()

	scope, ok := r.scopesMap[scopeID]
	if !ok {
		return nil, 0, false, false, ErrNotFound
	}

	items := make([]models.Cursorer, len(scope.Attributes))
	for i := range scope.Attributes {
		items[i] = scope.Attributes[i]
	}

	items, total, hasNext, hasPrev, err = paginate(items, after, first, before, last)

	attributes = make([]*models.Attribute, len(items))
	for i := range items {
		attributes[i], _ = items[i].(*models.Attribute)
	}

	return attributes, total, hasNext, hasPrev, err
}

func (r *Runtime) ScopeLinks(
	ctx context.Context,
	scopeID string,
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

	scope, ok := r.scopesMap[scopeID]
	if !ok {
		return nil, 0, false, false, ErrNotFound
	}

	items := make([]models.Cursorer, len(scope.Links))
	for i := range scope.Links {
		items[i] = scope.Links[i]
	}

	items, total, hasNext, hasPrev, err = paginate(items, after, first, before, last)

	links = make([]*models.Link, len(items))
	for i := range items {
		links[i], _ = items[i].(*models.Link)
	}

	return links, total, hasNext, hasPrev, err
}

type scopedAttributesSub struct {
	ctx    context.Context
	inputs models.ScopedAttributesInputs
	scopes map[string]*models.Scope

	ch      chan *mgen.SubAttributesPayload
	closing chan bool
	closed  bool

	deadlock.Mutex
}

func newScopedAttributesSub(ctx context.Context, inputs models.ScopedAttributesInputs, c chan *mgen.SubAttributesPayload) *scopedAttributesSub {
	s := &scopedAttributesSub{
		ctx:     ctx,
		inputs:  inputs,
		scopes:  make(map[string]*models.Scope),
		ch:      c,
		closing: make(chan bool),
	}

	go s.wait()

	return s
}

// NOTE ABOUT CLOSING GQLGEN SUBSCRIPTION CHANNELS
//
// There's a concurrency issue with how gqlgen handles subscriptions. In theory,
// when the context is Done, the channel will not longer accept new messages.
// However, there is a window during which the context is not yet Done, but the
// channel not longer receives messages. This is because the channel will no
// longer received before the context is Done. This means we never know if the
// next send will be successful or not. To work around this, we have a retry
// loop that will try to send the message for a second before giving up and
// checking the context. If the context is Done, we will give up. If the
// context is not Done, we will try again.
// To try and mitigate this without hitting the timeout, we add a buffer on the
// channel. This means that the channel will not block up until the buffer size.
// This is fine as long as the number of messages sent is less than the buffer
// size. If the number of messages sent is greater than the buffer size, then
// the channel will block and the retry loop will kick in.

// gqlgenSubChannelBuffer is the size of the gqlgen outbound channel buffer.
// This is an arbitrary number. 🤷‍♂️
const gqlgenSubChannelBuffer = 10

// gqlgenSubChannelTimeout is the amount of time to wait for a send on the
// gqlgen outbound channel before giving up and checking the context.
const gqlgenSubChannelTimeout = time.Second

// gqlgenSubChannelWait is the amount of time to wait before closing the gqlgen
// outbound channel. It's the time we wait to make sure Send has noticed the
// context is Done.
const gqlgenSubChannelWait = 5 * time.Second

func (s *scopedAttributesSub) Send(p []*mgen.SubAttributesPayload) {
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

func (s *scopedAttributesSub) wait() {
	<-s.ctx.Done()

	// Wait a bit to make sure the Done is noticed by Send.
	time.Sleep(gqlgenSubChannelWait)

	close(s.ch)
}

func (r *Runtime) SubScopedAttributes(
	ctx context.Context,
	inputs models.ScopedAttributesInputs,
	global bool,
) (
	<-chan *mgen.SubAttributesPayload,
	error,
) {
	if err := inputs.Validate(false); err != nil {
		return nil, errors.Wrap(err, "validate filter")
	}

	if inputs.IsEmpty() {
		return nil, errors.New("ScopedAttributesInputs cannot be null")
	}

	var actorID string
	if global {
		if len(inputs) != 1 || len(inputs[0].Names) != 1 || inputs[0].Names[0] != "global" {
			return nil, ErrNotAuthorized
		}
		actorID = "global-user"
	} else {
		actr := actor.ForContext(ctx)
		if actr == nil {
			return nil, ErrNotAuthorized
		}

		actorID = actr.GetID()
	}

	pchan := make(chan *mgen.SubAttributesPayload, gqlgenSubChannelBuffer)

	go func() {
		r.Lock()

		c := newScopedAttributesSub(ctx, inputs, pchan)

		r.sattrSubs[actorID] = append(r.sattrSubs[actorID], c)

		for _, s := range r.scopes {
			if c.inputs.Match(s) {
				c.scopes[s.ID] = s
			}
		}

		attrs := make([]*models.Attribute, 0)

		for _, s := range c.scopes {
			for _, a := range s.AttributesMap {
				attrs = append(attrs, a.DeepCopy())
			}
		}

		l := len(attrs)
		r.Unlock()

		var pls []*mgen.SubAttributesPayload

		for i, attr := range attrs {
			done := l == i+1
			p := &mgen.SubAttributesPayload{
				Attribute: attr,
				Done:      done,
			}

			if done {
				p.ScopesUpdated = make([]string, 0, len(c.scopes))
				for id := range c.scopes {
					p.ScopesUpdated = append(p.ScopesUpdated, id)
				}
			}

			pls = append(pls, p)
		}

		if len(attrs) == 0 {
			scopesUpdated := make([]string, 0, len(c.scopes))
			for id := range c.scopes {
				scopesUpdated = append(scopesUpdated, id)
			}

			pls = append(pls, &mgen.SubAttributesPayload{
				Done:          true,
				ScopesUpdated: scopesUpdated,
			})
		}

		c.Send(pls)

		<-ctx.Done()

		r.Lock()
		defer r.Unlock()

		n := 0

		for _, cc := range r.sattrSubs[actorID] {
			if cc != c {
				r.sattrSubs[actorID][n] = cc
				n++
			}
		}

		r.sattrSubs[actorID] = r.sattrSubs[actorID][:n]

		if len(r.sattrSubs[actorID]) == 0 {
			delete(r.sattrSubs, actorID)
		}
	}()

	return pchan, nil
}

func (r *Runtime) pushAttributesForScopedAttributes(ctx context.Context, attrs []*models.Attribute) error {
	attrsPerScope := make(map[string][]*models.Attribute)

	for _, attr := range attrs {
		scope, ok := attr.Node.(*models.Scope)
		if !ok {
			return ErrInvalidNode
		}

		attrsPerScope[scope.ID] = append(attrsPerScope[scope.ID], attr)
	}

	sasubs := make(map[*scopedAttributesSub][]*models.Attribute)

	for _, subs := range r.sattrSubs {
		for _, sub := range subs {
			for sID, as := range attrsPerScope {
				if _, ok := sub.scopes[sID]; ok {
					for _, attr := range as {
						sasubs[sub] = append(sasubs[sub], attr.DeepCopy())
					}
				}
			}
		}
	}

	for _, subs := range r.sattrSubs {
		for _, sub := range subs {
			for _, s := range r.scopes {
				if sub.inputs.Match(s) {
					if _, ok := sub.scopes[s.ID]; !ok {
						for _, attr := range s.AttributesMap {
							sasubs[sub] = append(sasubs[sub], attr)
						}

						sub.scopes[s.ID] = s
					}
				}
			}
		}
	}

	for sub, attrs := range sasubs {
		l := len(attrs)

		var pls []*mgen.SubAttributesPayload

		for i, attr := range attrs {
			done := l == i+1
			p := &mgen.SubAttributesPayload{
				Attribute: attr,
				IsNew:     attr.Version == 1,
				Done:      done,
			}

			if done {
				p.ScopesUpdated = make([]string, 0, len(sub.scopes))
				for id := range sub.scopes {
					p.ScopesUpdated = append(p.ScopesUpdated, id)
				}
			}

			pls = append(pls, p)
		}

		sub.Send(pls)
	}

	return nil
}
