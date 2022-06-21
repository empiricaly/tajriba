package models

import (
	"time"

	"github.com/empiricaly/tajriba/internal/auth/actor"
	"github.com/pkg/errors"
)

type Scope struct {
	// id is the unique globally identifier for the record.
	ID string `json:"id"`
	// name is the *unique* name of the Scope.
	Name *string `json:"name"`
	// kind is an optional type name.
	Kind *string `json:"kind"`
	// createdAt is the time of creation of the record.
	CreatedAt time.Time `json:"createdAt"`
	// createdBy is the Actor that created the record.
	CreatedByID string `json:"createdByID"`
	// createdBy is the Actor that created the record.
	CreatedBy actor.Actor `json:"-"`
	// attributes returns all custom data that has been set on the Scope.
	Attributes []*Attribute `json:"-"`
	// attributes returns all custom data that has been set on the Scope.
	AttributesMap map[string]*Attribute `json:"-"`
	// assignationChanges returns Participant assignments and unassignments to this
	// Step. A single Particpant might be assigned and unassigned multiple times, and
	// so a Participant might have multiple AssignationChanges on a Step.
	Links []*Link `json:"-"`
}

func (s *Scope) Cursor() string {
	return s.ID
}
func (Scope) IsNode() {}

type KV struct {
	Key string `json:"key"`
	Val string `json:"val"`
}

// ScopedAttributesInput subscribes to attributes in matching scopes. Either keys
// or kvs exclusively must be provided.
type ScopedAttributesInput struct {
	// ids of the matching Scopes.
	IDs []string `json:"ids"`

	// names of the matching Scopes.
	Names []string `json:"names"`

	// kinds of the matching Scopes.
	Kinds []string `json:"kinds"`

	// keys to Attributes in matching Scope.
	Keys []string `json:"keys"`

	// kvs to Attributes in matching Scope.
	KVs []*KV `json:"kvs"`
}

func (s *ScopedAttributesInput) Validate(noneOK bool) error {
	filters := 0
	if len(s.Keys) > 0 {
		filters++
	}

	if len(s.KVs) > 0 {
		filters++
	}

	if len(s.Names) > 0 {
		filters++
	}

	if len(s.Kinds) > 0 {
		filters++
	}

	if filters > 1 {
		return errors.New("has name, kind, keys and/or kvs: must have only one filter")
	}

	if !noneOK && filters == 0 {
		return errors.New("missing filter")
	}

	return nil
}

func (s *ScopedAttributesInput) Match(scope *Scope) bool {
	if len(s.IDs) > 0 {
		for _, id := range s.IDs {
			if id == scope.ID {
				return true
			}
		}

		return false
	}

	if len(s.Names) > 0 && scope.Name != nil {
		for _, name := range s.Names {
			if name == *scope.Name {
				return true
			}
		}

		return false
	}

	if len(s.Kinds) > 0 && scope.Kind != nil {
		for _, kind := range s.Kinds {
			if kind == *scope.Kind {
				return true
			}
		}

		return false
	}

	if len(s.Keys) > 0 {
		for _, key := range s.Keys {
			if _, ok := scope.AttributesMap[key]; !ok {
				return false
			}
		}

		return true
	}

	if len(s.KVs) > 0 {
		for _, kv := range s.KVs {
			if v, ok := scope.AttributesMap[kv.Key]; !ok || v.Val == nil || *v.Val != kv.Val {
				return false
			}
		}

		return true
	}

	return false
}

// ScopedAttributesInputs is a list of ScopedAttributesInput.
type ScopedAttributesInputs []*ScopedAttributesInput

func (s ScopedAttributesInputs) IsEmpty() bool {
	return len(s) == 0
}

func (s ScopedAttributesInputs) Validate(noneOK bool) error {
	for _, sa := range s {
		if err := sa.Validate(noneOK); err != nil {
			return errors.Wrap(err, "validate scoped attributes input")
		}
	}

	if !noneOK && len(s) == 0 {
		return errors.New("requires a least 1 scoped attr input")
	}

	return nil
}

func (s ScopedAttributesInputs) Match(scope *Scope) bool {
	for _, sa := range s {
		if sa.Match(scope) {
			return true
		}
	}

	return false
}
