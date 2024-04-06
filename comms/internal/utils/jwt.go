package utils

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// JWTClaims represents the custom claims for JWT
type JWTClaims struct {
	UserId    int       `json:"userId"`
	Email     string    `json:"email"`
	ExpiresAt time.Time `json:"exp"`
	IssuedAt  time.Time `json:"issuedAt"`
	Issuer    string    `json:"issuer"`
	Subject   string    `json:"subject"`
	Audience  string    `json:"audience"`
	Nbf       time.Time `json:"nbf"`
	Name      string    `json:"name"`
}

// GetExpirationTime returns the expiration time for the token
func (claims JWTClaims) GetExpirationTime() (*jwt.NumericDate, error) {
	return &jwt.NumericDate{Time: claims.ExpiresAt}, nil
}

// GetIssuedAt returns the time at which the token was issued
func (claims JWTClaims) GetIssuedAt() (*jwt.NumericDate, error) {
	return &jwt.NumericDate{Time: claims.ExpiresAt}, nil
}

// GetNotBefore returns the time before which the token should not be considered valid
func (claims JWTClaims) GetNotBefore() (*jwt.NumericDate, error) {
	return &jwt.NumericDate{Time: claims.Nbf}, nil
}

// GetIssuer returns the issuer of the token
func (claims JWTClaims) GetIssuer() (string, error) {
	return claims.Issuer, nil
}

// GetSubject returns the subject of the token
func (claims JWTClaims) GetSubject() (string, error) {
	return claims.Audience, nil
}

// GetAudience returns the audience of the token
func (claims JWTClaims) GetAudience() (jwt.ClaimStrings, error) {
	audience := []string{}

	audience = append(audience, claims.Audience)

	return audience, nil
}
func GenerateJWT(claims JWTClaims, secret []byte) (string, error) {

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString(secret)

	if err != nil {
		return "", err
	}
	return tokenString, nil

}

func ValidateJWT(tokenString string, secret []byte) (claims *JWTClaims, err error) {
	claims = &JWTClaims{}

	_, err = jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {

		return secret, nil
	})

	if err != nil {
		return nil, err
	}

	return claims, nil

}
