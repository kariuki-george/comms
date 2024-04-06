package api

import (
	"comms/internal/app"
	"comms/internal/utils"
	"comms/model"
	"net/http"
	"strconv"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
)

func CreateChatbot() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Get body
		var newChatbot model.CreateChatbot

		err := parseBody(w, r, &newChatbot, "CHATBOTS")

		if err != nil {
			return
		}

		// Validate

		err = validateStructInput(w, &newChatbot)
		if err != nil {
			return
		}

		store := utils.GetStore(r.Context())
		orgId := utils.GetOrgId(r.Context())

		// Check permissions permissions
		isValid := app.CheckPermissions(r.Context(), []model.SafePermission{{Asset: "Chatbots", Action: "Create"}})

		if !isValid {
			RespondWithPermissionsError(w)
			return
		}
		// Create
		newChatbot.OrgId = orgId
		safeChatbot, err := app.CreateChatbot(store, &newChatbot)

		if err != nil {
			RespondWithError(w, http.StatusBadRequest, err.Error())
			return
		}
		RespondWithJSON(w, http.StatusCreated, safeChatbot)

	}
}

func FindChatbot() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Get Chatbot param

		params := mux.Vars(r)

		chatbotKey := params["chatbotKey"]

		if len(chatbotKey) == 0 {
			RespondWithError(w, http.StatusBadRequest, "Invalid Chatbotkey provided")
			return
		}

		// Validate chatbotkey is a uuid
		err := uuid.Validate(chatbotKey)

		if err != nil {
			RespondWithError(w, http.StatusBadRequest, "Invalid Chatbotkey provided")
			return
		}

		store := utils.GetStore(r.Context())

		// Check permissions permissions
		isValid := app.CheckPermissions(r.Context(), []model.SafePermission{{Asset: "Chatbots", Action: "Get"}})

		if !isValid {
			RespondWithPermissionsError(w)
			return
		}
		// Create
		safeChatbot, err := app.FindChatbot(store, chatbotKey)

		if err != nil {
			RespondWithError(w, http.StatusBadRequest, err.Error())
			return
		}
		RespondWithJSON(w, http.StatusCreated, safeChatbot)

	}
}

func FindAllChatbots() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		orgId := utils.GetOrgId(r.Context())

		store := utils.GetStore(r.Context())

		// Check permissions permissions
		isValid := app.CheckPermissions(r.Context(), []model.SafePermission{{Asset: "Chatbots", Action: "Get"}})

		if !isValid {
			RespondWithPermissionsError(w)
			return
		}
		// Create
		safeChatbots, err := app.FindAllChatbots(store, orgId)

		if err != nil {
			RespondWithError(w, http.StatusBadRequest, err.Error())
			return
		}
		RespondWithJSON(w, http.StatusCreated, safeChatbots)
	}
}
func DeleteChatbot() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Get ChatbotId
		params := mux.Vars(r)

		chatbotIdString := params["chatbotId"]

		if len(chatbotIdString) == 0 {
			RespondWithError(w, http.StatusBadRequest, "Invalid ChatbotId provided")
			return
		}
		// Parse int
		chatbotId, err := strconv.ParseInt(chatbotIdString, 10, 64)

		if err != nil {
			RespondWithError(w, http.StatusBadRequest, "Invalid chatbotId provided")
			return
		}
		orgId := utils.GetOrgId(r.Context())

		store := utils.GetStore(r.Context())

		// Check permissions permissions
		isValid := app.CheckPermissions(r.Context(), []model.SafePermission{{Asset: "Chatbots", Action: "Delete"}})

		if !isValid {
			RespondWithPermissionsError(w)
			return
		}
		// Create
		err = app.DeleteChatbot(store, uint(chatbotId), orgId)

		if err != nil {
			RespondWithError(w, http.StatusBadRequest, err.Error())
			return
		}
		RespondWithJSON(w, http.StatusCreated, "Deleted chatbot successfully")

	}
}
