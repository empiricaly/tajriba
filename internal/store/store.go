package store

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"os"
	"reflect"
	"time"

	"github.com/empiricaly/tajriba/internal/models"
	"github.com/pkg/errors"
	"github.com/rs/zerolog/log"
	"github.com/sasha-s/go-deadlock"
)

// Conn represents a datastore connection.
type Conn struct {
	config   *Config
	done     chan bool
	buf      *bufio.Writer
	dirty    bool
	f        *os.File
	s        *bufio.Scanner
	opaqueMD []byte

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
			if err := c.openFile(); err != nil {
				return nil, errors.Wrap(err, "open file")
			}

			go c.flusher()
		} else {
			return nil, errors.New("db file cannot be empty")
		}
	}

	log.Debug().Msg("store: started")

	return c, nil
}

func (c *Conn) OpaqueMetadata() []byte {
	return c.opaqueMD
}

const defaultFilePerm = 0o666

func (c *Conn) openFile() error {
	var created bool

	if _, err := os.Stat(c.config.File); errors.Is(err, os.ErrNotExist) {
		if c.f, err = os.Create(c.config.File); err != nil {
			return errors.Wrap(err, "create file")
		}

		created = true
	} else {
		c.f, err = os.OpenFile(c.config.File, os.O_RDWR, defaultFilePerm)
		if err != nil {
			return errors.Wrap(err, "open file")
		}
	}

	c.s = bufio.NewScanner(c.f)

	if created {
		if err := c.writeFileMetadata(); err != nil {
			return errors.Wrap(err, "write metadata")
		}
	} else {
		if err := c.readFileMetadata(); err != nil {
			return errors.Wrap(err, "read metadata")
		}
	}

	c.buf = bufio.NewWriterSize(c.f, fbuffer)

	return nil
}

//go:generate go-enum -f=$GOFILE --marshal --lower --names --noprefix

// Compression is enumeration of compression options.
// ENUM(NoCompression)
type Compression uint8

// Encoding is enumeration of encoding options.
// ENUM(JSON)
type Encoding uint8

// FileFormatVersion indicates which version of the Tajriba file format this
// build supports. It should be incremented any time there is a non-backward
// compatible change made to the format of the data.
const FileFormatVersion = 0

// FileMetadata
type FileMetadata struct {
	Version     int         `json:"version"`
	Encoding    Encoding    `json:"format"`
	Compression Compression `json:"compression"`
}

func (c *Conn) writeFileMetadata() error {
	if _, err := c.f.Write(bytes.TrimSpace(c.config.Metadata)); err != nil {
		return errors.Wrap(err, "write opaque metadata")
	}

	if _, err := c.f.Write([]byte("\n")); err != nil {
		return errors.Wrap(err, "write opaque metadata")
	}

	fmd := &FileMetadata{Version: FileFormatVersion}

	b, err := json.Marshal(fmd)
	if err != nil {
		return errors.Wrap(err, "serialize tajriba metadata")
	}

	if _, err := c.f.Write(b); err != nil {
		return errors.Wrap(err, "write tajriba metadata")
	}

	if _, err := c.f.Write([]byte("\n")); err != nil {
		return errors.Wrap(err, "write opaque metadata")
	}

	return nil
}

