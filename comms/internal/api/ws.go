package api

import (
	"comms/internal/utils"
	"comms/model"
	"errors"
	"fmt"
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
	rw      sync.RWMutex
	// Stores handlers to be used for a websocket event
	handlers map[string]EventHandler
}

func NewWSManager() *WSManager {
	wsManager := &WSManager{
		clients:  make(ClientList),
		handlers: make(map[string]EventHandler),
	}

	wsManager.setupEventHandlers()

	InitWSConsumer(wsManager)
	return wsManager
}

func (wsManager *WSManager) setupEventHandlers() {
	wsManager.handlers[EventInMessage] = WSNewMessage

}

func (wsManager *WSManager) SendMessage(payload model.Event) {
	// Get socket
	if client, ok := wsManager.clients[payload.Identifier]; ok {
		client.wchan <- payload
	}
}

func (wsManager *WSManager) routeEvent(event model.Event) error {
	if handler, ok := wsManager.handlers[event.Type]; ok {
		if err := handler(event); err != nil {
			log.Debug().Msg(err.Error())
			return err
		}

		return nil
	} else {
		return errors.New("unsupported event type provided")

	}
}

func (wsManager *WSManager) ServeWS() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		wsManager.newWSConnection(w, r)
	}
}

func (wsManager *WSManager) newWSConnection(w http.ResponseWriter, r *http.Request) {
	log.Debug().Msg("[WS]: New Connection")

	// TODO: Get authenticated user details from the request

	identifier := ""

	safeUser := utils.GetSafeUser(r.Context())
	orgId := utils.GetOrgId(r.Context())

	identifier = fmt.Sprintf("%d", orgId) + "-" + fmt.Sprintf("%d", safeUser.Id)

	if safeUser.Id == 0 {
		chatroomId, err := parseIntUrlParam(r, "chatroomId")
		if err != nil {
			RespondWithError(w, http.StatusBadRequest, err.Error())
			return

		}
		identifier += "-"
		identifier += fmt.Sprintf("%d", chatroomId)

	}

	// Upgrade regular http connection into websocket

	conn, err := websockerUpgrader.Upgrade(w, r, nil)

	if err != nil {
		log.Error().Msg(err.Error())
		return
	}

	client := NewClient(conn, wsManager, identifier)

	wsManager.addClient(client)

}

func (wsManager *WSManager) addClient(client *Client) {
	wsManager.rw.Lock()

	defer wsManager.rw.Unlock()

	wsManager.clients[client.identifier] = client

	go client.readMessages()
	go client.writeMessages()

}

func (wsManager *WSManager) removeClient(client *Client) {
	wsManager.rw.Lock()

	defer wsManager.rw.Unlock()

	if _, ok := wsManager.clients[client.identifier]; ok {
		log.Debug().Msg("[WS]: Closed connection")
		client.connection.Close()
		delete(wsManager.clients, client.identifier)
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
