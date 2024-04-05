package storage

import (
	"comms/model"
	"errors"

	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
	"gorm.io/gorm"
)

type ChatbotImpl struct {
	db *gorm.DB
}

func NewChatbotImpl(db *gorm.DB) *ChatbotImpl {
	return &ChatbotImpl{db}
}

func (impl *ChatbotImpl) CreateChatbot(newChatbot *model.CreateChatbot) (*model.SafeChatbot, error) {
	var chatbot model.Chatbot

	chatbot.Name = newChatbot.Name
	// TODO: ADD UUID TO THE CHATBOT KEY
	chatbot.ChatbotKey = uuid.NewString()
	chatbot.OrgID = newChatbot.OrgId

	err := impl.db.Create(&chatbot).Error

	if err != nil {
		if errors.Is(gorm.ErrDuplicatedKey, err) {
			return nil, errors.New("chatbot with the provided name already exists")
		}
		log.Error().Msg("[CHATBOTS]: Failed to create a new chatbot " + err.Error())
		return nil, errors.New("failed to create the chatbot")
	}

	var safeChatbot model.SafeChatbot

	safeChatbot.ID = chatbot.ID
	safeChatbot.Name = newChatbot.Name
	safeChatbot.OrgID = newChatbot.OrgId

	return &safeChatbot, nil

}
func (impl *ChatbotImpl) FindChatbot(chatbotKey string) (*model.SafeChatbot, error) {
	var chatbot model.Chatbot

	err := impl.db.Select("org_id", "name", "id").Where("chatbot_key = ?", chatbotKey).Limit(1).First(&chatbot).Error

	if err != nil {
		log.Debug().Msg("[CHATBOTS]: Failed to get chatbot " + err.Error())
		return nil, errors.New("failed to get chatbot")
	}
	var safeChatbot model.SafeChatbot

	safeChatbot.ID = chatbot.ID
	safeChatbot.Name = chatbot.Name
	safeChatbot.OrgID = chatbot.OrgID
	return &safeChatbot, nil

}
func (impl *ChatbotImpl) FindAllChatbots(orgId uint) (*[]model.SafeChatbot, error) {
	var chatbots = []model.Chatbot{}

	err := impl.db.Select("org_id", "name", "id", "chatbot_key").Where("org_id = ?", orgId).Find(&chatbots).Error

	if err != nil {
		log.Debug().Msg("[CHATBOTS]: Failed to get chatbots " + err.Error())
		return nil, errors.New("failed to get chatbots")
	}
	var safeChatbots = []model.SafeChatbot{}

	for _, chatbot := range chatbots {

		safeChatbot := model.SafeChatbot{}
		safeChatbot.ID = chatbot.ID
		safeChatbot.Name = chatbot.Name
		safeChatbot.OrgID = chatbot.OrgID
		safeChatbot.ChatbotKey = chatbot.ChatbotKey
		safeChatbots = append(safeChatbots, safeChatbot)

	}

	return &safeChatbots, nil
}
func (impl *ChatbotImpl) DeleteChatbot(chatbotId uint, orgId uint) error {
	var chatbot model.Chatbot

	err := impl.db.Where("id = ?", chatbotId).Where("org_id = ?", orgId).Delete(&chatbot).Error

	if err != nil {
		log.Debug().Msg("[CHATBOTS]: Failed to delete chatbot " + err.Error())
		return errors.New("failed to delete chatbot")
	}
	return nil

}
