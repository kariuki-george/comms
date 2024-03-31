package api

import (
	"net/http"
)

type health struct {
	Status string `json:"health"`
}

func Health() http.HandlerFunc {

	return func(w http.ResponseWriter, r *http.Request) {

		RespondWithJSON(w, 200, health{Status: "oK"})
	}
}
