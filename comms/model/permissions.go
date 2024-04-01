package model

import "gorm.io/gorm"

/*
Permissions are defined at application level.
Therefore, users will not have the ability to define new permissions.
However, users will be assigned permissions, with the org owner having all permissions at their disposal.
*/
type Permission struct {
	gorm.Model
	Asset           string `gorm:"uniqueIndex:idx_org_role"` // Represents the asset/resource (e.g., users, chats)
	Action          string `gorm:"uniqueIndex:idx_org_role"` // Represents the action (e.g., create, read, update, delete)
	UserPermissions []UserPermission
}

type UserPermission struct {
	gorm.Model
	UserID       uint `gorm:"uniqueIndex:idx_user_role constraint:constraint:OnCreate,OnUpdate:RESTRICT,OnDelete:CASCADE"`
	OrgID        uint `gorm:"uniqueIndex:idx_user_role constraint:constraint:OnCreate,OnUpdate:RESTRICT,OnDelete:CASCADE"`
	PermissionID uint `gorm:"uniqueIndex:idx_user_role constraint:constraint:OnCreate,OnUpdate:RESTRICT,OnDelete:CASCADE"`
}

type CreateUserPermission struct {
	UserID       uint `json:"userId" validate:"required"`
	PermissionID uint `json:"permissionId" validate:"required"`
	OrgID        uint `json:"orgId" validate:"required"`
}

type DeleteUserPermission struct {
	PermissionID uint `json:"permissionId" validate:"required"`
	OrgID        uint `json:"orgId" validate:"required"`
	UserID       uint `json:"userId" validate:"required"`
}

type SafePermission struct {
	Asset  string `json:"asset"` // Represents the asset/resource (e.g., users, chats)
	Action string `json:"action"`
	ID     uint   `json:"permissionId"`
}

type SafeUserPermission struct {
	Permission SafePermission `json:"permission"`
	ID         uint           `json:"userPermissionId"`
}
