package storage

import (
	"comms/model"
	"errors"

	"github.com/rs/zerolog/log"
	"gorm.io/gorm"
)

type PermissionsImpl struct {
	db *gorm.DB
}

func NewPermissionsImpl(db *gorm.DB) *PermissionsImpl {
	Permissions := PermissionsImpl{db: db}
	Permissions.CreatePermissions()
	return &Permissions
}

func (impl *PermissionsImpl) CreatePermissions() {

	var permissions = []model.Permission{{Asset: "Users", Action: "Add"}, {Asset: "Permissions", Action: "Assign"}, {Asset: "Permissions", Action: "Delete"}, {Asset: "Chat", Action: "Join"}, {Asset: "Chat", Action: "Close"}, {Asset: "Permissions", Action: "Read"}, {Asset: "Chatbots", Action: "Create"}, {Asset: "Chatbots", Action: "Get"}, {Asset: "Chatbots", Action: "Delete"}}

	for _, permission := range permissions {
		result := impl.db.Create(&permission)

		if result.Error != nil {
			if !errors.Is(result.Error, gorm.ErrDuplicatedKey) {
				log.Fatal().Msg("[Permission]: Failed to create permission" + result.Error.Error())
			}

		}
	}

}

func (impl *PermissionsImpl) GetPermissions() (*[]model.SafePermission, error) {
	var permissions []model.Permission

	result := impl.db.Find(&permissions)

	if result.Error != nil {
		log.Error().Msg("[Permission]: Failed to get permissions" + result.Error.Error())
		return nil, errors.New("failed to get permissions")
	}

	var safePermission model.SafePermission

	var safePermissions []model.SafePermission

	for _, Permission := range permissions {
		safePermission.Action = Permission.Action
		safePermission.Asset = Permission.Asset
		safePermission.ID = Permission.ID

		safePermissions = append(safePermissions, safePermission)
	}

	return &safePermissions, nil

}

func (impl *PermissionsImpl) AssignPermission(newUserPermission *model.CreateUserPermission) (*model.SafeUserPermission, error) {
	var userPermission model.UserPermission

	userPermission.OrgID = newUserPermission.OrgID
	userPermission.PermissionID = newUserPermission.PermissionID
	userPermission.UserID = newUserPermission.UserID

	result := impl.db.Create(&userPermission)

	if result.Error != nil {
		log.Error().Msg("[Permission]: Failed to create user permission " + result.Error.Error())
		return nil, errors.New("failed to create user permission")
	}

	var permission model.Permission
	result = impl.db.Where("id = ?", newUserPermission.PermissionID).Limit(1).Find(&permission)

	if result.Error != nil {
		log.Error().Msg("[PermissionS]: Failed to get  permission" + result.Error.Error())
	}

	var safeUserPermission model.SafeUserPermission

	safeUserPermission.ID = userPermission.ID
	safeUserPermission.Permission.ID = permission.ID
	safeUserPermission.Permission.Action = permission.Action
	safeUserPermission.Permission.Asset = permission.Asset

	return &safeUserPermission, nil

}

// Low level
func AssignPermissions(tx *gorm.DB, userPermissions *[]model.UserPermission) error {

	result := tx.Create(&userPermissions)

	if result.Error != nil {
		log.Error().Msg("[PermissionS]: Failed to set bulk permissions " + result.Error.Error())
		return errors.New("failed to setup permissions")
	}
	return nil

}

func (impl *PermissionsImpl) GetUserPermissionsByUserId(userId uint, orgId uint) (*[]model.SafeUserPermission, error) {

	rows, err := impl.db.Table("user_permissions").
		Select("user_permissions.id as userPermissionId, permissions.asset, permissions.action, permissions.id as permissionId").
		Joins("JOIN permissions ON user_permissions.permission_id = permissions.id").
		Where("user_permissions.user_id = ?", userId).
		Where("user_permissions.org_id = ?", orgId).
		Rows()
	if err != nil {
		log.Error().Msg("[Permission]: Failed to get user permissions " + err.Error())
		return nil, errors.New("failed to get user permissions")
	}

	var safeUserPermissions = []model.SafeUserPermission{}
	for rows.Next() {
		var safeUserPermission model.SafeUserPermission
		if err := rows.Scan(&safeUserPermission.ID, &safeUserPermission.Permission.Asset, &safeUserPermission.Permission.Action, &safeUserPermission.Permission.ID); err != nil {
			log.Error().Msg("[Permission]: Failed to scan user permission row " + err.Error())
			return nil, errors.New("failed to get user permissions")
		}

		// Append the permission to the result slice
		safeUserPermissions = append(safeUserPermissions, safeUserPermission)

	}

	return &safeUserPermissions, nil

}

func (impl *PermissionsImpl) DeleteUserPermission(permissionId uint, orgId uint) error {
	var userPermission model.UserPermission

	err := impl.db.Where("org_id = ?", orgId).
		Where("permissionId = ?", permissionId).Delete(&userPermission).Error

	if err != nil {
		return errors.New("failed to delete user permission")
	}
	return nil
}
