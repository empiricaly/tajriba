package auth

import (
	"strings"

	"aidanwoods.dev/go-paseto"
	"github.com/empiricaly/tajriba/internal/models"
	"github.com/pkg/errors"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

func (auth *Auth) CheckPasetoToken(token string) (*models.User, error) {
	if auth == nil {
		return nil, errors.New("auth not set")
	}

	if auth.config.Paseto == nil {
		return nil, errors.New("paseto config not set")
	}

	if auth.config.Paseto.key == nil {
		return nil, errors.New("paseto key not set")
	}

	if auth.config.Paseto.parser == nil {
		return nil, errors.New("paseto parser not set")
	}

	parser := *auth.config.Paseto.parser

	// This will fail if parsing failes, cryptographic checks fail, or
	// validation rules fail.
	tok, err := parser.ParseV4Public(*auth.config.Paseto.key, token, nil)
	if err != nil {
		return nil, errors.Wrap(err, "paseto token validation")
	}

	userID, err := tok.GetString("userId")
	if err != nil {
		return nil, errors.Wrap(err, "paseto token missing userId")
	}

	username, err := tok.GetString("username")
	if err != nil {
		return nil, errors.Wrap(err, "paseto token missing username")
	}

	name, err := tok.GetString("name")
	if err != nil {
		return nil, errors.Wrap(err, "paseto token missing name")
	}

	return &models.User{
		ID:       strings.TrimSpace(userID),
		Name:     strings.TrimSpace(name),
		Username: strings.TrimSpace(username),
	}, nil
}

// Config is server configuration.
type PasetoConfig struct {
	Issuer   string `mapstructure:"issuer"`
	Subject  string `mapstructure:"subject"`
	Audience string `mapstructure:"audience"`

	Key    string `mapstructure:"key"`
	key    *paseto.V4AsymmetricPublicKey
	parser *paseto.Parser
}

// Validate configuration is ok.
func (c *PasetoConfig) Validate() error {
	if c == nil {
		return nil
	}

	if key := strings.TrimSpace(c.Key); key != "" {
		publicKey, err := paseto.NewV4AsymmetricPublicKeyFromHex(key)
		if err != nil {
			return errors.Wrap(err, "invalid key")
		}

		c.key = &publicKey
	}

	parser := paseto.NewParser()
	if c.Issuer != "" {
		parser.AddRule(paseto.IssuedBy(c.Issuer))
	}

	if c.Subject != "" {
		parser.AddRule(paseto.Subject(c.Subject))
	}

	if c.Audience != "" {
		parser.AddRule(paseto.ForAudience(c.Audience))
	}

	parser.AddRule(paseto.NotExpired())
	parser.AddRule(paseto.NotBeforeNbf())

	c.parser = &parser

	return nil
}

// PasetoConfigFlags helps configure cobra and viper flags.
func PasetoConfigFlags(cmd *cobra.Command, prefix string) error {
	if cmd == nil {
		return errors.New("command required")
	}

	if prefix == "" {
		return errors.New("prefix required")
	}

	viper.SetDefault(prefix, &PasetoConfig{})

	flag := prefix + ".issuer"
	sval := ""
	cmd.PersistentFlags().String(flag, sval, "Issuer of the token. Optional.")
	viper.SetDefault(flag, sval)

	flag = prefix + ".subject"
	sval = ""
	cmd.PersistentFlags().String(flag, sval, "Subject of the token. Optional.")
	viper.SetDefault(flag, sval)

	flag = prefix + ".audience"
	sval = ""
	cmd.PersistentFlags().String(flag, sval, "Audience of the token. Optional.")
	viper.SetDefault(flag, sval)

	flag = prefix + ".key"
	sval = ""
	cmd.PersistentFlags().String(flag, sval, "Public key to verify the token.")
	viper.SetDefault(flag, sval)

	return nil
}
