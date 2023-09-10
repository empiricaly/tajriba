package runtime

import (
	"context"
	"strings"
	"time"

	"github.com/empiricaly/tajriba/internal/auth"
	"github.com/empiricaly/tajriba/internal/models"
	"github.com/empiricaly/tajriba/internal/store"
	"github.com/empiricaly/tajriba/internal/utils/ids"
	"github.com/pkg/errors"
)

func (r *Runtime) Login(ctx context.Context, username, password string) (*models.User, string, error) {
	r.Lock()
	defer r.Unlock()

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

func (r *Runtime) TokenLogin(ctx context.Context, token string) (*models.User, string, error) {
	r.Lock()
	defer r.Unlock()

	a := auth.ForContext(ctx)

	user, err := a.CheckPasetoToken(token)
	if err != nil {
		return nil, "", errors.Wrap(err, "check token")
	}

	obj, ok := r.values[user.ID]
	if ok {
		u, ok := obj.(*models.User)
		if !ok {
			return nil, "", errors.New("invalid user object")
		}

		u.Name = user.Name
		u.Username = user.Username

		user = u
	} else if _, err = r.saveUser(ctx, user); err != nil {
		return nil, "", errors.Wrap(err, "save user")
	}

	sess, err := r.createSession(ctx, user)
	if err != nil {
		return nil, "", errors.Wrap(err, "create session")
	}

	return user, sess.Token, errors.New("not implemented")
}

func (r *Runtime) FindUser(ctx context.Context, username string) (*models.User, error) {
	r.RLock()
	defer r.RUnlock()

	user, ok := r.usersMap[username]
	if !ok {
		return nil, ErrNotFound
	}

	return user, nil
}

func (r *Runtime) AddUser(ctx context.Context, username, name, password string) (*models.User, error) {
	r.Lock()
	defer r.Unlock()

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

	return r.saveUser(ctx, user)
}

func (r *Runtime) saveUser(ctx context.Context, user *models.User) (*models.User, error) {
	conn := store.ForContext(ctx)

	if err := conn.Save(user); err != nil {
		return nil, errors.Wrap(err, "save user")
	}

	r.usersMap[user.Username] = user
	r.users = append(r.users, user)
	r.values[user.ID] = user

	return user, nil
}
