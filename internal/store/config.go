package store

import (
	"errors"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

// Config is store configuration.
type Config struct {
	// UseMemory forces the Store to use in-memory storage, which is lost on
	// restart. Ideal for testing.
	UseMemory bool `mapstructure:"mem"`

	// File is the location of the data file where the Store main data is
	// stored.
	File string `mapstructure:"file"`

	// Metadata is opaque metadata attached to Store by the client of Tajriba.
	// This metadata is opaque to Tajriba. It can be used to store extra info
	// about the data that Tajriba might not understand, such as higher level
	// data versioning.
	// It should not contain any new line characters (\n).
	Metadata []byte `mapstructure:"-"`

	// Encoding to use in data file
	Encoding Encoding `json:"format"`

	// Compression of data in data file
	Compression Compression `json:"compression"`
}

var (
	ErrUnknownCompression = errors.New("unknown compression")
	ErrUnknownEncoding    = errors.New("unknown encoding")
)

// Validate configuration is ok.
func (c *Config) Validate() error {
	if _, ok := _CompressionMap[c.Compression]; !ok {
		return ErrUnknownCompression
	}

	if _, ok := _EncodingMap[c.Encoding]; !ok {
		return ErrUnknownEncoding
	}

	return nil
}

var (
	errCmdRequired    = errors.New("command required")
	errPrefixRequired = errors.New("prefix required")
)

// ConfigFlags helps configure cobra and viper flags.
func ConfigFlags(cmd *cobra.Command, prefix, defaultDBFile string) error {
	if cmd == nil {
		return errCmdRequired
	}

	if prefix == "" {
		return errPrefixRequired
	}

	viper.SetDefault(prefix, &Config{})

	flag := prefix + ".file"
	val := defaultDBFile
	cmd.Flags().String(flag, val, "Data file")
	viper.SetDefault(flag, val)

	flag = prefix + ".mem"
	bval := false
	cmd.Flags().Bool(flag, bval, "Use in-memory db")
	viper.SetDefault(flag, bval)

	return nil
}
