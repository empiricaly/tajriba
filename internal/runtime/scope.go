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
)

func (r *Runtime) AddScope(ctx context.Context, name *string, kind *string, attributes []*mgen.SetAttributeInput) (*models.Scope, error) {
	actr := actor.ForContext(ctx)
	if actr == nil {
		return nil, ErrNotAuthorized
	}

	if name != nil {
		for _, s := range r.scopes {
			if s.Name != nil && *s.Name == *name {
				return nil, ErrAlreadyExists
			}
		}
	}

	now := time.Now()
	actorID := actr.GetID()

	s := &models.Scope{
		ID:            ids.ID(ctx, ids.Scope),
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
	inputs models.ScopedAttributesInputs
	scopes map[string]*models.Scope

	c chan *mgen.SubAttributesPayload
}

func (r *Runtime) SubScopedAttributes(
	ctx context.Context,
	inputs models.ScopedAttributesInputs,
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

	actr := actor.ForContext(ctx)
	if actr == nil {
		return nil, ErrNotAuthorized
	}

	actorID := actr.GetID()

	pchan := make(chan *mgen.SubAttributesPayload)

	go func() {
		r.Lock()

		c := &scopedAttributesSub{
			inputs: inputs,
			scopes: make(map[string]*models.Scope),
			c:      pchan,
		}

		r.sattrSubs[actorID] = append(r.sattrSubs[actorID], c)

		for _, s := range r.scopes {
			if c.inputs.Match(s) {
				c.scopes[s.ID] = s
			}
		}

		attrs := make([]*models.Attribute, 0)

		for _, s := range c.scopes {
			for _, a := range s.AttributesMap {
				attrs = append(attrs, a)
			}
		}

		l := len(attrs)

		for i, attr := range attrs {
			c.c <- &mgen.SubAttributesPayload{
				Attribute: attr,
				Done:      l == i+1,
			}
		}

		if len(attrs) == 0 {
			c.c <- &mgen.SubAttributesPayload{
				Done: true,
			}
		}

		r.Unlock()

		<-ctx.Done()
		r.Lock()
		defer r.Unlock()

		close(c.c)

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
					sasubs[sub] = append(sasubs[sub], as...)
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

		for i, attr := range attrs {
			sub.c <- &mgen.SubAttributesPayload{
				Attribute: attr,
				IsNew:     attr.Version == 1,
				Done:      l == i+1,
			}
		}
	}

	return nil
}
