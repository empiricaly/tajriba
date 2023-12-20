package server

import (
	"github.com/pkg/errors"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

// Config is server configuration.
type Config struct {
	Addr string `mapstructure:"addr"`

	// The MaxParticipants field is the maximum number of participants
	// that can connect to the server at once. 0 means unlimited.
	MaxParticipants uint

	// The MaxUsers field is the maximum number of users that can connect
	// to the server at once. 0 means unlimited.
	MaxUsers uint

	// The Production flag is used to enable production mode. It should be
	// propagated by the parent Config before Validate is called.
	Production bool

	// The EnableTracer flag is used to enable the GraphQL Apollo tracer.
	EnableTracer bool `mapstructure:"enableTracer"`
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

	flag = prefix + ".enableTracer"
	bval := false
	cmd.Flags().Bool(flag, bval, "Enable GraphQL tracer")
	viper.SetDefault(flag, bval)

	flag = prefix + ".maxParticipants"
	uval := uint(0)
	cmd.Flags().Uint(flag, uval,
		"Maximum number of participants that can connect to the server at once. 0 means unlimited.")
	viper.SetDefault(flag, uval)

	flag = prefix + ".maxUsers"
	uval = uint(0)
	cmd.Flags().Uint(flag, uval, "Maximum number of users that can connect to the server at once. 0 means unlimited.")
	viper.SetDefault(flag, uval)

	return nil
}
