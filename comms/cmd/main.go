package main

import (
	"comms/internal/config"
	"comms/internal/router"
	"comms/internal/storage"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

func main() {

	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})

	// Load config

	config := config.Init()

	// Set logging level

	if config.Server.ENV == "development" {
		zerolog.SetGlobalLevel(zerolog.DebugLevel)
	} else {
		zerolog.SetGlobalLevel(zerolog.InfoLevel)
	}

	log.Info().Msg("[COMMS]: Hello From Comms💬")

	// Set the default location to East Africa Time (EAT)
	location, err := time.LoadLocation(config.Server.Timezone)
	if err != nil {
		fmt.Println("[COMMS]: Error setting timezone:", err)
		return
	}
	time.Local = location
	log.Info().Msg(fmt.Sprintf("[COMMS]: Set Timezone to %s", location))

	// Start database

	database := storage.InitDB(config)

	// Setup Server
	log.Info().Msg(fmt.Sprintf("[COMMS]: Starting HTTP server on port:%d", config.Server.Port))

	server := &http.Server{
		Addr:    fmt.Sprintf("0.0.0.0:%d", config.Server.Port),
		Handler: router.InitRouter(config, database),
		// Good practice: enforce timeouts for servers you create!
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	log.Fatal().Msg(
		"[COMMS]:" + server.ListenAndServe().Error())
}
