package app

import (
	"comms/model"
	"fmt"
)

func emitEvent(event model.EmitterEvent) {

	fmt.Println("called")
}
