package tajriba

import (
	"github.com/empiricaly/tajriba/internal/auth"
	"github.com/empiricaly/tajriba/internal/server"
	"github.com/empiricaly/tajriba/internal/store"
	logger "github.com/empiricaly/tajriba/internal/utils/log"
	"github.com/pkg/errors"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

// Config is server configuration.
type Config struct {
	Server *server.Config `mapstructure:"server"`
	Store  *store.Config  `mapstructure:"store"`
	Auth   *auth.Config   `mapstructure:"auth"`
	Log    *logger.Config `mapstructure:"log"`
}

// Validate configuration is ok.
func (c *Config) Validate() error {
	err := c.Server.Validate()
	if err != nil {
		return errors.Wrap(err, "validate server configuration")
	}

	err = c.Store.Validate()
	if err != nil {
		return errors.Wrap(err, "validate store configuration")
	}

	err = c.Auth.Validate()
	if err != nil {
		return errors.Wrap(err, "validate auth configuration")
	}

	err = c.Log.Validate()
	if err != nil {
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

	err := server.ConfigFlags(cmd, prefix+"server")
	if err != nil {
		return errors.Wrap(err, "set server configuration flags")
	}

	err = store.ConfigFlags(cmd, prefix+"store", defaultDBFile)
	if err != nil {
		return errors.Wrap(err, "set store configuration flags")
	}

	err = auth.ConfigFlags(cmd, prefix+"auth")
	if err != nil {
		return errors.Wrap(err, "set auth configuration flags")
	}

	err = logger.ConfigFlags(cmd, prefix+"log", "info")
	if err != nil {
		return errors.Wrap(err, "set logger configuration flags")
	}

	return nil
}
