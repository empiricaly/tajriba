package auth

import (
	"context"

	"github.com/pkg/errors"
)

// Init creates admin object in the DB from the given configuration.
func Init(ctx context.Context, config *Config) error {
	for _, admin := range config.Users {
		err := initUser(ctx, admin)
		if err != nil {
			return errors.Wrap(err, "initialize admin")
		}
	}

	return nil
}
