package api

import (
	"comms/internal/app"
	"comms/internal/storage"
	"comms/internal/utils"
	"comms/model"
	"net/http"
)

func CreateOrg() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Get org from body
		var createOrg model.CreateOrg
		err := parseBody(w, r, &createOrg, "ORGS")

		if err != nil {
			return
		}

		// Validate the body
		err = validateStructInput(w, &createOrg)

		if err != nil {
			return
		}

		// Get context

		store := utils.GetStore(r.Context())
		safeUser := utils.GetSafeUser(r.Context())

		safeOrg, err := app.CreateOrg(store, createOrg, safeUser.Id)
		if err != nil {
			RespondWithError(w, http.StatusBadRequest, err.Error())
			return
		}

		RespondWithJSON(w, http.StatusCreated, safeOrg)

	}
}

func GetOwnedOrgs() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Get context

		safeUser := r.Context().Value(utils.CTX_SAFEUSER).(*model.SafeUser)
		store := r.Context().Value(utils.CTX_STORE).(storage.Storage)

		safeOrgs, err := app.GetOwnedOrgs(store, safeUser.Id)

		if err != nil {
			RespondWithError(w, http.StatusBadRequest, err.Error())
			return
		}

		RespondWithJSON(w, http.StatusCreated, safeOrgs)
	}
}
