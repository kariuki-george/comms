package storage

import (
	"comms/model"
	"errors"

	"github.com/jinzhu/copier"
	"github.com/rs/zerolog/log"
	"gorm.io/gorm"
)

type OrgsImpl struct {
	db *gorm.DB
}

func NewOrgsImpl(db *gorm.DB) *OrgsImpl {
	return &OrgsImpl{
		db,
	}
}

/*
Creates an organization and assigns permissions to the user
*/
func (impl *OrgsImpl) CreateOrg(newOrg *model.CreateOrg, userId uint) (*model.SafeOrg, error) {

	var safeOrg model.SafeOrg
	var org model.Org

	copier.Copy(&safeOrg, &newOrg)
	copier.Copy(&org, &newOrg)

	org.UserID = uint(userId)

	err := impl.db.Transaction(func(tx *gorm.DB) error {
		result := tx.Create(&org)

		if result.Error != nil {

			if errors.Is(result.Error, gorm.ErrDuplicatedKey) {
				return errors.New("organization with the provided name already exists")

			}

			log.Error().Msg("[ORGS]: Failed to create org" + result.Error.Error())

			return errors.New("failed to create organization")

		}

		// Assign permissions

		// Get all permissions
		var permissions []model.Permission

		result = tx.Find(&permissions)

		if result.Error != nil {
			log.Error().Msg("[Permission-ORG]: Failed to get permissions when creating org" + result.Error.Error())
			return errors.New("failed to create organization")
		}

		// TODO: PERF: DO a bulk insert

		var newUserPermissions []model.UserPermission

		for _, permission := range permissions {
			newUserPermissions = append(newUserPermissions, model.UserPermission{UserID: userId, PermissionID: permission.ID, OrgID: org.ID})
		}

		err := AssignPermissions(tx, &newUserPermissions)

		if err != nil {
			log.Error().Msg("[ORG]: Failed to set permissions when creating org" + err.Error())
			return errors.New("failed to create organization")
		}

		return nil

	})

	if err != nil {
		return nil, err
	}

	safeOrg.Id = org.ID
	return &safeOrg, nil

}

func (impl *OrgsImpl) GetOwnedOrgs(userId uint) (*[]model.SafeOrg, error) {

	var orgs []model.Org

	result := impl.db.Select("name", "id").Where("user_id = ?", userId).Find(&orgs)

	if result.Error != nil {

		log.Error().Msg("[ORGS]: Failed to get orgs" + result.Error.Error())
		return nil, errors.New("failed to get orgs")
	}

	var safeOrgs = []model.SafeOrg{}

	var safeOrg model.SafeOrg

	for _, org := range orgs {
		safeOrg.Id = org.ID
		safeOrg.Name = org.Name
		safeOrgs = append(safeOrgs, safeOrg)
	}

	return &safeOrgs, nil
}
