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
	wsm     *api.WSManager
}

func InitRouter(config *config.Config, storage storage.Storage, wsm *api.WSManager) *Router {

	router := &Router{
		router:  mux.NewRouter(),
		config:  config,
		storage: storage,
		wsm:     wsm,
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

	// Check organization
	var authedOrgRouter = apiRouter.router.PathPrefix("/api").Subrouter()
	authedOrgRouter.Use(middleware.AuthMiddleware)
	authedOrgRouter.Use(middleware.OrgMiddleware)

	// Permissions
	authedOrgRouter.HandleFunc("/{orgId}/permissions", api.GetPermissions()).Methods(http.MethodGet, http.MethodOptions)
	authedOrgRouter.HandleFunc("/{orgId}/permissions/assign", api.AssignPermission()).Methods(http.MethodPost, http.MethodOptions)
	authedOrgRouter.HandleFunc("/{orgId}/permissions/delete", api.DeleteUserPermission()).Methods(http.MethodPost, http.MethodOptions)
	authedOrgRouter.HandleFunc("/{orgId}/permissions/user", api.GetUserPermissionsByUserId()).Methods(http.MethodGet, http.MethodOptions)

	// Chatbots
	authedOrgRouter.HandleFunc("/{orgId}/chatbots", api.CreateChatbot()).Methods(http.MethodPost, http.MethodOptions)
	authedOrgRouter.HandleFunc("/{orgId}/chatbots/{chatbotKey}", api.FindChatbot()).Methods(http.MethodGet, http.MethodOptions)
	authedOrgRouter.HandleFunc("/{orgId}/chatbots", api.FindAllChatbots()).Methods(http.MethodGet, http.MethodOptions)
	authedOrgRouter.HandleFunc("/{orgId}/chatbots/{chatbotId}", api.DeleteChatbot()).Methods(http.MethodDelete, http.MethodOptions)

	// Chatrooms
	authedOrgRouter.HandleFunc("/{orgId}/chatrooms", api.CreateChatroom()).Methods(http.MethodPost, http.MethodOptions)
	authedOrgRouter.HandleFunc("/{orgId}/chatrooms/{chatroomId}/join", api.JoinChatroom()).Methods(http.MethodPost, http.MethodOptions)
	authedOrgRouter.HandleFunc("/{orgId}/chatrooms", api.GetChatroomsByUserId()).Methods(http.MethodGet, http.MethodOptions)
	authedOrgRouter.HandleFunc("/{orgId}/chatrooms/{chatroomId}/close", api.CloseChatroom()).Methods(http.MethodPost, http.MethodOptions)

	// WS

	authedOrgRouter.HandleFunc("/{orgId}/ws/{chatroomId}", apiRouter.wsm.ServeWS()).Methods(http.MethodGet, http.MethodOptions)
	authedOrgRouter.HandleFunc("/{orgId}/ws", apiRouter.wsm.ServeWS()).Methods(http.MethodGet, http.MethodOptions)

}
