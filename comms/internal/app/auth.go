package app

import (
	"comms/internal/config"
	"comms/internal/storage"
	"comms/internal/utils"
	"comms/model"
	"crypto/rand"
	"crypto/subtle"
	"encoding/base64"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/rs/zerolog/log"
	"golang.org/x/crypto/argon2"
)

type argonParams struct {
	memory      uint32
	iterations  uint32
	parallelism uint8
	saltLength  uint32
	keyLength   uint32
}

func Login(store storage.Storage, config *config.Config, loginUser *model.LoginUser) (*model.SafeLogin, error) {
	// Get user from db

	user, err := store.User().GetUserByEmail(loginUser.Email)

	if err != nil {
		return nil, errors.New("invalid credentials provided")
	}

	// Compare passwords

	err = comparePasswordAndHash(loginUser.Password, user.Password)

	if err != nil {
		// Password dont match
		log.Debug().Msg("[AUTH]: Passwords don't match " + err.Error())
		return nil, errors.New("invalid credentials provided")
	}

	var safeLogin model.SafeLogin

	// Create a jwt token

	tokenString, err := utils.GenerateJWT(utils.JWTClaims{UserId: int(user.ID),
		Name:  user.Name,
		Email: user.Email, ExpiresAt: time.Now().Add(24 * time.Hour), Nbf: time.Now(), IssuedAt: time.Now(), Issuer: "COMMS-AUTH", Subject: "AUTH", Audience: "AUTH"}, []byte(config.Auth.JwtSecret))
	if err != nil {
		log.Error().Msg("[AUTH]: Failed to create JWT" + err.Error())
		return nil, errors.New("failed to login")
	}

	safeLogin.AuthJWT = tokenString
	safeLogin.User.Email = user.Email
	safeLogin.User.Id = user.ID
	safeLogin.User.Name = user.Name

	return &safeLogin, nil

}

func ValidateAuth(config *config.Config, token string) (*model.SafeUser, error) {
	var user model.SafeUser

	// Get claims from jwt
	claims, err := utils.ValidateJWT(token, []byte([]byte(config.Auth.JwtSecret)))

	if err != nil {
		log.Debug().Msg("[AUTH]: Auth failed " + err.Error())
		return nil, errors.New("authentication failed")
	}

	// Check expiry

	if claims.ExpiresAt.Before(time.Now()) {
		return nil, errors.New("authentication failed")
	}

	user.Id = uint(claims.UserId)
	user.Email = claims.Email
	user.Name = claims.Name

	return &user, nil

}

func generateFromPassword(password string) (string, error) {
	p := getArgonParams()
	salt, err := generateRandomBytes(p.saltLength)

	if err != nil {
		return "", err
	}

	// // Pass the plaintext password, salt and parameters to the argon2.IDKey
	// function. This will generate a hash of the password using the Argon2id
	// variant.
	// Most secure variant
	var hash = argon2.IDKey([]byte(password), salt, p.iterations, p.memory, p.parallelism, p.keyLength)

	// Base64 encode the salt and hashed pass
	b64Salt := base64.RawStdEncoding.EncodeToString(salt)
	b64Hash := base64.RawStdEncoding.EncodeToString(hash)

	// Return a string using the standard encoded hash representation.
	encodedHash := fmt.Sprintf("$argon2id$v=%d$m=%d,t=%d,p=%d$%s$%s", argon2.Version, p.memory, p.iterations, p.parallelism, b64Salt, b64Hash)

	return encodedHash, nil
}

func generateRandomBytes(length uint32) ([]byte, error) {
	bytes := make([]byte, length)

	_, err := rand.Read(bytes)

	if err != nil {
		return nil, err
	}
	return bytes, nil
}

func getArgonParams() argonParams {
	return argonParams{
		memory:      64 * 1024,
		iterations:  3,
		parallelism: 2,
		saltLength:  16,
		keyLength:   32,
	}

}

func comparePasswordAndHash(password string, encodedHash string) error {
	// Extract params from encoded hash
	argonparams, salt, hash, err := decodeHash(encodedHash)

	if err != nil {
		return err
	}

	otherHash := argon2.IDKey([]byte(password), salt, argonparams.iterations, argonparams.memory, argonparams.parallelism, argonparams.keyLength)

	// Check that the contents of the hashed passwords are identical. Note
	// that we are using the subtle.ConstantTimeCompare() function for this
	// to help prevent timing attacks.
	if subtle.ConstantTimeCompare(hash, otherHash) == 1 {
		return nil
	}

	return errors.New("passwords don't match")

}

func decodeHash(encodedHash string) (p *argonParams, salt, hash []byte, err error) {
	vals := strings.Split(encodedHash, "$")

	if len(vals) != 6 {
		return nil, nil, nil, errors.New("invalid Hash")
	}

	var version int
	_, err = fmt.Sscanf(vals[2], "v=%d", &version)

	if err != nil {
		return nil, nil, nil, err
	}

	if version != argon2.Version {
		return nil, nil, nil, errors.New("incompatible hash version. Expected argon2")
	}

	p = &argonParams{}

	_, err = fmt.Sscanf(vals[3], "m=%d,t=%d,p=%d", &p.memory, &p.iterations, &p.parallelism)
	if err != nil {
		return nil, nil, nil, err
	}

	salt, err = base64.RawStdEncoding.Strict().DecodeString(vals[4])
	if err != nil {
		return nil, nil, nil, err
	}
	p.saltLength = uint32(len(salt))

	hash, err = base64.RawStdEncoding.Strict().DecodeString(vals[5])
	if err != nil {
		return nil, nil, nil, err
	}
	p.keyLength = uint32(len(hash))

	return p, salt, hash, nil

}
