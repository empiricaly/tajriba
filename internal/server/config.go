package server

import (
	"github.com/pkg/errors"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

// Config is server configuration.
type Config struct {
	Addr string `mapstructure:"addr"`

	Production bool `mapstructure:"production"`
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

	flag = prefix + ".production"
	bval := true
	cmd.Flags().Bool(flag, bval, "Run in production mode (disables dev users)")
	viper.SetDefault(flag, bval)

	if err := cmd.Flags().MarkHidden(flag); err != nil {
		return errors.Wrap(err, "mark production mode hidden")
	}

	return nil
}
