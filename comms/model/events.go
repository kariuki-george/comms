package model

import "encoding/json"

type Event struct {
	Type       string          `json:"type"`
	Payload    json.RawMessage `json:"payload"`
	Identifier string          `json:"identifier"`
}

type SendMessageEvent struct {
	Message string `json:"message"`
	From    string `json:"from"`
}
