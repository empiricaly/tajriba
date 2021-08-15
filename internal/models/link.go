package models

import (
	"time"

	"github.com/empiricaly/tajriba/internal/auth/actor"
)

// Link records a Participant linking or unlinking with a Node.
type Link struct {
	// id is the unique globally identifier for the record.
	ID string `json:"id"`
	// createdAt is the time of creation of the record.
	CreatedAt time.Time `json:"createdAt"`
	// createdBy is the Actor that created the record.
	CreatedByID string `json:"createdByID"`
	// createdBy is the Actor that created the record.
	CreatedBy actor.Actor `json:"-"`
	// link indicates whether the Participant was linked or unlinked with the
	// Node.
	Link bool `json:"link"`
	// participant that is assigned to
	ParticipantID string `json:"participantID"`
	// participant that is assigned to
	Participant *Participant `json:"-"`
	// node the Participant is assigned to.
	NodeID string `json:"nodeID"`
	// node the Participant is assigned to.
	Node Node `json:"-"`
}

func (Link) IsNode() {}

func (l *Link) Cursor() string {
	return l.ID
}
