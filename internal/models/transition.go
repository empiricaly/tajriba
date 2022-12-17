package models

import (
	"time"

	"github.com/empiricaly/tajriba/internal/auth/actor"
)

// A Transition records a State change.
type Transition struct {
	// id is the unique globally identifier for the record.
	ID string `json:"id"`
	// createdAt is the time of creation of the record.
	CreatedAt time.Time `json:"createdAt"`
	// createdBy is the Actor that created the record.
	CreatedByID string `json:"createdByID"`
	// createdBy is the Actor that created the record.
	CreatedBy actor.Actor `json:"-"`
	// from is the State in which the Node was before the State change.
	From State `json:"from"`
	// to is the State in which the Node was after the State change.
	To State `json:"to"`
	// cause is an optional open string explaining the reason for the transition.
	Cause string `json:"cause"`
	// node is the Node that experienced this Transition.
	NodeID string `json:"nodeID"`
	// node is the Node that experienced this Transition.
	Node Node `json:"-"`

	Remaining time.Duration `json:"-"`
	Elapsed   time.Duration `json:"-"`
}

func (Transition) IsNode() {}

func (t *Transition) Cursor() string {
	return t.ID
}
