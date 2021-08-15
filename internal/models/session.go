package models

import "github.com/empiricaly/tajriba/internal/auth/actor"

type Session struct {
	ID        string      `json:"id"`
	Token     string      `json:"token"`
	UserAgent string      `json:"userAgent"`
	ActorID   string      `json:"actorID"`
	Actor     actor.Actor `json:"-"`
}
