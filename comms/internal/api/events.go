package api

import (
	"comms/internal/queues"
	"comms/model"
)

type EventHandler func(event model.Event) error

const (
	EventSendMessage = "sendMessage"
	EventInMessage   = "WSNewMessage"
)

func WSNewMessage(event model.Event) error {

	queues.Bus = append(queues.Bus, event)

	return nil

}
