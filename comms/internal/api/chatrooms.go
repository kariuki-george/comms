package api

import (
	"comms/internal/app"
	"comms/model"
	"net/http"
)

func CreateChatroom() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var newChatroom model.CreateChatroom

		err := parseBody(w, r, &newChatroom, "CHATROOMS")

		if err != nil {
			return
		}

		err = validateStructInput(w, &newChatroom)

		if err != nil {
			return
		}

		// Check permissions

		isValid := app.CheckPermissions(r.Context(), []model.SafePermission{{Asset: "Chatrooms", Action: "Create"}})

		if !isValid {
			RespondWithPermissionsError(w)
			return
		}

		safeChatroom, err := app.CreateChatroom(r.Context(), &newChatroom)

		if err != nil {
			RespondWithError(w, http.StatusBadRequest, err.Error())
			return
		}
		RespondWithJSON(w, http.StatusCreated, safeChatroom)
	}
}

func JoinChatroom() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		chatroomId, err := parseIntUrlParam(r, "chatroomId")

		if err != nil {
			RespondWithError(w, http.StatusBadRequest, err.Error())
			return
		}

		// Check permissions

		isValid := app.CheckPermissions(r.Context(), []model.SafePermission{{Asset: "Chatrooms", Action: "Join"}})

		if !isValid {
			RespondWithPermissionsError(w)
			return
		}

		safeChatroom, err := app.JoinChatroom(r.Context(), uint(chatroomId))

		if err != nil {
			RespondWithError(w, http.StatusBadRequest, err.Error())
			return
		}
		RespondWithJSON(w, http.StatusCreated, safeChatroom)
	}
}

func GetChatroomsByUserId() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Check permissions

		isValid := app.CheckPermissions(r.Context(), []model.SafePermission{{Asset: "Chatrooms", Action: "Read"}})

		if !isValid {
			RespondWithPermissionsError(w)
			return
		}

		safeChatrooms, err := app.GetChatroomsByUserId(r.Context())

		if err != nil {
			RespondWithError(w, http.StatusBadRequest, err.Error())
			return
		}
		RespondWithJSON(w, http.StatusCreated, safeChatrooms)
	}
}

func CloseChatroom() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		chatroomId, err := parseIntUrlParam(r, "chatroomId")

		if err != nil {
			RespondWithError(w, http.StatusBadRequest, err.Error())
			return
		}

		// Check permissions

		isValid := app.CheckPermissions(r.Context(), []model.SafePermission{{Asset: "Chatrooms", Action: "Close"}})

		if !isValid {
			RespondWithPermissionsError(w)
			return
		}

		err = app.CloseChatroom(r.Context(), uint(chatroomId))

		if err != nil {
			RespondWithError(w, http.StatusBadRequest, err.Error())
			return
		}
		RespondWithJSON(w, http.StatusCreated, "Closed chatroom successfully")
	}
}
