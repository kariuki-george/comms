package app

import (
	"comms/internal/storage"
	"comms/model"
	"crypto/rand"
	"crypto/subtle"
	"encoding/base64"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
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

func Login(store storage.Storage, loginUser *model.LoginUser) (*model.SafeLogin, error) {
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
	tokenString, err := generateJWT(int(user.ID), user.Email)
	if err != nil {
		log.Error().Msg("[AUTH]: Failed to create JWT" + err.Error())
		return nil, errors.New("failed to login")
	}

	safeLogin.AuthJWT = tokenString
	safeLogin.User.Email = user.Email
	safeLogin.User.Id = int(user.ID)
	safeLogin.User.Name = user.Name

	return &safeLogin, nil

}

func generateJWT(userId int, email string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userId":    userId,
		"userEmail": email,
		"nbf":       time.Now().Unix(),
	})
	// TODO: ADDED BETTER SEC
	tokenString, err := token.SignedString([]byte("hmacSampleSecret"))

	if err != nil {
		return "", err
	}
	return tokenString, nil

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
