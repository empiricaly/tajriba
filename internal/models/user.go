package models

import "time"

// User will store the credentials of an admin.
type User struct {
	ID        string     `json:"id"`
	Name      string     `json:"name"`
	Username  string     `json:"username"`
	Password  string     `json:"-"`
	CreatedAt time.Time  `json:"createdAt"`
	Sessions  []*Session `json:"-"`
}

func (*User) IsActor() {}
func (*User) IsAdmin() {}
func (u *User) GetID() string {
	return u.ID
}
func (*User) IsNode() {}
