package storage

import "comms/model"

type UsersRepo interface {
	CreateUser(user *model.CreateUser) (*model.SafeUser, error)
	GetUserById(userId int) (*model.User, error)
	GetUserByEmail(email string) (*model.User, error)
}
