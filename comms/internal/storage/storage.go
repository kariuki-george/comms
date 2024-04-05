package storage

type Storage interface {
	User() UsersRepo
	Orgs() OrgsRepo
	Permissions() PermissionsRepo
	Chatbots() ChatbotsRepo
}
