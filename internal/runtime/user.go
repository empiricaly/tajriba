package runtime

import (
	"context"
	"strings"
	"time"

	"github.com/empiricaly/tajriba/internal/models"
	"github.com/empiricaly/tajriba/internal/store"
	"github.com/empiricaly/tajriba/internal/utils/ids"
	"github.com/pkg/errors"
)

func (r *Runtime) Login(ctx context.Context, username, password string) (*models.User, string, error) {
	user, ok := r.usersMap[username]

	if !ok {
		return nil, "", ErrAuthenticationFailed
	}

	if user.Password != password {
		return nil, "", ErrAuthenticationFailed
	}

	sess, err := r.createSession(ctx, user)
	if err != nil {
		return nil, "", errors.Wrap(err, "create session")
	}

	return user, sess.Token, nil
}

func (r *Runtime) FindUser(ctx context.Context, username string) (*models.User, error) {
	user, ok := r.usersMap[username]
	if !ok {
		return nil, ErrNotFound
	}

	return user, nil
}

func (r *Runtime) AddUser(ctx context.Context, username, name, password string) (*models.User, error) {
	user, ok := r.usersMap[username]
	if ok {
		user.Password = password

		return user, nil
	}

	name = strings.TrimSpace(name)
	username = strings.TrimSpace(username)
	password = strings.TrimSpace(password)

	if name == "" || username == "" || password == "" {
		return nil, errors.New("name, username and password cannot be empty")
	}

	user = &models.User{
		ID:        ids.ID(ctx),
		Name:      name,
		Username:  username,
		Password:  password,
		CreatedAt: time.Now(),
	}

	conn := store.ForContext(ctx)

	if err := conn.Save(user); err != nil {
		return nil, errors.Wrap(err, "save user")
	}

	r.usersMap[username] = user
	r.users = append(r.users, user)
	r.values[user.ID] = user

	return user, nil
}
