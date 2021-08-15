package ids

import (
	"context"

	"github.com/muyo/sno"
	"github.com/pkg/errors"
	"github.com/rs/zerolog/log"
)

type Pool struct {
	*sno.Generator
}

func New() (*Pool, error) {
	c := make(chan *sno.SequenceOverflowNotification)

	generator, err := sno.NewGenerator(&sno.GeneratorSnapshot{
		// ? Can expose this if needed
		Partition: sno.Partition{'T', 'J'},
	}, c)
	if err != nil {
		return nil, errors.Wrap(err, "create new id generator")
	}

	go func() {
		for {
			n := <-c
			log.Warn().Interface("notif", n).Msg("ids: ids overflowed!")
		}
	}()

	return &Pool{Generator: generator}, nil
}

type ctxType byte

const ctxKey = ctxType(0)

func Init(ctx context.Context) (context.Context, error) {
	p, err := New()
	if err != nil {
		return nil, errors.Wrap(err, "init ID generator")
	}

	return context.WithValue(ctx, ctxKey, p), nil
}

func ForContext(ctx context.Context) *Pool {
	raw, _ := ctx.Value(ctxKey).(*Pool)

	return raw
}

func ID(ctx context.Context, t IDType) string {
	raw, _ := ctx.Value(ctxKey).(*Pool)

	return raw.ID(t)
}

func Type(ctx context.Context, id string) (IDType, error) {
	raw, _ := ctx.Value(ctxKey).(*Pool)

	return raw.Type(id)
}

func TypeB(ctx context.Context, id []byte) (IDType, error) {
	raw, _ := ctx.Value(ctxKey).(*Pool)

	return raw.TypeB(id)
}

type IDType uint8

const (
	Scope IDType = iota
	Step
	Attribute
	Participant
	User
	Link
	Transition
	Service
	Session
	Group
)

func (p *Pool) ID(t IDType) string {
	return p.New(byte(t)).String()
}

func (p *Pool) Type(id string) (IDType, error) {
	i, err := sno.FromEncodedString(id)
	if err != nil {
		return 0, errors.Wrap(err, "decode id")
	}

	return IDType(IDType(i.Meta())), nil
}

func (p *Pool) TypeB(id []byte) (IDType, error) {
	i, err := sno.FromEncodedBytes(id)
	if err != nil {
		return 0, errors.Wrap(err, "decode id")
	}

	return IDType(IDType(i.Meta())), nil
}
