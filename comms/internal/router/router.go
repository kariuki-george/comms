package router

import (
	"comms/internal/api"
	"comms/internal/config"
	"comms/internal/middleware"
	"comms/internal/storage"
	"comms/internal/utils"
	"context"
	"net/http"

	"github.com/gorilla/mux"
)

type Router struct {
	router  *mux.Router
	config  *config.Config
	storage storage.Storage
}

func InitRouter(config *config.Config, storage storage.Storage) *Router {

	router := &Router{
		router:  mux.NewRouter(),
		config:  config,
		storage: storage,
	}
	router.initRoutes()

	return router
}

// Serve HTTP
func (router *Router) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	//TODO:  Setup cors
	if origin := req.Header.Get("Origin"); origin != "" {
		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers",
			"Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
	}

	// Stop here for a Preflighted OPTIONS request.
	if req.Method == "OPTIONS" {
		return
	}
	// Attach context to the request for use by middleware and api
	ctx := context.WithValue(req.Context(), utils.CTX_CONFIG, router.config)
	ctx = context.WithValue(ctx, utils.CTX_STORE, router.storage)

	router.router.ServeHTTP(w, req.WithContext(ctx))
}

func (apiRouter *Router) initRoutes() {

	//Default router

	var router = apiRouter.router.PathPrefix("/api").Subrouter()

	// UnAuthed Routes

	router.HandleFunc("/health", api.Health()).Methods(http.MethodGet, http.MethodOptions)
	// User

	router.HandleFunc("/users", api.CreateUser()).Methods(http.MethodPost, http.MethodOptions)

	// Auth
	router.HandleFunc("/auth/login", api.Login()).Methods(http.MethodPost, http.MethodOptions)

	// Authed Route

	var authedRouter = apiRouter.router.PathPrefix("/api").Subrouter()

	authedRouter.Use(middleware.AuthMiddleware)

	// Orgs

	authedRouter.HandleFunc("/orgs", api.CreateOrg()).Methods(http.MethodPost, http.MethodOptions)
	authedRouter.HandleFunc("/orgs", api.GetOwnedOrgs()).Methods(http.MethodGet, http.MethodOptions)

	// Permissions
	authedRouter.HandleFunc("/permissions", api.GetPermissions()).Methods(http.MethodGet, http.MethodOptions)
	authedRouter.HandleFunc("/permissions/assign", api.AssignPermission()).Methods(http.MethodPost, http.MethodOptions)
	authedRouter.HandleFunc("/permissions/delete", api.DeleteUserPermission()).Methods(http.MethodPost, http.MethodOptions)
	authedRouter.HandleFunc("/permissions/user", api.GetUserPermissionsByUserId()).Methods(http.MethodGet, http.MethodOptions)

	// WS

	wsManager := NewWSManager()

	authedRouter.HandleFunc("/ws", wsManager.serveWS()).Methods(http.MethodGet, http.MethodOptions)

}
