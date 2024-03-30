package storage

import (
	"comms/model"
	"errors"

	"github.com/jinzhu/copier"
	"github.com/rs/zerolog/log"
	"gorm.io/gorm"
)

type UsersImpl struct {
	db *gorm.DB
}

func NewUsersImpl(db *gorm.DB) *UsersImpl {
	return &UsersImpl{
		db,
	}
}

func (impl *UsersImpl) CreateUser(newUser *model.CreateUser) (*model.SafeUser, error) {

	var safeUser model.SafeUser
	var user model.User

	copier.Copy(&safeUser, &newUser)
	copier.Copy(&user, &newUser)

	result := impl.db.Create(&user)

	if result.Error != nil {

		if errors.Is(result.Error, gorm.ErrDuplicatedKey) {
			return nil, errors.New("user with the provided email already exists")

		}

		log.Error().Msg("[USER]: Failed to create user" + result.Error.Error())

		return nil, errors.New("failed to create user")

	}

	return &safeUser, nil

}

func (impl *UsersImpl) GetUserById(userId int) (*model.User, error) {

	var user model.User

	result := impl.db.Select("email", "password", "name", "id").Limit(1).Where("userId = ?", userId).Find(&user)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, errors.New("user not found")
		}
		log.Error().Msg("[USER]: Failed to get user" + result.Error.Error())
		return nil, errors.New("failed to get user")
	}
	return &user, nil
}

func (impl *UsersImpl) GetUserByEmail(email string) (*model.User, error) {

	var user model.User

	result := impl.db.Select("email", "password", "name", "id").Limit(1).Where("email = ?", email).Find(&user)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, errors.New("user not found")
		}
		log.Error().Msg("[USER]: Failed to get user" + result.Error.Error())
		return nil, errors.New("failed to get user")
	}
	return &user, nil
}
