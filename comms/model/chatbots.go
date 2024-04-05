package model

import "gorm.io/gorm"

type Chatbot struct {
	gorm.Model
	Name       string `gorm:"uniqueIndex:idx_chatbot"`
	ChatbotKey string `gorm:"uniqueIndex:idx_chatbot_key"`
	OrgID      uint   `gorm:"uniqueIndex:idx_chatbot"`
	Chatrooms  []Chatroom
}

type SafeChatbot struct {
	Name       string `json:"name"`
	OrgID      uint   `json:"orgId"`
	ID         uint   `json:"chatbotId"`
	ChatbotKey string `json:"chatbotKey"`
}

type CreateChatbot struct {
	Name  string `json:"name" validate:"required"`
	OrgId uint
}
