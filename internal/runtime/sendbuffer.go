package runtime

import (
	"sync"

	"github.com/sasha-s/go-deadlock"
)

// SendBuffer is a generic buffer that can handle elements of any type T
type SendBuffer[T any] struct {
	cond       *sync.Cond
	buffer     []T
	outputChan chan T
	close      chan struct{}
	closed     bool
	wg         sync.WaitGroup

	mu deadlock.Mutex
}

// NewSendBuffer creates a new Buffer instance
func NewSendBuffer[T any]() *SendBuffer[T] {
	b := &SendBuffer[T]{
		buffer:     make([]T, 0),
		outputChan: make(chan T),
		close:      make(chan struct{}),
	}
	b.cond = sync.NewCond(&b.mu)

	b.wg.Add(1)
	go b.process()

	return b
}

func (b *SendBuffer[T]) Out() <-chan T {
	return b.outputChan
}

// Send adds data to the buffer
func (b *SendBuffer[T]) Send(data []T) {
	b.mu.Lock()
	defer b.mu.Unlock()

	if b.closed {
		return // Do not accept new data if the buffer is closed
	}

	b.buffer = append(b.buffer, data...)
	b.cond.Signal() // Signal the processing goroutine that new data is available
}

// process handles sending data from the buffer to the output channel
func (b *SendBuffer[T]) process() {
	defer b.wg.Done()

	for {
		b.mu.Lock()

		for len(b.buffer) == 0 {
			if b.closed {
				b.mu.Unlock()

				return // Close the goroutine if no more data and buffer is closed
			}

			b.cond.Wait() // Wait for new data
		}

		items := make([]T, len(b.buffer))
		copy(items, b.buffer)
		b.buffer = b.buffer[:0]

		b.mu.Unlock()

		for _, item := range items {
			select {
			case <-b.close:
				return // Close the goroutine if the buffer is closed
			case b.outputChan <- item: // Send the item to the output channel
			}
		}

		// // Send the first item in the buffer
		// item := b.buffer[0]
		// b.buffer = b.buffer[1:]

		// b.mu.Unlock()

		// b.outputChan <- item // Send the item to the output channel
	}
}

// Close signals that no more data will be sent and waits for processing to finish
func (b *SendBuffer[T]) Close() {
	b.mu.Lock()
	b.closed = true
	b.cond.Signal() // Signal any waiting goroutine to finish up
	close(b.close)
	b.mu.Unlock()

	b.wg.Wait() // Wait for the processing goroutine to finish
	close(b.outputChan)
}

// func main() {
// 	// Example usage
// 	outputChan := make(chan int)
// 	buffer := NewBuffer[int](outputChan)

// 	// Simulate sending data
// 	go func() {
// 		for i := 0; i < 10; i++ {
// 			buffer.Send([]int{i})
// 		}
// 		buffer.Close()
// 	}()

// 	// Process output
// 	for item := range outputChan {
// 		println(item)
// 	}
// }
