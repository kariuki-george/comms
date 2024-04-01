package middleware

import (
	"comms/internal/api"
	"comms/internal/app"
	"comms/internal/config"
	"comms/internal/utils"
	"context"
	"net/http"

	"github.com/rs/zerolog/log"
)

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Get auth token from headers

		authHeader := r.Header.Get("aid")

		if authHeader == "" {
			log.Debug().Msg("[AUTH]: No authentication token provided")
			api.RespondWithError(w, http.StatusForbidden, "authentication failed")
			return
		}

		// Authenticate token

		// Get config from request

		config := r.Context().Value(utils.CTX_CONFIG).(*config.Config)

		safeUser, err := app.ValidateAuth(config, authHeader)

		if err != nil {
			api.RespondWithError(w, http.StatusForbidden, err.Error())
			return
		}

		ctx := context.WithValue(r.Context(), utils.CTX_SAFEUSER, safeUser)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
