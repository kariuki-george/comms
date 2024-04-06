package model

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Name           string
	Email          string `gorm:"unique"`
	Orgs           []Org
	UserPermission []UserPermission
	Password       string
}

type CreateUser struct {
	Email    string `json:"email" validate:"required,email"`
	Name     string `json:"name" validate:"required"`
	Password string `json:"password" validate:"required"`
}

// Anonymous users will have the ID value as 0
type SafeUser struct {
	Name  string `json:"name"`
	Email string `json:"email"`
	Id    uint   `json:"id"`
}
