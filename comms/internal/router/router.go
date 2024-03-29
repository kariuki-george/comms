package router

import (
	"comms/internal/api"
	"comms/internal/config"
	"net/http"

	"github.com/gorilla/mux"
)

type Router struct {
	router *mux.Router
	config *config.Config
}

func InitRouter(config *config.Config) *Router {

	router := &Router{
		router: mux.NewRouter(),
		config: config,
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

	router.router.ServeHTTP(w, req)
}

func (apiRouter *Router) initRoutes() {

	//Default router

	var router = apiRouter.router.PathPrefix("/api").Subrouter()
	router.HandleFunc("/status", api.Health()).Methods(http.MethodGet, http.MethodOptions)

	// WS

	wsManager := NewWSManager(apiRouter.config)

	router.HandleFunc("/ws", wsManager.serveWS()).Methods(http.MethodGet, http.MethodOptions)

	// n := negroni.Classic()
	// apiRouter.router.PathPrefix("/api").Handler()

}
