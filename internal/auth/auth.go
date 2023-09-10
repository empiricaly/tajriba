package auth

import (
	"context"
)

type Auth struct {
	ctx    context.Context
	config *Config
}

func Init(ctx context.Context, config *Config) *Auth {
	return &Auth{
		ctx:    ctx,
		config: config,
	}
}
