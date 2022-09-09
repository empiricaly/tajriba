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

func (r *Runtime) RegisterService(ctx context.Context, name string, createSession bool) (*models.Service, string, error) {
	r.Lock()
	defer r.Unlock()

	name = strings.TrimSpace(name)

	if name == "" {
		return nil, "", errors.New("name cannot be empty")
	}

	var serv *models.Service

	for _, s := range r.services {
		if s.Name == name {
			serv = s

			break
		}
	}

	if serv == nil {
		serv = &models.Service{
			ID:        ids.ID(ctx),
			Name:      name,
			CreatedAt: time.Now(),
		}

		conn := store.ForContext(ctx)

		if err := conn.Save(serv); err != nil {
			return nil, "", errors.Wrap(err, "save service")
		}

		r.services = append(r.services, serv)
		r.servicesMap[serv.ID] = serv
	}

	var token string

	if createSession {
		sess, err := r.createSession(ctx, serv)
		if err != nil {
			return nil, "", errors.Wrap(err, "create session")
		}

		token = sess.Token
	}

	return serv, token, nil
}
