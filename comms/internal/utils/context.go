package utils

import (
	"comms/internal/config"
	"comms/internal/storage"
	"comms/model"
	"context"
)

type requestContextName string

const (
	CTX_CONFIG   requestContextName = "config"
	CTX_STORE    requestContextName = "store"
	CTX_SAFEUSER requestContextName = "safeUser"
	CTX_ORGID    requestContextName = "orgId"
)

func GetConfig(ctx context.Context) *config.Config {
	return ctx.Value(CTX_CONFIG).(*config.Config)
}

func GetStore(ctx context.Context) storage.Storage {
	return ctx.Value(CTX_STORE).(storage.Storage)
}

func GetSafeUser(ctx context.Context) *model.SafeUser {
	return ctx.Value(CTX_SAFEUSER).(*model.SafeUser)
}

func GetOrgId(ctx context.Context) uint {
	return uint(ctx.Value(CTX_ORGID).(int64))
}
