package model

import "gorm.io/gorm"

type Org struct {
	gorm.Model
	Name            string `gorm:"uniqueIndex:idx_org"`
	UserID          uint   `gorm:"uniqueIndex:idx_org"`
	UserPermissions []UserPermission
	Chatbots        []Chatbot
}

type CreateOrg struct {
	Name string `json:"name" validate:"required"`
}

type SafeOrg struct {
	Name string `json:"name"`
	Id   uint   `json:"id"`
}
