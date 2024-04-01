package app

import (
	"comms/internal/storage"
	"comms/model"
)

func CreateOrg(store storage.Storage, newOrg model.CreateOrg, userId uint) (*model.SafeOrg, error) {
	return store.Orgs().CreateOrg(&newOrg, userId)

}

// Returns all orgs a user owns
func GetOwnedOrgs(store storage.Storage, userId uint) (*[]model.SafeOrg, error) {
	return store.Orgs().GetOwnedOrgs(userId)
}
