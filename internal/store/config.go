package store

import (
	"errors"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

// Config is store configuration.
type Config struct {
	File      string `mapstructure:"file"`
	UseMemory bool   `mapstructure:"mem"`
	Debug     bool   `mapstructure:"debug"`
}

// Validate configuration is ok.
func (c *Config) Validate() error {
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

	// flag = prefix + ".debug"
	// bval = false
	// cmd.Flags().Bool(flag, bval, "show queries debug logs")
	// viper.SetDefault(flag, bval)

	return nil
}
