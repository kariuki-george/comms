package model

import (
	"time"

	"gorm.io/gorm"
)

type Chatroom struct {
	gorm.Model
	UserEmail     string
	UserName      string
	UserId        uint
	AgentId       uint
	AgentName     string
	Status        string // Checkout enum
	Location      string
	AgentJoinedAt time.Time
	ChatbotID     uint
	OrgID         uint //Not needed though
	Messages      []Message
}

type Message struct {
	gorm.Model
	Sender     string // Checkout enum
	SentAt     time.Time
	ReadAt     time.Time
	ChatroomId uint
}

type CreateChatroom struct {
	ChatbotID uint   `json:"chatbotId" validate:"required"`
	UserEmail string `json:"email" validate:"required"`
	UserName  string `json:"name" validate:"required"`
}

type SafeChatroom struct {
	Id          uint   `json:"chatroomId"`
	ChatbotName string `jsom:"chatbotName"`
}

type CreateChatroomResponse struct {
	Chatroom  SafeChatroom `json:"chatroom"`
	AuthToken string       `json:"authToken"`
}
