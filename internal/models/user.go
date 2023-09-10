package models

import (
	"strings"
	"time"

	"github.com/pkg/errors"
)

const (
	minPasswordSize = 8
)

// User will store the credentials of an admin.
type User struct {
	ID        string     `json:"id"`
	Name      string     `json:"name"`
	Username  string     `json:"username"`
	Password  string     `json:"-"`
	CreatedAt time.Time  `json:"createdAt"`
	Sessions  []*Session `json:"-"`
}

func (user *User) Validate() error {
	if strings.TrimSpace(user.Name) == "" {
		return errors.New("user name is required")
	}

	if strings.TrimSpace(user.Username) == "" {
		return errors.New("user username is required")
	}

	if strings.TrimSpace(user.Password) == "" {
		return errors.New("user password is required")
	}

	if len(strings.TrimSpace(user.Password)) < minPasswordSize {
		return errors.Errorf("user password is too small: %d chars min", minPasswordSize)
	}

	return nil
}

func (*User) IsActor() {}
func (*User) IsAdmin() {}
func (u *User) GetID() string {
	return u.ID
}
func (*User) IsNode() {}
