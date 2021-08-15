package graph

import (
	"context"

	"github.com/99designs/gqlgen/graphql"
	"github.com/empiricaly/tajriba/internal/auth/actor"
	"github.com/empiricaly/tajriba/internal/graph/mgen"
	"github.com/empiricaly/tajriba/internal/models"
	"github.com/pkg/errors"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

// Resolver is the root for all GraphQL resolvers.
type Resolver struct {
	ctx context.Context
	srt string
}

// NewSchema creates a graphql executable schema.
func NewSchema(ctx context.Context, srt string) graphql.ExecutableSchema {
	config := Config{
		Resolvers: &Resolver{
			ctx: ctx,
			srt: srt,
		},
	}

	config.Directives.HasRole = func(
		ctx context.Context,
		_ interface{},
		next graphql.Resolver,
		role mgen.Role,
	) (interface{}, error) {
		u := actor.ForContext(ctx)

		if u == nil {
			return nil, errors.New("Access Denied")
		}

		if role == mgen.RoleAdmin {
			if _, ok := u.(*models.User); !ok {
				if _, ok := u.(*models.Service); !ok {
					return nil, errors.New("Access Denied")
				}
			}
		}

		if role == mgen.RoleParticipant {
			if _, ok := u.(*models.Participant); !ok {
				return nil, errors.New("Access Denied")
			}
		}

		return next(ctx)
	}

	return NewExecutableSchema(config)
}
