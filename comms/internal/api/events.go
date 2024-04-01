package api

import (
	"comms/model"
	"fmt"
)

type EventHandler func(event model.Event, userId uint) error

const (
	EventSendMessage = "sendMessage"
)

func WSNewMessage(event model.Event, userId uint) error {
	fmt.Println(event, userId)

	return nil

}
