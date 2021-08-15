package models

import "time"

type Service struct {
	ID        string     `json:"id"`
	Name      string     `json:"name"`
	CreatedAt time.Time  `json:"createdAt"`
	Sessions  []*Session `json:"-"`
}

func (*Service) IsActor() {}
func (s *Service) GetID() string {
	return s.ID
}
func (*Service) IsNode() {}
