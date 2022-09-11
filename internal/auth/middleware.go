package auth

import (
	"context"
	"net/http"
	"strings"

	"github.com/empiricaly/tajriba/internal/auth/actor"
	"github.com/empiricaly/tajriba/internal/runtime"
	"github.com/empiricaly/tajriba/internal/server/metadata"
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
	md := metadata.RequestForContext(ctx)
	md.Token = token

	// Allow unauthenticated users in
	if token == "" || token == "123456789" {
		if !production {
			rt := runtime.ForContext(ctx)

			return rt.SystemService, nil
		}

		return nil, ErrNotGiven
	}

	rt := runtime.ForContext(ctx)

	s, err := rt.FindSession(ctx, token)
	if err != nil {
		return nil, errors.Wrap(err, "find session")
	}

	md.Actor = s.Actor

	return s.Actor, nil
}
