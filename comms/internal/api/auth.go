package api

import (
	"comms/internal/app"
	"comms/internal/storage"
	"comms/model"
	"net/http"
)

func Login(store storage.Storage) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		// Get login details from request body

		var loginUser model.LoginUser

		err := parseBody(w, r, &loginUser, "AUTH")

		if err != nil {
			return
		}

		// Validate input

		err = validateStructInput(w, &loginUser)
		if err != nil {
			return
		}

		safeLogin, err := app.Login(store, &loginUser)

		if err != nil {
			RespondWithError(w, http.StatusForbidden, err.Error())
			return
		}

		RespondWithJSON(w, http.StatusOK, safeLogin)

	}
}
