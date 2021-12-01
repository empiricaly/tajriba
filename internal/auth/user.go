package auth

import (
	"context"

	"github.com/empiricaly/tajriba/internal/models"
	"github.com/empiricaly/tajriba/internal/runtime"
	"github.com/pkg/errors"
)

// Init creates admin object in the DB from the given configuration.
func initUser(ctx context.Context, a models.User) error {
	rt := runtime.ForContext(ctx)

	_, err := rt.AddUser(ctx, a.Username, a.Name, a.Password)
	if err != nil {
		return errors.Wrap(err, "add init user")
	}

	return nil
}
