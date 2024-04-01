package api

import (
	"comms/internal/app"
	"comms/internal/storage"
	"comms/internal/utils"
	"comms/model"
	"net/http"
)

func CreateUser() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		// Get user from body

		var createUser model.CreateUser

		err := parseBody(w, r, &createUser, "USER")

		if err != nil {
			return
		}

		// Validate body

		err = validateStructInput(w, &createUser)

		if err != nil {
			return
		}
		store := r.Context().Value(utils.CTX_STORE).(storage.Storage)

		safeUser, err := app.CreateUser(store, &createUser)

		if err != nil {
			RespondWithError(w, http.StatusBadRequest, err.Error())
			return
		}

		RespondWithJSON(w, http.StatusCreated, safeUser)

	}
}
