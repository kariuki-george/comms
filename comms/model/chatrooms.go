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
	ChatbotID     int
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