func (c *Conn) readFileMetadata() error {
	// First line, opaque metadata
	c.s.Scan()
	if err := c.s.Err(); err != nil {
		return errors.Wrap(err, "read opaque metadata")
	}

	c.opaqueMD = c.s.Bytes()

	// Second line, tajriba metadata
	c.s.Scan()
	if err := c.s.Err(); err != nil {
		return errors.Wrap(err, "read tajriba metadata")
	}

	fmd := &FileMetadata{}
	if err := json.Unmarshal(c.s.Bytes(), &fmd); err != nil {
		return errors.Wrap(err, "deserialize tajriba metadata")
	}

	if err := c.s.Err(); err != nil {
		return errors.Wrap(err, "read metadata")
	}

	if fmd.Version != FileFormatVersion {
		str := "expected file format version (%d) is different from data file (%d)"

		return errors.Errorf(str, FileFormatVersion, fmd.Version)
	}

	if fmd.Encoding != c.config.Encoding {
		str := "expected encoding (%s) is different from data file (%s)"

		return errors.Errorf(str, c.config.Encoding, fmd.Encoding)
	}

	if fmd.Compression != c.config.Compression {
		str := "expected compression (%s) is different from data file (%s)"

		return errors.Errorf(str, c.config.Compression, fmd.Compression)
	}

	return nil
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

type objekt struct {
	Kind Kind        `json:"kind"`
	Obj  interface{} `json:"obj"`
}

type objektdev struct {
	Kind Kind            `json:"kind"`
	Obj  json.RawMessage `json:"obj"`
}

// Save object.
func (c *Conn) Save(objs ...interface{}) error {
	if c.config.UseMemory {
		return nil
	}

	c.Lock()
	defer c.Unlock()

	log.Trace().Msg("store: saving")
	defer log.Trace().Msg("store: saved")

	enc := json.NewEncoder(c.buf)

	for _, obj := range objs {
		var name string
		if t := reflect.TypeOf(obj); t.Kind() == reflect.Ptr {
			name = t.Elem().Name()
		} else {
			name = t.Name()
		}

		kind, err := ParseKind(name)
		if err != nil {
			return errors.Wrap(err, "unknown type")
		}

		err = enc.Encode(objekt{Kind: kind, Obj: obj})
		if err != nil {
			return errors.Wrap(err, "json marshall and write")
		}

		// err = c.buf.WriteByte('\n')
		// if err != nil {
		// 	return errors.Wrap(err, "write new line")
		// }
	}

	c.dirty = true

	return nil
}

// Load objects.
func (c *Conn) Load(f func(interface{}) error) error {
	if c.config.UseMemory {
		return nil
	}

	obj := &objektdev{}

	for c.s.Scan() {
		bline := c.s.Bytes()

		bline = bytes.TrimSpace(bline)
		if len(bline) == 0 {
			continue
		}

		if err := json.Unmarshal(bline, obj); err != nil {
			return errors.Wrap(err, "unmarshall")
		}

		o, err := newObj(obj.Kind)
		if err != nil {
			return errors.Wrap(err, "create object")
		}

		if err := json.Unmarshal(obj.Obj, o); err != nil {
			return errors.Wrap(err, "unmarshall")
		}

		err = f(o)
		if err != nil {
			return errors.Wrap(err, "process line")
		}
	}

	if err := c.s.Err(); err != nil {
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

// Kind is enumneration of object kinds.
// ENUM(Scope, Step, Attribute, Participant, User, Link, Transition, Service, Session, Group)
type Kind uint8

// MarshalJSON implements the json marshaller method
func (x Kind) MarshalJSON() ([]byte, error) {
	return []byte(`"` + x.String() + `"`), nil
}

// UnmarshalJSON implements the json unmarshaller method
func (x *Kind) UnmarshalJSON(b []byte) error {
	if len(b) < 3 {
		return errors.New("invalid Kind")
	}

	name := string(b[1 : len(b)-1])
	tmp, err := ParseKind(name)
	if err != nil {
		return err
	}
	*x = tmp
	return nil
}

func newObj(k Kind) (interface{}, error) {
	switch k {
	case Scope:
		return new(models.Scope), nil
	case Step:
		return new(models.Step), nil
	case Attribute:
		return new(models.Attribute), nil
	case Participant:
		return new(models.Participant), nil
	case User:
		return new(models.User), nil
	case Group:
		return new(models.Group), nil
	case Link:
		return new(models.Link), nil
	case Transition:
		return new(models.Transition), nil
	case Service:
		return new(models.Service), nil
	case Session:
		return new(models.Session), nil
	default:
		return nil, errors.New("unknown id meta")
	}
}
