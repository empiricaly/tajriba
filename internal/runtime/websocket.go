package runtime

import (
	"context"
	"sync/atomic"
	"time"

	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/rs/zerolog/log"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

type WebsocketWriter[T any] struct {
	module string
	ctx    context.Context

	inbound  chan []T
	outbound chan T

	buffered atomic.Int32
	size     atomic.Int32

	open   atomic.Int32
	closed chan struct{}
}

func NewWebsocketWriter[T any](ctx context.Context, module string) *WebsocketWriter[T] {
	w := &WebsocketWriter[T]{
		module:   module,
		ctx:      ctx,
		inbound:  make(chan []T, MaxWebsocketMsgBuf),
		outbound: make(chan T),
		closed:   make(chan struct{}),
	}

	go func() {
		<-ctx.Done()
		w.Close()
	}()

	go w.run()
	go w.check()

	return w
}

// DefaultMaxWebsocketMsgBuf is the default maximum number of messages that can
// be buffered.
const DefaultMaxWebsocketMsgBuf = 100_000

var (
	// MaxWebsocketMsgBuf is the maximum number of messages that can be buffered.
	MaxWebsocketMsgBuf int32 = DefaultMaxWebsocketMsgBuf

	// WebsocketCheckInterval is the interval at which we check if the buffer is
	// only growing.
	WebsocketCheckInterval = time.Second

	// WebsocketCheckThreshold is the number of times we can check the buffer
	// before we close the connection.
	WebsocketCheckThreshold = 10
)

func (s *WebsocketWriter[T]) Send(msgs []T) {
	if s.open.Load() != 0 {
		return
	}

	// NOTE: we allow the buffer to grow beyond the limit because we don't want
	// to automatically kill the connection if the client is trying to catch up.
	// But we do want to kill the connection if the client is never able to
	// catch up and blocking everyone else (see the check in the run method
	// below).
	s.buffered.Add(int32(len(msgs)))
	// buffered := s.buffered.Add(int32(len(msgs)))
	// if buffered > MaxWebsocketMsgBuf {
	// 	s.fail("websocket buffer full")

	// 	return
	// }

	select {
	case <-s.closed:
		return
	case s.inbound <- msgs:
	}
}

func (s *WebsocketWriter[T]) run() {
	defer close(s.outbound)

	for {
		select {
		case <-s.closed:
			return
		case msgs := <-s.inbound:
			for _, msg := range msgs {
				select {
				case <-s.closed:
					return
				case s.outbound <- msg:
				}
				s.buffered.Add(int32(-1))
			}

			// s.buffered.Add(int32(-len(msgs)))
		}
	}
}

func (s *WebsocketWriter[T]) check() {
	ticker := time.NewTicker(WebsocketCheckInterval)
	lastCount := int32(0)

	var timesAbove int
	lastCounts := make([]int32, 0, WebsocketCheckThreshold)

	for {
		select {
		case <-s.closed:
			return
		case <-ticker.C:
			ticker = time.NewTicker(WebsocketCheckInterval)

			// If for 10 seconds, we're still growing, then we're probably
			// dealing with a laggy client. So we close the connection.
			currentCount := s.buffered.Load()

			if currentCount != 0 && currentCount >= lastCount {
				timesAbove++

				lastCounts = append(lastCounts, currentCount)

				if timesAbove >= WebsocketCheckThreshold {
					s.fail("close on timeout")

					counts := make([]int, len(lastCounts))

					for i, c := range lastCounts {
						counts[i] = int(c)
					}

					log.Warn().
						Ints("counts", counts).
						Str("module", s.module).
						Int("threshold", WebsocketCheckThreshold).
						Str("interval", WebsocketCheckInterval.String()).
						Msg("websocket: closing connection, socket buffer size not reduced for too long")

					return
				}
			} else {
				lastCounts = lastCounts[:0]
				timesAbove = 0
			}

			lastCount = currentCount
		}
	}
}

func (s *WebsocketWriter[T]) Close() {
	if !s.open.CompareAndSwap(0, 1) {
		return
	}

	close(s.closed)

	// Drain the outbound channel
	if len(s.outbound) > 0 {
		for {
			_, ok := <-s.outbound
			if !ok {
				break
			}
		}
	}

	// Drain the inbound channel
	// We don't close the inbound channel because we don't have a non-blocking
	// way to synchronize with Send. But since it's drained, it will be garbage
	// collected when the writer is garbage collected.
	if len(s.inbound) > 0 {
		for {
			select {
			case <-s.inbound:
			default:
				return
			}
		}
	}
}

var TestingSubErrors *string

func (s *WebsocketWriter[T]) fail(err string) {
	if TestingSubErrors == nil {
		transport.AddSubscriptionError(s.ctx, gqlerror.Errorf(err))
	} else {
		TestingSubErrors = &err
	}

	s.Close()
}
