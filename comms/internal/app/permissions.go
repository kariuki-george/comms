package app

import (
	"comms/internal/storage"
	"comms/model"
)

func GetPermissions(store storage.Storage) (*[]model.SafePermission, error) {
	return store.Permissions().GetPermissions()
}

// TODO: CHECK PermissionS
func AssignPermission(store storage.Storage, Permission *model.CreateUserPermission) (*model.SafeUserPermission, error) {
	return store.Permissions().AssignPermission(Permission)

}

func GetUserPermissionsByUserId(store storage.Storage, userId uint, orgId uint) (*[]model.SafeUserPermission, error) {
	return store.Permissions().GetUserPermissionsByUserId(userId, orgId)
}

// CheckPermissions checks if a user has the needed permissions.
func CheckPermissions(store storage.Storage, requiredPermissions []model.SafePermission, userId uint, orgId uint) bool {
	userPermissions, err := GetUserPermissionsByUserId(store, userId, orgId)
	if err != nil {
		return false
	}

	// Map to store the permissions associated with the user for quick lookup.
	userPermissionsMap := make(map[string]bool)
	for _, userPermission := range *userPermissions {

		userPermissionsMap[userPermission.Permission.Asset+":"+userPermission.Permission.Action] = true
	}

	// Check if the user has all the required permissions.
	for _, requiredPermission := range requiredPermissions {
		if _, ok := userPermissionsMap[requiredPermission.Asset+":"+requiredPermission.Action]; !ok {
			// User does not have the required permissions.
			return false
		}
	}

	// User has all the required permissions.
	return true
}

func DeleteUserPermission(store storage.Storage, permissionId uint, orgId uint) error {
	return store.Permissions().DeleteUserPermission(permissionId, orgId)
}
