package runtime

import (
	"strings"

	"github.com/pkg/errors"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

type Config struct {
	WebsocketMsgBuf int32 `mapstructure:"wsmsgbuf"`
}

func (c *Config) Validate() error {
	if c.WebsocketMsgBuf < 1000 {
		return errors.New("websocket message buffer size must be greater or equal to 1000")
	}

	return nil
}

func ConfigFlags(cmd *cobra.Command, prefix string) error {
	if cmd == nil {
		return errors.New("command required")
	}

	if prefix == "" {
		return errors.New("prefix required")
	}

	if !strings.HasSuffix(prefix, ".") {
		prefix += "."
	}

	viper.SetDefault(prefix, &Config{})

	flag := prefix + "wsmsgbuf"
	cmd.Flags().Uint32(flag, 100_000, "websocket message buffer size")
	viper.BindPFlag(flag, cmd.Flags().Lookup(flag))

	return nil
}
