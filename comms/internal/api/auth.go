package api

import (
	"comms/internal/app"
	"comms/internal/utils"
	"comms/model"
	"net/http"
)

func Login() http.HandlerFunc {
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

		// Get store and config from request context
		store := utils.GetStore(r.Context())
		config := utils.GetConfig(r.Context())

		safeLogin, err := app.Login(store, config, &loginUser)

		if err != nil {
			RespondWithError(w, http.StatusForbidden, err.Error())
			return
		}

		RespondWithJSON(w, http.StatusOK, safeLogin)

	}
}
