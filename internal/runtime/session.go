package runtime

import (
	"context"
	"crypto/rand"
	"encoding/base32"
	"io"
	"net/http"
	"strings"

	"github.com/empiricaly/tajriba/internal/auth/actor"
	"github.com/empiricaly/tajriba/internal/models"
	"github.com/empiricaly/tajriba/internal/server/metadata"
	"github.com/empiricaly/tajriba/internal/store"
	"github.com/empiricaly/tajriba/internal/utils/ids"
	"github.com/pkg/errors"
)

const sessionTokenByteLength = 64

func (r *Runtime) FindSession(ctx context.Context, token string) (*models.Session, error) {
	s, ok := r.sessionsMap[token]
	if !ok {
		return nil, ErrNotFound
	}

	return s, nil
}

func (r *Runtime) createSession(ctx context.Context, actr actor.Actor) (*models.Session, error) {
	var id string

	var sessions *[]*models.Session

	switch v := actr.(type) {
	case *models.Participant:
		id = v.ID
		sessions = &v.Sessions
	case *models.Service:
		id = v.ID
		sessions = &v.Sessions
	case *models.User:
		id = v.ID
		sessions = &v.Sessions
	default:
		return nil, ErrInvalidNode
	}

	md := metadata.RequestForContext(ctx)

	token, err := generateRandomKey(sessionTokenByteLength)
	if err != nil {
		return nil, errors.Wrap(err, "generate random session token")
	}

	s := &models.Session{
		ID:        ids.ID(ctx),
		Token:     token,
		UserAgent: http.Header(md.Headers).Get("User-Agent"),
		ActorID:   id,
		Actor:     actr,
	}

	conn := store.ForContext(ctx)

	err = conn.Save(s)
	if err != nil {
		return nil, errors.Wrap(err, "save session")
	}

	*sessions = append(*sessions, s)

	r.sessions = append(r.sessions, s)
	r.sessionsMap[s.Token] = s
	r.values[s.ID] = s

	return s, nil
}

func generateRandomKey(length int) (string, error) {
	k := make([]byte, length)
	if _, err := io.ReadFull(rand.Reader, k); err != nil {
		return "", errors.Wrap(err, "copy rand chars")
	}

	return strings.TrimRight(base32.StdEncoding.EncodeToString(k), "="), nil
}
