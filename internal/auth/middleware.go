package auth

import (
	"context"
	"net/http"
	"strings"
	"time"

	"github.com/empiricaly/tajriba/internal/auth/actor"
	"github.com/empiricaly/tajriba/internal/models"
	"github.com/empiricaly/tajriba/internal/runtime"
	"github.com/julienschmidt/httprouter"
	"github.com/pkg/errors"
)

const unauthPayload = `{"errors":[{"message":"must authenticate","extensions":{"code":"UNAUTHENTICATED"}}]}`

// Middleware creates a Middleware handler.
func Middleware(h httprouter.Handle, production bool) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		token := r.Header.Get("Authorization")

		actr, err := GetAuthentication(r.Context(), token, production)
		if err != nil {
			if errors.Is(err, ErrNotGiven) {
				h(w, r, ps)
			} else {
				http.Error(w, unauthPayload, http.StatusUnauthorized)
			}

			return
		}

		// Put it in context
		ctx := actor.SetContext(r.Context(), actr)
		r = r.WithContext(ctx)

		h(w, r, ps)
	}
}

var (
	ErrNotGiven = errors.New("not given")
	ErrNotFound = errors.New("not found")
)

func GetAuthentication(ctx context.Context, token string, production bool) (actor.Actor, error) {
	token = strings.TrimSpace(strings.TrimPrefix(token, "Bearer "))

	// Allow unauthenticated users in
	if token == "" || token == "123456789" {
		if !production {
			return &models.User{
				ID:        "01FNJ3A2MCP4SPHQ9X7RM27SYX",
				Name:      "Dev User",
				Username:  "dev",
				Password:  "password123",
				CreatedAt: time.Now(),
			}, nil
		}

		return nil, ErrNotGiven
	}

	rt := runtime.ForContext(ctx)

	s, err := rt.FindSession(ctx, token)
	if err != nil {
		return nil, errors.Wrap(err, "find session")
	}

	return s.Actor, nil
}
