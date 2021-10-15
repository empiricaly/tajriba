package store

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"io"
	"os"
	"time"

	"github.com/pkg/errors"
	"github.com/rs/zerolog/log"
	"github.com/sasha-s/go-deadlock"
)

// Conn represents a datastore connection.
type Conn struct {
	config *Config
	done   chan bool
	buf    *bufio.Writer
	dirty  bool
	f      *os.File

	deadlock.Mutex
}

const fbuffer = 100000

// Connect creates a connection to a messaging service with the given config.
func Connect(_ context.Context, config *Config) (*Conn, error) {
	c := &Conn{
		done:   make(chan bool),
		config: config,
	}

	if !config.UseMemory {
		if config.File != "" {
			f, err := os.OpenFile(config.File, os.O_CREATE|os.O_RDWR|os.O_APPEND, 0644)
			if err != nil {
				return nil, errors.Wrap(err, "open db file")
			}

			c.f = f
			c.buf = bufio.NewWriterSize(f, fbuffer)

			go c.flusher()
		} else {
			return nil, errors.New("db file cannot be empty")
		}
	}

	log.Debug().Msg("store: started")

	return c, nil
}

func (c *Conn) flush() {
	c.Lock()
	defer c.Unlock()

	if !c.dirty {
		return
	}

	err := c.buf.Flush()
	if err != nil {
		log.Fatal().Err(err).Msg("store: failed to flush db")

		return
	}

	err = c.f.Sync()
	if err != nil {
		log.Fatal().Err(err).Msg("store: failed to sync db file")

		return
	}

	c.dirty = false

	log.Trace().Msg("store: flushed")
}

func (c *Conn) flusher() {
	for {
		select {
		case <-time.After(time.Second):
			c.flush()
		case <-c.done:
			c.flush()

			return
		}
	}
}

// Save object.
func (c *Conn) Save(objs ...interface{}) error {
	if c.config.UseMemory {
		return nil
	}

	c.Lock()
	defer c.Unlock()

	log.Trace().Msg("store: saving")

	enc := json.NewEncoder(c.buf)

	for _, obj := range objs {
		err := enc.Encode(obj)
		if err != nil {
			return errors.Wrap(err, "json marshall and write")
		}

		// err = c.buf.WriteByte('\n')
		// if err != nil {
		// 	return errors.Wrap(err, "write new line")
		// }
	}

	c.dirty = true

	log.Trace().Msg("store: saved")

	return nil
}

// Load objects.
func (c *Conn) Load(f func([]byte) error) error {
	if c.config.UseMemory {
		return nil
	}

	_, err := c.f.Seek(0, io.SeekStart)
	if err != nil {
		return errors.Wrap(err, "seek")
	}

	s := bufio.NewScanner(c.f)
	for s.Scan() {
		bline := s.Bytes()
		bline = bytes.TrimSpace(bline)
		if len(bline) == 0 {
			continue
		}

		err = f(bline)
		if err != nil {
			return errors.Wrap(err, "process line")
		}
	}

	if err := s.Err(); err != nil {
		return errors.Wrap(err, "read line")
	}

	return nil
}

// Close cleanly closes the database connection.
func (c *Conn) Close() error {
	if !c.config.UseMemory {
		c.done <- true
	}

	return nil
}
