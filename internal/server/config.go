package server

import (
	"github.com/pkg/errors"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

// Config is server configuration.
type Config struct {
	Addr string `mapstructure:"addr"`

	// The Production flag is used to enable production mode. It should be
	// propagated by the parent Config before Validate is called.
	Production bool
}

// Validate configuration is ok.
func (c *Config) Validate() error {
	return nil
}

// ConfigFlags helps configure cobra and viper flags.
func ConfigFlags(cmd *cobra.Command, prefix string) error {
	if cmd == nil {
		return errors.New("command required")
	}

	if prefix == "" {
		return errors.New("prefix required")
	}

	viper.SetDefault(prefix, &Config{})

	flag := prefix + ".addr"
	sval := ":4737"
	cmd.Flags().StringP(flag, "a", sval, "Address if the server")
	viper.SetDefault(flag, sval)

	return nil
}
