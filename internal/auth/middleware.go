package auth

import (
	"context"
	"net/http"
	"strings"

	"github.com/empiricaly/tajriba/internal/auth/actor"
	"github.com/empiricaly/tajriba/internal/runtime"
	"github.com/pkg/errors"
)

// Middleware is an HTTP handler that looks up authentication and sets it in
// context if found.
type Middleware struct {
	handler http.Handler
}

// NewMiddleware creates a Middleware handler.
func NewMiddleware(handler http.Handler) *Middleware {
	return &Middleware{
		handler: handler,
	}
}

// ServeHTTP inplements the http.Hander interface.
func (m *Middleware) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	token := r.Header.Get("Authorization")

	actr, err := GetAuthentication(r.Context(), token)
	if err != nil {
		if errors.Is(err, ErrNotGiven) {
			m.handler.ServeHTTP(w, r)
		} else {
			// http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
			http.Error(w, `{"errors":[{"message":"must authenticate","extensions":{"code":"UNAUTHENTICATED"}}]}`, http.StatusUnauthorized)
		}

		return
	}

	// Put it in context
	ctx := actor.SetContext(r.Context(), actr)
	r = r.WithContext(ctx)

	m.handler.ServeHTTP(w, r)
}

var (
	ErrNotGiven = errors.New("not given")
	ErrNotFound = errors.New("not found")
)

func GetAuthentication(ctx context.Context, token string) (actor.Actor, error) {
	token = strings.TrimSpace(strings.TrimPrefix(token, "Bearer "))

	// Allow unauthenticated users in
	if token == "" {
		return nil, ErrNotGiven
	}

	rt := runtime.ForContext(ctx)

	s, err := rt.FindSession(ctx, token)
	if err != nil {
		return nil, errors.Wrap(err, "find session")
	}

	return s.Actor, nil
}
