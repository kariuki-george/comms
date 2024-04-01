package utils

type requestContextName string

const (
	CTX_CONFIG   requestContextName = "config"
	CTX_STORE    requestContextName = "store"
	CTX_SAFEUSER requestContextName = "safeUser"
)
