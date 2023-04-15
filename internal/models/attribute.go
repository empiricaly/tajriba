package models

import (
	"strconv"
	"time"

	"github.com/empiricaly/tajriba/internal/auth/actor"
	"github.com/rs/zerolog/log"
)

// Attribute is a single piece of custom data set on a Node. Attributes
// with the same key can be grouped into an array through the use of a unique
// index field within that key's scope.
type Attribute struct {
	// id is the unique globally identifier for the record.
	ID string `json:"id"`
	// createdAt is the time of creation of the record.
	CreatedAt time.Time `json:"createdAt"`
	// createdBy is the Actor that created the record.
	CreatedByID string `json:"createdByID"`
	// createdBy is the Actor that created the record.
	CreatedBy actor.Actor `json:"-"`
	// deletedAt is the time when the Attribute was deleted. If null, the Attribute
	// was not deleted.
	DeletedAt *time.Time `json:"deletedAt,omitempty"`
	// key identifies the unique key of the Attribute.
	Key string `json:"key"`
	// val is the value of the Attribute. If val is not returned, it is considered to
	// be `null`.
	Val *string `json:"val"`
	// index of the Attribute if the value is a vector.
	Index *int `json:"index,omitempty"`
	// vector returns true if the value is a vector.
	Vector bool `json:"vector,omitempty"`
	// ID of object associated with Attribute.
	NodeID string `json:"nodeID"`
	// Object associated with Attribute.
	Node Node `json:"-"`
	// versions returns previous versions for the Attribute.
	Versions []*Attribute `json:"-"`
	// version is the version number of this Attribute, starting at 1.
	Version int `json:"-"`
	// private indicates whether the Attribute shouldn't be visible to Participants
	// in the scope.
	// private must be set on the Attribute at creation.
	Private bool `json:"private,omitempty"`
	// protected indicates the Attribute cannot be modified by other Participants. A
	// Participant can only set protected Records on their Participant record.
	// Users and Services can update protected Attributes.
	// protected must be set on the Attribute at creation.
	Protected bool `json:"protected,omitempty"`
	// immutable indicates the Attribute can never be changed by any Actor.
	// immutable must be set on the Attribute at creation.
	Immutable bool `json:"immutable,omitempty"`
}

func (Attribute) IsNode() {}
func (a *Attribute) Cursor() string {
	return a.ID
}

func (a *Attribute) LookupKey() string {
	return AttributeLookupKey(a.Key, a.Vector, a.Index, a.ID, a.NodeID)
}

func AttributeLookupKey(key string, vector bool, index *int, id, nodeID string) string {
	if vector {
		if index == nil {
			log.Warn().
				Str("attribute", id).
				Str("node", nodeID).
				Msg("vector attribute has no index")

			return key
		}

		return key + "." + strconv.Itoa(*index)
	}

	return key
}
