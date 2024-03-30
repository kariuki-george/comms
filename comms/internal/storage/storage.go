package storage

type Storage interface {
	User() UsersRepo
}
