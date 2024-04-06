package api

import (
	"comms/internal/queues"
	"time"

	"github.com/rs/zerolog/log"
)

type WSConsumer struct {
	wsm *WSManager
}

/*
Creates go routines that handle consuming WS events from queues
*/
func InitWSConsumer(wsm *WSManager) {
	wsc := WSConsumer{wsm}
	log.Info().Msg("[WS]: Starting to consume ws events")
	go wsc.consume()

}

func (wsc *WSConsumer) consume() {
	for {
		for _, event := range queues.Bus {

			wsc.wsm.SendMessage(event)
		}

		// TODO: REMOVE
		time.Sleep(time.Second)
	}

}
