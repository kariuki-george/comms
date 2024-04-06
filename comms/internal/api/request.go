package api

import (
	"encoding/json"
	"errors"
	"fmt"
	"strconv"

	"io"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/gorilla/mux"
	"github.com/rs/zerolog/log"
)

/*
This function handles writing errors back to the user.
Just check the error and handle it appropriately e.g breaking the connection
*/
func parseBody[T interface{}](w http.ResponseWriter, r *http.Request, d *T, location string) error {
	body, err := io.ReadAll(r.Body)

	if err != nil {
		log.Debug().Msg(fmt.Sprintf("[%s]: Failed to read request body %s", location, err.Error()))
		RespondWithError(w, http.StatusBadRequest, "something went wrong")
		return errors.New("err")
	}

	err = json.Unmarshal(body, &d)

	if err != nil {
		log.Debug().Msg(fmt.Sprintf("[%s]: Failed to read request body %s", location, err.Error()))
		RespondWithError(w, http.StatusBadRequest, "something went wrong")
		return errors.New("err")
	}

	return nil

}

var validate = validator.New(validator.WithRequiredStructEnabled())

/*
This function handles writing errors back to the user.
Just check the error and handle it appropriately e.g breaking the connection
*/
func validateStructInput[T interface{}](w http.ResponseWriter, input *T) error {

	err := validate.Struct(*input)

	if err != nil {
		// this check is only needed when your code could produce
		// an invalid value for validation such as interface with nil
		// value most including myself do not usually have code like this.
		// https://github.com/go-playground/validator/blob/master/_examples/simple/main.go
		if _, ok := err.(*validator.InvalidValidationError); ok {
			RespondWithError(w, http.StatusBadRequest, "Validation Failed")

			return err
		}

		validationErrors := err.(validator.ValidationErrors)

		e := GetErrors(validationErrors)

		RespondWithErrors(w, http.StatusBadRequest, "Validation Failed", e)
	}
	return err
}

func parseIntUrlParam(r *http.Request, name string) (int, error) {
	var params = mux.Vars(r)

	var nameString = params[name]

	if len(nameString) == 0 {
		return 0, errors.New(fmt.Sprintf("Invalid %s provided", name))

	}
	nameInt, err := strconv.ParseInt(nameString, 10, 64)

	if err != nil {
		return 0, errors.New(fmt.Sprintf("Invalid %s provided", name))
	}
	return int(nameInt), nil

}
