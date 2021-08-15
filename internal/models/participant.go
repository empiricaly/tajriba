package models

import "time"

type Participant struct {
	// id is the unique globally identifier for the record.
	ID string `json:"id"`
	// createdAt is the time of creation of the record.
	CreatedAt time.Time `json:"createdAt"`
	// identifier is the unique identifier for the Pariticipant. This is different
	// from the id field, which is the database internal identifier. The identifier
	// is how a participant "logs into" the system.
	Identifier string
	// assignationChanges returns Participant assignments and unassignments to this
	// Step. A single Particpant might be assigned and unassigned multiple times, and
	// so a Participant might have multiple AssignationChanges on a Step.
	Links    []*Link    `json:"-"`
	Sessions []*Session `json:"-"`
}

func (p *Participant) Cursor() string {
	return p.ID
}
func (*Participant) IsActor() {}
func (p *Participant) GetID() string {
	return p.ID
}
func (*Participant) IsNode() {}
