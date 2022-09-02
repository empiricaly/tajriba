package models

import (
	"time"
)

type ChangeDeepCopier interface {
	DeepCopy() DeepCopier
	IsChange()
}

type Change interface {
	IsChange()
}

type ChangePayload struct {
	// change is the Change.
	Change Change `json:"change"`
	// removed indicates whether the record was removed.
	Removed bool `json:"removed"`
	// done indicates that the state has finished synchorizing.
	Done bool `json:"done"`
}

// // MarshalGQLContext implements the graphql.ContextMarshaler interface
// func (c ChangePayload) MarshalGQLContext(ctx context.Context, w io.Writer) error {
// 	rt := runtime.ForContext(ctx)
// 	rt.RLock()
// 	defer rt.RUnlock()

// 	s, err := l.FormatContext(ctx)
// 	if err != nil {
// 		return err
// 	}

// 	w.Write([]byte(strconv.Quote(s)))
// 	return nil
// }

type ParticipantChange struct {
	// id is the unique globally identifier for the Participant.
	ID string `json:"-"`
	// Node this change comes from.
	NodeID string `json:"-"`
}

func (ParticipantChange) IsChange() {}

type StepChange struct {
	// id is the unique globally identifier for the Step.
	ID string `json:"id"`
	// state is the stage the Step currently is in
	State State `json:"-"`
	// since is the time from which the counter should count.
	Since *time.Time `json:"since"`
	// remaining is the duration left in seconds of the Step should last before
	// ending, from `since`.
	Remaining *int `json:"remaining"`
	// ellapsed indicates the time in seconds ellapsed since the start of the Step.
	Ellapsed *int `json:"ellapsed"`
	// running indicates whether the Step is running.
	Running bool `json:"running"`
}

func (StepChange) IsChange() {}

type AttributeChange struct {
	// id is the unique globally identifier for the Attribute.
	ID string `json:"id"`
	// id is the unique globally identifier for the Attribute's Node.
	NodeID string `json:"nodeID"`
	// deleted is true with the attribute was deleted.
	Deleted bool `json:"deleted"`
	// isNew is true if the Attribute was just created.
	IsNew bool `json:"isNew"`
	// index is the index of the attribute if the value is a vector.
	Index *int `json:"index"`
	// vector indicates whether the value is a vector.
	Vector bool `json:"vector"`
	// version is the version number of this Attribute, starting at 1.
	Version int `json:"version"`
	// key is the attribute key being updated.
	Key string `json:"key"`
	// value is the value of the updated attribute.
	Val *string `json:"val"`
}

func (AttributeChange) IsChange() {}

type ScopeChange struct {
	// id is the unique globally identifier for the Scope.
	ID string `json:"id"`
	// name is the name of the Scope.
	Name *string `json:"name"`
	// kind is the kind of the Scope.
	Kind *string `json:"kind"`
}

func (ScopeChange) IsChange() {}
