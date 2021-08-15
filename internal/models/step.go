package models

import (
	"time"

	"github.com/empiricaly/tajriba/internal/auth/actor"
)

// Step is a timed virtual space where participants can meet and share data.
type Step struct {
	// id is the unique globally identifier for the record.
	ID string `json:"id"`
	// createdAt is the time of creation of the record.
	CreatedAt time.Time `json:"createdAt"`
	// createdBy returns the Actor that created the record
	CreatedByID string `json:"createdByID"`
	// createdBy returns the Actor that created the record
	CreatedBy actor.Actor `json:"-"`
	// duration is the duration in seconds of the Step should last before ending.
	Duration int `json:"duration"`
	// state is the stage the Step currently is in
	State State `json:"-"`
	// startedAt is the time at which the Step started.
	StartedAt *time.Time `json:"-"`
	// endedAt is the time at which the Step ended.
	EndedAt *time.Time `json:"-"`
	// transitions lists of States changes of the Step.
	Transitions []*Transition `json:"-"`
	// links returns Participant linking and unlinking with this Node. A single
	// Particpant might be linked and unlinked multiple times, and
	// so a Participant might have multiple Links on a Node.
	Links []*Link `json:"-"`
}

func (Step) IsNode() {}

func (s *Step) Cursor() string {
	return s.ID
}
