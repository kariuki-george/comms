package router

import (
	"comms/model"
	"encoding/json"
	"fmt"
	"time"

	"github.com/gorilla/websocket"
	"github.com/rs/zerolog/log"
)

var (
	pongWait     = 10 * time.Second    // How long to wait before dropping a connection
	pingInterval = (pongWait * 9) / 10 // Ping every 9 seconds
)

// A map of userId and client details
// One will use the userId to get their client

type ClientList map[uint]*Client

type Client struct {
	connection *websocket.Conn
	wsmanager  *WSManager
	userId     uint

	// Write channel
	wchan chan model.Event
}

func NewClient(conn *websocket.Conn, wsmanager *WSManager, userId uint) *Client {
	return &Client{
		connection: conn,
		wsmanager:  wsmanager,
		wchan:      make(chan model.Event),
		userId:     userId,
	}
}

func (client *Client) readMessages() {

	defer func() {
		// Remove connection

		client.wsmanager.removeClient(client)
	}()

	if err := client.connection.SetReadDeadline(time.Now().Add(pongWait)); err != nil {
		log.Debug().Msg("[WS]: Failed to setreaddeadline " + err.Error())
		return
	}

	// Jumbo Frames
	// If the max size is passed, the connection will be dropped
	// The client can only send a max of 1kb

	client.connection.SetReadLimit(1024)

	client.connection.SetPongHandler(client.pongHandler)

	for {

		// At the moment will only support sending text messages
		// Check WS RFC for more info on messageType
		messageType, payload, err := client.connection.ReadMessage()

		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Debug().Msg("[WS]: Connection closed: " + err.Error())
			}

			break
		}

		log.Debug().Msg(fmt.Sprintf("[WS]: MessageType:%d Payload:%s", messageType, string(payload)))

		var event model.Event

		if err := json.Unmarshal(payload, &event); err != nil {
			log.Error().Msg("[WS]: " + err.Error())
			break //Reconsider not to close the connection
		}

		if err := client.wsmanager.routeEvent(event, client); err != nil {
			log.Error().Msg("[WS]: Error handling the message: " + err.Error())
		}

	}
}

/*

NOTE: Gorilla supports one reader and one writer at a time.
To resolve this, one can use an unbufferred channel to prevent multiple writers

Unbuffered channel because it will block when a value is added to it,
so at any moment in time, only one message will be sent.

*/

func (client *Client) writeMessages() {
	defer func() {
		// Remove connection

		client.wsmanager.removeClient(client)
	}()

	ticker := time.NewTicker(pingInterval)

	for {

		select {
		case message, ok := <-client.wchan:
			if !ok {
				// If channel is still uo

				if err := client.connection.WriteMessage(websocket.CloseMessage, nil); err != nil {
					log.Debug().Msg("[WS]: Connection Close: " + err.Error())
				}

				return

			}

			data, err := json.Marshal(message)

			if err != nil {
				log.Error().Msg("[WS]: Failed to marshal data:" + err.Error())
			}

			if err := client.connection.WriteMessage(websocket.TextMessage, data); err != nil {
				log.Debug().Msg("[WS]: Failed to send message: " + err.Error())
			}

			log.Debug().Msg("[WS]: Message sent")

		case <-ticker.C:
			log.Debug().Msg("[WS]: Trying to ping client")

			// Send a ping to the Client

			if err := client.connection.WriteMessage(websocket.PingMessage, []byte(``)); err != nil {

				log.Debug().Msg("[WS]: Failed to get a pong")
				return
			}

		}

	}
}

func (client *Client) pongHandler(pongMsg string) error {
	log.Debug().Msg("[WS]: Pong")
	return client.connection.SetReadDeadline(time.Now().Add(pongWait))

}
