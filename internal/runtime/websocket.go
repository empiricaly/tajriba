package runtime

import (
	"context"
	"sync/atomic"

	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

type WebsocketWriter[T any] struct {
	ctx context.Context

	inbound  chan []T
	outbound chan T

	buffered atomic.Int32

	open   atomic.Int32
	closed chan struct{}
}

func NewWebsocketWriter[T any](ctx context.Context) *WebsocketWriter[T] {
	w := &WebsocketWriter[T]{
		ctx:      ctx,
		inbound:  make(chan []T, MaxWebsocketMsgBuf),
		outbound: make(chan T, MaxWebsocketMsgBuf),
		closed:   make(chan struct{}),
	}

	go func() {
		<-ctx.Done()
		w.Close()
	}()

	go w.run()

	return w
}

// MaxWebsocketMsgBuf is the maximum number of messages that can be buffered
// before we close the websocket.
var MaxWebsocketMsgBuf = 500

func (s *WebsocketWriter[T]) Send(msgs []T) {
	if s.open.Load() != 0 {
		return
	}

	buffered := s.buffered.Add(int32(len(msgs)))
	if int(buffered) > MaxWebsocketMsgBuf {
		s.fail("websocket buffer full")

		return
	}

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
			s.buffered.Add(int32(-len(msgs)))

			for _, msg := range msgs {
				select {
				case <-s.closed:
					return
				case s.outbound <- msg:
				}
			}
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
