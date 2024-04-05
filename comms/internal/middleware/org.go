package middleware

import (
	"comms/internal/api"
	"comms/internal/utils"
	"context"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

func OrgMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		params := mux.Vars(r)

		orgIdString := params["orgId"]

		if len(orgIdString) == 0 {
			api.RespondWithError(w, http.StatusBadRequest, "Invalid orgId provided")
			return
		}

		orgId, err := strconv.ParseInt(orgIdString, 10, 64)

		if err != nil {
			api.RespondWithError(w, http.StatusBadRequest, "Invalid orgId provided")
			return
		}

		ctx := context.WithValue(r.Context(), utils.CTX_ORGID, orgId)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
