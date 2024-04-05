package app

import (
	"comms/internal/storage"
	"comms/model"
)

func CreateChatbot(store storage.Storage, newChatbot *model.CreateChatbot) (*model.SafeChatbot, error) {
	return store.Chatbots().CreateChatbot(newChatbot)
}
func FindChatbot(store storage.Storage, chatbotKey string) (*model.SafeChatbot, error) {
	return store.Chatbots().FindChatbot(chatbotKey)
}
func FindAllChatbots(store storage.Storage, orgId uint) (*[]model.SafeChatbot, error) {
	return store.Chatbots().FindAllChatbots(orgId)
}
func DeleteChatbot(store storage.Storage, chatbotId uint, orgId uint) error {
	return store.Chatbots().DeleteChatbot(chatbotId, orgId)
}
