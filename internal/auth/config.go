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
	Users                    []models.User `mapstructure:"users"`
	ServiceRegistrationToken string        `mapstructure:"srtoken"`

	// The Production flag is used to enable production mode. It should be
	// propagated by the parent Config before Validate is called.
	Production bool
}

const (
	minPasswordSize                 = 8
	minServiceRegistrationTokenSize = 16
	devServiceRegistrationToken     = "__dev_service_registration_token__"
)

// Validate configuration is ok.
func (c *Config) Validate() error {
	for _, user := range c.Users {
		if strings.TrimSpace(user.Name) == "" {
			return errors.New("user name is required")
		}

		if strings.TrimSpace(user.Username) == "" {
			return errors.New("user username is required")
		}

		if strings.TrimSpace(user.Password) == "" {
			return errors.New("user password is required")
		}

		if len(strings.TrimSpace(user.Password)) < minPasswordSize {
			return errors.Errorf("user password is too small: %d chars min", minPasswordSize)
		}
	}

	if c.Production && len(c.Users) == 0 {
		return errors.New("please add at least one user in the configuration")
	}

	if len(c.ServiceRegistrationToken) < minServiceRegistrationTokenSize {
		if c.Production {
			return errors.New("srtoken should be at least 16 chars")
		} else {
			c.ServiceRegistrationToken = devServiceRegistrationToken
		}
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
	sval := []*models.User{}
	viper.SetDefault(flag, sval)

	return nil
}
