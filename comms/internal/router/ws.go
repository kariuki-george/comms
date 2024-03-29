package router

import (
	"comms/internal/api"
	"comms/internal/config"
	"comms/model"
	"errors"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
	"github.com/rs/zerolog/log"
)

var (
	websockerUpgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
	}
)

type WSManager struct {
	clients ClientList
	sync.RWMutex
	// Stores handlers to be used for a websocket event
	handlers map[string]api.EventHandler
}

func NewWSManager(config *config.Config) *WSManager {
	wsManager := &WSManager{
		clients:  make(ClientList),
		handlers: make(map[string]api.EventHandler),
	}

	wsManager.setupEventHandlers()
	return wsManager
}

func (wsManager *WSManager) setupEventHandlers() {
	wsManager.handlers[api.EventSendMessage] = api.WSNewMessage

}

func (wsManager *WSManager) SendMessage(userId int, payload model.Event) {
	// Get socket
	if client, ok := wsManager.clients[userId]; ok {
		client.wchan <- payload
	}
}

func (wsManager *WSManager) routeEvent(event model.Event, client *Client) error {
	if handler, ok := wsManager.handlers[event.Type]; ok {
		if err := handler(event, client.userId); err != nil {
			log.Debug().Msg(err.Error())
			return err
		}

		return nil
	} else {
		return errors.New("unsupported event type provided")

	}
}

func (wsManager *WSManager) serveWS() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		wsManager.newWSConnection(w, r)
	}
}

func (wsManager *WSManager) newWSConnection(w http.ResponseWriter, r *http.Request) {
	log.Debug().Msg("[WS]: New Connection")

	// TODO: Get authenticated user details from the request

	userId := 1

	// Upgrade regular http connection into websocket

	conn, err := websockerUpgrader.Upgrade(w, r, nil)

	if err != nil {
		log.Error().Msg(err.Error())
		return
	}

	client := NewClient(conn, wsManager, userId)

	wsManager.addClient(client)

}

func (wsManager *WSManager) addClient(client *Client) {
	wsManager.Lock()

	defer wsManager.Unlock()

	wsManager.clients[client.userId] = client

	go client.readMessages()
	go client.writeMessages()

}

func (wsManager *WSManager) removeClient(client *Client) {
	wsManager.Lock()

	defer wsManager.Unlock()

	if _, ok := wsManager.clients[client.userId]; ok {
		log.Debug().Msg("[WS]: Closed connection")
		client.connection.Close()
		delete(wsManager.clients, client.userId)
	}
}

// func checkOrigin(r *http.Request) bool {
// 	origin := r.Header.Get("Origin")

// 	// If dev, allow all origins

// 	if config.Server.ENV == "development" {
// 		return true
// 	}

// 	// Else

// 	switch origin {
// 	// Dev Web
// 	case "https://comms.p.kariukigeorge.me/":
// 		return true
// 	case "https://comms-test.p.kariukigeorge.me/":
// 		return true
// 	default:
// 		return false
// 	}
// }
