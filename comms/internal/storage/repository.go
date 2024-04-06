package storage

import "comms/model"

type UsersRepo interface {
	CreateUser(user *model.CreateUser) (*model.SafeUser, error)
	GetUserById(userId uint) (*model.User, error)
	GetUserByEmail(email string) (*model.User, error)
}

type OrgsRepo interface {
	CreateOrg(org *model.CreateOrg, userId uint) (*model.SafeOrg, error)
	GetOwnedOrgs(userId uint) (*[]model.SafeOrg, error)
}

type PermissionsRepo interface {
	CreatePermissions()
	GetPermissions() (*[]model.SafePermission, error)
	AssignPermission(permission *model.CreateUserPermission) (*model.SafeUserPermission, error)
	DeleteUserPermission(permissionId uint, orgId uint) error
	GetUserPermissionsByUserId(userId uint, orgId uint) (*[]model.SafeUserPermission, error)
}

type ChatbotsRepo interface {
	CreateChatbot(chatbot *model.CreateChatbot) (*model.SafeChatbot, error)
	FindChatbot(chatbotKey string) (*model.SafeChatbot, error)
	FindAllChatbots(orgId uint) (*[]model.SafeChatbot, error)
	DeleteChatbot(chatbotId uint, orgId uint) error
}

// OrgIds aren't required but are a good practice for multitenancy distinction
type ChatroomsRepo interface {
	CreateChatroom(chatroom *model.CreateChatroom, orgId uint) (*model.SafeChatroom, error)
	JoinChatroom(chatroomId uint, userId uint, userName string, orgId uint) (*model.SafeChatroom, error)
	GetChatroomsByUserId(userId uint, orgId uint) (*[]model.SafeChatroom, error)
	CloseChatroom(chatroomId uint, orgId uint) error
}
