package api

import (
	"comms/internal/app"
	"comms/internal/storage"
	"comms/internal/utils"
	"comms/model"
	"net/http"
	"strconv"
)

func GetPermissions() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Get storage

		var store = r.Context().Value(utils.CTX_STORE).(storage.Storage)

		safePermissions, err := app.GetPermissions(store)

		if err != nil {
			RespondWithError(w, http.StatusBadRequest, err.Error())
			return
		}
		RespondWithJSON(w, http.StatusOK, safePermissions)

	}
}

func AssignPermission() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var newUserPermission model.CreateUserPermission

		err := parseBody(w, r, &newUserPermission, "Permissions")
		if err != nil {
			return
		}

		err = validateStructInput(w, &newUserPermission)

		if err != nil {
			return
		}

		// Get storage

		var store = r.Context().Value(utils.CTX_STORE).(storage.Storage)
		var safeUser = r.Context().Value(utils.CTX_SAFEUSER).(*model.SafeUser)

		// Check permissions

		// Cannot self permissions

		if safeUser.Id == newUserPermission.UserID {
			RespondWithError(w, http.StatusForbidden, "Cannot set own permissions")
			return
		}
		allowed := app.CheckPermissions(store, []model.SafePermission{{Asset: "Chat", Action: "Join"}}, safeUser.Id, newUserPermission.OrgID)

		if !allowed {
			RespondWithPermissionsError(w)
			return
		}

		safeUserPermission, err := app.AssignPermission(store, &newUserPermission)

		if err != nil {
			RespondWithError(w, http.StatusBadRequest, err.Error())
			return
		}
		RespondWithJSON(w, http.StatusOK, safeUserPermission)

	}
}

func GetUserPermissionsByUserId() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		// Get orgId

		params := r.URL.Query()

		orgIdString := params.Get("orgId")

		orgId, err := strconv.ParseInt(orgIdString, 10, 64)

		if orgIdString == "" || err != nil {
			RespondWithError(w, http.StatusBadRequest, "Invalid organization Id provided")
			return
		}

		// Get storage

		var store = r.Context().Value(utils.CTX_STORE).(storage.Storage)
		var safeUser = r.Context().Value(utils.CTX_SAFEUSER).(*model.SafeUser)

		// Check permissions

		allowed := app.CheckPermissions(store, []model.SafePermission{{Asset: "Permissions", Action: "Read"}}, safeUser.Id, uint(orgId))

		if !allowed {
			RespondWithPermissionsError(w)
			return
		}

		safeUserPermission, err := app.GetUserPermissionsByUserId(store, safeUser.Id, uint(orgId))

		if err != nil {
			RespondWithError(w, http.StatusBadRequest, err.Error())
			return
		}
		RespondWithJSON(w, http.StatusOK, safeUserPermission)

	}
}

func DeleteUserPermission() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var deleteUserPermission model.DeleteUserPermission

		err := parseBody(w, r, &deleteUserPermission, "Permissions")
		if err != nil {
			return
		}

		err = validateStructInput(w, &deleteUserPermission)

		if err != nil {
			return
		}

		// Get storage

		var store = r.Context().Value(utils.CTX_STORE).(storage.Storage)
		var safeUser = r.Context().Value(utils.CTX_SAFEUSER).(*model.SafeUser)

		// Check permissions
		// Cannot delete self permission

		if safeUser.Id == deleteUserPermission.UserID {
			RespondWithError(w, http.StatusForbidden, "Cannot delete own permissions")
			return
		}
		allowed := app.CheckPermissions(store, []model.SafePermission{{Asset: "Permissions", Action: "Delete"}}, safeUser.Id, deleteUserPermission.OrgID)

		if !allowed {
			RespondWithPermissionsError(w)
			return
		}

		err = app.DeleteUserPermission(store, deleteUserPermission.PermissionID, deleteUserPermission.OrgID)

		if err != nil {
			RespondWithError(w, http.StatusBadRequest, err.Error())
			return
		}
		RespondWithJSON(w, http.StatusOK, "Permission delete successfully")

	}
}
