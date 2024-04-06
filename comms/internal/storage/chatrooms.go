package storage

import (
	"comms/model"
	"errors"
	"time"

	"github.com/rs/zerolog/log"
	"gorm.io/gorm"
)

type ChatroomImpl struct {
	db *gorm.DB
}

func NewChatroomImpl(db *gorm.DB) *ChatroomImpl {
	return &ChatroomImpl{db}
}

func (impl *ChatroomImpl) CreateChatroom(newChatroom *model.CreateChatroom, orgId uint) (*model.SafeChatroom, error) {
	var chatroom model.Chatroom

	chatroom.UserEmail = newChatroom.UserEmail
	chatroom.UserName = newChatroom.UserName
	chatroom.Status = "OPEN"
	chatroom.OrgID = orgId

	err := impl.db.Create(&chatroom).Error

	if err != nil {

		log.Error().Msg("[CHATROOMS]: Failed to create chatroom " + err.Error())
		return nil, errors.New("failed to create chatroom")
	}
	// Fetch chatbotname
	// TODO: OPTMIZE FOR BETTER PERFORMANCE
	var chatbot model.Chatbot

	err = impl.db.Where("id = ?", newChatroom.ChatbotID).Limit(1).Find(&chatbot).Error

	if err != nil {

		log.Error().Msg("[CHATROOMS]: Failed to fetch chatbot " + err.Error())
		return nil, errors.New("failed to create chatroom")
	}

	var safeChatroom model.SafeChatroom

	safeChatroom.ChatbotName = chatbot.Name
	safeChatroom.Id = chatroom.ID
	return &safeChatroom, nil
}
func (impl *ChatroomImpl) JoinChatroom(chatroomId uint, userId uint, userName string, orgId uint) (*model.SafeChatroom, error) {

	var chatroom model.Chatroom
	chatroom.ID = chatroomId
	chatroom.AgentId = userId
	chatroom.AgentJoinedAt = time.Now()
	chatroom.AgentName = userName
	chatroom.Status = "JOINED"

	err := impl.db.Table("chatrooms").Where("status = 'OPEN'").Where("id = ?", chatroomId).Where("org_id = ? ", orgId).UpdateColumns(&chatroom).Error

	if err != nil {
		log.Error().Msg("[CHATROOMS]: Failed to join chatroom " + err.Error())
		return nil, errors.New("failed to join chatroom")
	}
	// Fetch chatbotname
	// TODO: OPTMIZE FOR BETTER PERFORMANCE
	var chatbot model.Chatbot

	err = impl.db.Where("id = ?", chatroomId).Limit(1).Find(&chatbot).Error

	if err != nil {

		log.Error().Msg("[CHATROOMS]: Failed to fetch chatbot " + err.Error())
		return nil, errors.New("failed to create chatroom")
	}

	return &model.SafeChatroom{Id: chatroomId, ChatbotName: chatbot.Name}, nil
}
func (impl *ChatroomImpl) GetChatroomsByUserId(userId uint, orgId uint) (*[]model.SafeChatroom, error) {
	var chatrooms = []model.Chatroom{}
	err := impl.db.Where("agent_id = ?", userId).Where("status = 'OPEN' or status = 'JOINED'").Where("org_id = ?", orgId).Find(&chatrooms).Error
	if err != nil {
		log.Error().Msg("[CHATROOMS]: Failed to fetch chatrooms " + err.Error())
		return nil, errors.New("failed to fetch chatrooms")
	}

	var safeChatrooms = []model.SafeChatroom{}
	for _, chatroom := range chatrooms {
		var safeChatroom = model.SafeChatroom{
			Id:          chatroom.ID,
			ChatbotName: "wow",
		}

		safeChatrooms = append(safeChatrooms, safeChatroom)
	}

	return &safeChatrooms, nil
}
func (impl *ChatroomImpl) CloseChatroom(chatroomId uint, orgId uint) error {
	var chatroom model.Chatroom

	chatroom.Status = "CLOSED"
	chatroom.ID = chatroomId

	err := impl.db.Table("chatrooms").Where("id = ?", chatroomId).Where("org_id = ?", orgId).UpdateColumns(&chatroom).Error
	if err != nil {
		log.Error().Msg("[CHATROOM]: Failed to delete chatroom " + err.Error())
		return errors.New("failed to delete chatroom")
	}
	return nil
}
