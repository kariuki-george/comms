package api

import (
	"comms/internal/app"
	"comms/internal/utils"
	"comms/model"
	"net/http"
	"strconv"
)

func GetPermissions() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Get storage

		store := utils.GetStore(r.Context())

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

		store := utils.GetStore(r.Context())
		safeUser := utils.GetSafeUser(r.Context())

		// Check permissions

		// Cannot self permissions

		if safeUser.Id == newUserPermission.UserID {
			RespondWithError(w, http.StatusForbidden, "Cannot set own permissions")
			return
		}
		allowed := app.CheckPermissions(r.Context(), []model.SafePermission{{Asset: "Chat", Action: "Join"}})

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

		store := utils.GetStore(r.Context())
		safeUser := utils.GetSafeUser(r.Context())

		// Check permissions

		allowed := app.CheckPermissions(r.Context(), []model.SafePermission{{Asset: "Permissions", Action: "Read"}})

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

		store := utils.GetStore(r.Context())
		safeUser := utils.GetSafeUser(r.Context())

		// Check permissions
		// Cannot delete self permission

		if safeUser.Id == deleteUserPermission.UserID {
			RespondWithError(w, http.StatusForbidden, "Cannot delete own permissions")
			return
		}
		allowed := app.CheckPermissions(r.Context(), []model.SafePermission{{Asset: "Permissions", Action: "Delete"}})

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
