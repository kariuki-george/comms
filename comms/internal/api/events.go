package api

import (
	"comms/model"
	"fmt"
)

type EventHandler func(event model.Event, userId int) error

const (
	EventSendMessage = "sendMessage"
)

func WSNewMessage(event model.Event, userId int) error {
	fmt.Println(event, userId)

	return nil

}
