package auth

import (
	"strings"

	"github.com/empiricaly/tajriba/internal/models"
	"github.com/pkg/errors"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

// Config is server configuration.
type Config struct {
	Users []models.User `mapstructure:"users"`

	Name     string `mapstructure:"name"`
	Username string `mapstructure:"username"`
	Password string `mapstructure:"password"`

	ServiceRegistrationToken string `mapstructure:"srtoken"`

	Paseto *PasetoConfig `mapstructure:"paseto"`

	// The Production flag is used to enable production mode. It should be
	// propagated by the parent Config before Validate is called.
	Production bool
}

const (
	minServiceRegistrationTokenSize = 16

	//nolint:gosec // Not an actual token.
	devServiceRegistrationToken = "__dev_service_registration_token__"
)

// Validate configuration is ok.
func (c *Config) Validate() error {
	if c == nil {
		return nil
	}

	if strings.TrimSpace(c.Username) != "" {
		u := models.User{
			Name:     strings.TrimSpace(c.Name),
			Username: strings.TrimSpace(c.Username),
			Password: strings.TrimSpace(c.Password),
		}

		c.Users = append(c.Users, u)
	}

	for _, user := range c.Users {
		if err := user.Validate(); err != nil {
			return errors.Wrap(err, "user validation")
		}
	}

	if c.Production && len(c.Users) == 0 {
		return errors.New("please add at least one user in the configuration")
	}

	if len(c.ServiceRegistrationToken) < minServiceRegistrationTokenSize {
		if c.Production {
			return errors.New("srtoken should be at least 16 chars")
		}

		c.ServiceRegistrationToken = devServiceRegistrationToken
	}

	if err := c.Paseto.Validate(); err != nil {
		return errors.Wrap(err, "paseto config")
	}

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

	flag := prefix + ".users"
	val := []*models.User{}
	viper.SetDefault(flag, val)

	flag = prefix + ".name"
	sval := ""
	cmd.PersistentFlags().String(flag, sval, "Name of the user to add")
	viper.SetDefault(flag, sval)

	flag = prefix + ".username"
	sval = ""
	cmd.PersistentFlags().String(flag, sval, "Username of the user to add")
	viper.SetDefault(flag, sval)

	flag = prefix + ".password"
	sval = ""
	cmd.PersistentFlags().String(flag, sval, "Password of the user to add")
	viper.SetDefault(flag, sval)

	flag = prefix + ".srtoken"
	sval = ""
	cmd.PersistentFlags().String(flag, sval, "Service registration token")
	viper.SetDefault(flag, sval)

	if err := PasetoConfigFlags(cmd, prefix+".paseto"); err != nil {
		return errors.Wrap(err, "paseto config flags")
	}

	return nil
}
