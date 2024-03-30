package app

import (
	"comms/internal/storage"
	"comms/model"

	"github.com/rs/zerolog/log"
	passwordvalidator "github.com/wagslane/go-password-validator"
)

func CreateUser(store storage.Storage, user *model.CreateUser) (*model.SafeUser, error) {
	// Check password entropy

	const minEntropyBits = 60

	err := passwordvalidator.Validate(user.Password, minEntropyBits)

	if err != nil {
		return nil, err
	}

	// Hash password

	hash, err := generateFromPassword(user.Password)

	if err != nil {
		log.Debug().Msg("[USER]: Failed to hash password " + err.Error())
	}

	user.Password = hash

	// Create user
	// If a user with such email already exists, an error will occur

	newUser, err := store.User().CreateUser(user)

	return newUser, err

}
