package ids

import (
	"context"
	"math/rand"
	"time"

	"github.com/oklog/ulid/v2"
)

type ctxType byte

const ctxKey = ctxType(0)

func Init(ctx context.Context) (context.Context, error) {
	m := ulid.Monotonic(rand.New(rand.NewSource(time.Now().UnixNano())), 0)

	return context.WithValue(ctx, ctxKey, m), nil
}

func ForContext(ctx context.Context) *ulid.MonotonicEntropy {
	m, _ := ctx.Value(ctxKey).(*ulid.MonotonicEntropy)

	return m
}

func ID(ctx context.Context) string {
	m, ok := ctx.Value(ctxKey).(*ulid.MonotonicEntropy)
	if !ok {
		panic("IDs not initialized")
	}

	return ulid.MustNew(ulid.Now(), m).String()
}
