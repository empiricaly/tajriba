package models

//go:generate deep-copy --pointer-receiver --type Group --type Link --type Scope --type Step --type Transition --type ParticipantChange --type StepChange --type AttributeChange --type ChangePayload -o deepcopy.go .
//go:generate deep-copy --pointer-receiver --type Attribute --skip Versions -o deepcopy_attr.go .
//go:generate deep-copy --pointer-receiver --type Participant --skip Links -o deepcopy_part.go .

type DeepCopier interface {
	DeepCopy() DeepCopier
	IsNode()
}

// Node is an interface allowing simple querying of any node.
type Node interface {
	IsNode()
}
