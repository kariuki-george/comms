package model

import "encoding/json"

type Event struct {
	Type    string          `json:"type"`
	Payload json.RawMessage `json:"payload"`
}

type SendMessageEvent struct {
	Message string `json:"message"`
	From    string `json:"from"`
}

type EmitterEvent struct {
	Event  Event `json:"event"`
	UserId uint  `json:"userId"`
}
