package model

type LoginUser struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type SafeLogin struct {
	User    SafeUser `json:"user"`
	AuthJWT string   `json:"authJWT"`
}
