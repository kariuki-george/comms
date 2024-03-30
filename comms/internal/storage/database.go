package storage

import (
	"comms/internal/config"
	"comms/model"

	"github.com/rs/zerolog/log"
	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Database struct {
	db   *gorm.DB
	user UsersRepo
}

func InitDB(config *config.Config) *Database {
	database := Database{}
	// Create a new database
	if config.Server.ENV == "development" {
		// Use sqlite
		db, err := gorm.Open(sqlite.Open("comms.db"), &gorm.Config{TranslateError: true})
		if err != nil {
			log.Fatal().Msg("[DATABASE]: Failed to start sqlite db" + err.Error())

		}

		database.db = db

	} else {
		// Use postgres
		db, err := gorm.Open(postgres.Open(config.Database.Dsn), &gorm.Config{TranslateError: true})
		log.Fatal().Msg("[DATABASE]: Failed to start postgres connection" + err.Error())
		database.db = db
	}

	// Automigrate tables
	database.db.AutoMigrate(&model.User{})

	// Match interfaces and impl

	database.user = NewUsersImpl(database.db)

	return &database

}

func (db *Database) User() UsersRepo {

	return db.user
}
