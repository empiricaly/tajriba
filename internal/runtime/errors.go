package runtime

import "github.com/pkg/errors"

var (
	ErrNotFound             = errors.New("not found")
	ErrInvalidState         = errors.New("invalid state")
	ErrCursorNotFound       = errors.New("cursor not found")
	ErrLengthInvalid        = errors.New("invalid pagination length")
	ErrImmutable            = errors.New("record is immutable")
	ErrEphemeral            = errors.New("record is ephemeral")
	ErrNotEphemeral         = errors.New("record is not ephemeral")
	ErrInvalidNode          = errors.New("invalid node")
	ErrNotAuthorized        = errors.New("not authorized")
	ErrAuthenticationFailed = errors.New("authentication failed")
	ErrServerError          = errors.New("server error")
	ErrAlreadyExists        = errors.New("already exists")
	ErrEmptyInput           = errors.New("empty input")
	ErrNotSupported         = errors.New("not supported")
)
