package cmd

import (
	"context"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/empiricaly/tajriba"
	"github.com/pkg/errors"
	"github.com/rs/zerolog/log"
	"github.com/spf13/cobra"

	homedir "github.com/mitchellh/go-homedir"
	"github.com/spf13/viper"
)

const closeMaxCuration = time.Second * 5

func root(_ *cobra.Command, _ []string, usingConfigFile bool) {
	conf := new(tajriba.Config)

	err := viper.Unmarshal(conf)
	if err != nil {
		log.Fatal().Err(err).Msg("could not parse configuration")
	}

	err = conf.Validate()
	if err != nil {
		log.Fatal().Err(err).Msg("invalid config")
	}

	ctx, cancel := context.WithCancel(context.Background())

	go func() {
		s := make(chan os.Signal, 1)
		signal.Notify(s, syscall.SIGINT, syscall.SIGTERM, syscall.SIGQUIT, syscall.SIGHUP)
		<-s
		cancel()

		s = make(chan os.Signal, 1)
		signal.Notify(s, syscall.SIGINT, syscall.SIGTERM, syscall.SIGQUIT)
		<-s
		log.Fatal().Msg("Force quit")
	}()

	t, err := tajriba.Start(ctx, conf, usingConfigFile)
	if err != nil {
		log.Fatal().Err(err).Msg("failed starting tajriba")
	}

	log.Info().Msg("tajriba: started")

	<-ctx.Done()

	// Give the closing a few seconds to cleanup
	ctx, cancel = context.WithTimeout(context.Background(), closeMaxCuration)
	defer cancel()

	t.Close()
}

func defineRoot() (*cobra.Command, *bool, error) {
	// usingConfigFile tracks if the config comes from a file.
	usingConfigFile := false

	// rootCmd represents the base command when called without any subcommands.
	rootCmd := &cobra.Command{
		Use:   "tajriba",
		Short: "tajriba is an engine for multiplayer interactive experiments",
		// Long: ``,
		Run: func(cmd *cobra.Command, args []string) {
			root(cmd, args, usingConfigFile)
		},
	}

	err := tajriba.ConfigFlags(rootCmd, "", "tajriba.json")
	if err != nil {
		return nil, nil, errors.Wrap(err, "define flags")
	}

	rootCmd.PersistentFlags().String("config", "", "config file (default is $HOME/.tajriba.yaml)")

	err = viper.BindPFlags(rootCmd.Flags())
	if err != nil {
		return nil, nil, errors.Wrap(err, "bind root flags")
	}

	err = viper.BindPFlags(rootCmd.PersistentFlags())
	if err != nil {
		return nil, nil, errors.Wrap(err, "bind root persistent flags")
	}

	return rootCmd, &usingConfigFile, nil
}

// Execute adds all child commands to the root command and sets flags appropriately.
// This is called by main.main(). It only needs to happen once to the rootCmd.
func Execute() {
	rootCmd, usingConfigFile, err := defineRoot()
	if err != nil {
		log.Fatal().Err(err).Msg("Failed to start")
	}

	cobra.OnInitialize(initConfig(rootCmd, usingConfigFile))

	if err := rootCmd.Execute(); err != nil {
		log.Fatal().Err(err).Msg("Failed to start")
	}
}

// initConfig reads in config file and ENV variables if set.
func initConfig(rootCmd *cobra.Command, usingConfigFile *bool) func() {
	return func() {
		cfgFile, err := rootCmd.PersistentFlags().GetString("config")
		if err != nil {
			log.Fatal().Err(err).Msg("Failed to parse config file flag")
		}

		if cfgFile != "" {
			// Use config file from the flag.
			viper.SetConfigFile(cfgFile)
		} else {
			// Find home directory.
			home, err := homedir.Dir()
			if err != nil {
				log.Error().Err(err).Msg("Getting $HOME dir")
				os.Exit(1)
			}

			// Search config in home directory with name ".tajriba" (without extension).
			viper.AddConfigPath(".")
			viper.AddConfigPath(home)
			viper.SetConfigName(".tajriba")
		}

		viper.AutomaticEnv() // read in environment variables that match

		// If a config file is found, read it in.
		if err := viper.ReadInConfig(); err == nil {
			*usingConfigFile = true
		}
	}
}
