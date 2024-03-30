package model

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Name  string `json:"name"`
	Email string `json:"email" gorm:"unique"`

	Password string `json:"password"`
}

type CreateUser struct {
	Email    string `json:"email" validate:"required,email"`
	Name     string `json:"name" validate:"required"`
	Password string `json:"password" validate:"required"`
}

type SafeUser struct {
	Name  string `json:"name"`
	Email string `json:"email"`
	Id    int    `json:"id"`
}
