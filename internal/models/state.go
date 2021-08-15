package models

import (
	"fmt"
	"io"
	"strconv"

	"github.com/pkg/errors"
)

// State of Step.
type State string

const (
	// CREATED is when the Step has been created but hasn't started yet.
	StateCreated State = "CREATED"
	// RUNNING is when the Step is currently in progress.
	StateRunning State = "RUNNING"
	// PAUSED is when the Step has started but its timer was stopped.
	StatePaused State = "PAUSED"
	// ENDED is when the Step has finished without issues.
	StateEnded State = "ENDED"
	// TERMINATED is when the Step has been manually terminated. This could happen
	// before or during execution.
	StateTerminated State = "TERMINATED"
	// ERROR is when the Step has failed (due to an unrecoverable error).
	StateFailed State = "FAILED"
)

var AllState = []State{
	StateCreated,
	StateRunning,
	StatePaused,
	StateEnded,
	StateTerminated,
	StateFailed,
}

func (e State) IsValid() bool {
	switch e {
	case StateCreated, StateRunning, StatePaused, StateEnded, StateTerminated, StateFailed:
		return true
	}

	return false
}

func (e State) String() string {
	return string(e)
}

func (e *State) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return errors.New("enums must be strings")
	}

	*e = State(str)
	if !e.IsValid() {
		return errors.Errorf("%s is not a valid State", str)
	}

	return nil
}

func (e State) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}

func (e *State) UnmarshalJSON(b []byte) error {
	s, err := strconv.Unquote(string(b))
	if err != nil {
		return errors.Wrap(err, "unquote State")
	}

	*e = State(s)
	if !e.IsValid() {
		return errors.Errorf("%s is not a valid State", b)
	}

	return nil
}

func (e State) MarshalJSON() ([]byte, error) {
	return []byte(strconv.Quote(e.String())), nil
}
