package models

import (
	"time"

	"github.com/empiricaly/tajriba/internal/auth/actor"
)

type Group struct {
	// id is the unique globally identifier for the record.
	ID string `json:"id"`
	// createdAt is the time of creation of the record.
	CreatedAt time.Time `json:"createdAt"`
	// createdBy returns the Actor that created the record
	CreatedBy actor.Actor `json:"-"`
	// createdBy returns the Actor that created the record
	CreatedByID string `json:"createdByID"`
	// links returns Participant linking and unlinking with this Node.
	Links []*Link `json:"-"`
}

func (Group) IsNode() {}

func (g *Group) Cursor() string {
	return g.ID
}
