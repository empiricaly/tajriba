package tajriba

import (
	"github.com/empiricaly/tajriba/internal/auth"
	"github.com/empiricaly/tajriba/internal/runtime"
	"github.com/empiricaly/tajriba/internal/server"
	"github.com/empiricaly/tajriba/internal/store"
	logger "github.com/empiricaly/tajriba/internal/utils/log"
	"github.com/pkg/errors"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

// Config is server configuration.
type Config struct {
	Runtime *runtime.Config `mapstructure:"runtime"`
	Server  *server.Config  `mapstructure:"server"`
	Store   *store.Config   `mapstructure:"store"`
	Auth    *auth.Config    `mapstructure:"auth"`
	Log     *logger.Config  `mapstructure:"log"`

	Production bool `mapstructure:"production"`
}

// Validate configuration is ok.
func (c *Config) Validate() error {
	c.Server.Production = c.Production
	c.Auth.Production = c.Production

	if err := c.Runtime.Validate(); err != nil {
		return errors.Wrap(err, "validate runtime configuration")
	}

	if err := c.Server.Validate(); err != nil {
		return errors.Wrap(err, "validate server configuration")
	}

	if err := c.Store.Validate(); err != nil {
		return errors.Wrap(err, "validate store configuration")
	}

	if err := c.Auth.Validate(); err != nil {
		return errors.Wrap(err, "validate auth configuration")
	}

	if err := c.Log.Validate(); err != nil {
		return errors.Wrap(err, "validate log configuration")
	}

	return nil
}

// ConfigFlags helps configure cobra and viper flags.
func ConfigFlags(cmd *cobra.Command, prefix, defaultDBFile string) error {
	if cmd == nil {
		return errors.New("command required")
	}

	if prefix != "" {
		prefix += "."
	}

	viper.SetDefault(prefix, &Config{})

	if err := runtime.ConfigFlags(cmd, prefix+"runtime"); err != nil {
		return errors.Wrap(err, "set runtime configuration flags")
	}

	if err := server.ConfigFlags(cmd, prefix+"server"); err != nil {
		return errors.Wrap(err, "set server configuration flags")
	}

	if err := store.ConfigFlags(cmd, prefix+"store", defaultDBFile); err != nil {
		return errors.Wrap(err, "set store configuration flags")
	}

	if err := auth.ConfigFlags(cmd, prefix+"auth"); err != nil {
		return errors.Wrap(err, "set auth configuration flags")
	}

	if err := logger.ConfigFlags(cmd, prefix+"log", "info"); err != nil {
		return errors.Wrap(err, "set logger configuration flags")
	}

	flag := prefix + ".production"
	bval := true
	cmd.Flags().Bool(flag, bval, "Run in production mode (e.g. enforce admin authenticate)")
	viper.SetDefault(flag, bval)

	return nil
}
