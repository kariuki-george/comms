package config

import (
	"fmt"
	"log"

	"github.com/spf13/viper"
)

type serverConfig struct {
	Port     uint16
	Timezone string
	ENV      string
}

type redisConfig struct {
	Url string
}

type Config struct {
	Server serverConfig
	// Redis  redisConfig
}

func Init() *Config {

	log.Println("[CONFIG]: Loading configuration")
	// Set viper config

	viper.SetConfigFile(".env")

	// Auto read env variables
	viper.AutomaticEnv()

	err := viper.ReadInConfig() // Find and read the config file
	if err != nil {             // Handle errors reading the config file
		panic(fmt.Errorf("[CONFIG]: fatal error config file: %w", err))
	}

	config := Config{

		Server: serverConfig{
			Port:     viper.GetUint16("PORT"),
			Timezone: viper.Get("TIMEZONE").(string),
			ENV:      viper.Get("ENV").(string),
		},
		// Redis: redisConfig{
		// 	Url: viper.Get("REDIS_URL").(string),
		// },
	}

	return &config

}
