package app

import (
	"comms/internal/utils"
	"comms/model"
	"context"
	"errors"
	"time"

	"github.com/rs/zerolog/log"
)

func CreateChatroom(ctx context.Context, newChatroom *model.CreateChatroom) (*model.CreateChatroomResponse, error) {
	store := utils.GetStore(ctx)
	config := utils.GetConfig(ctx)
	orgId := utils.GetOrgId(ctx)
	chatroom, err := store.Chatrooms().CreateChatroom(newChatroom, orgId)

	if err != nil {
		return nil, err
	}

	tokenString, err := utils.GenerateJWT(utils.JWTClaims{UserId: 0,
		Name:  newChatroom.UserName,
		Email: newChatroom.UserEmail, ExpiresAt: time.Now().Add(24 * time.Hour), Nbf: time.Now(), IssuedAt: time.Now(), Issuer: "COMMS-CHATROOM", Subject: "AUTH", Audience: "AUTH"}, []byte(config.Auth.JwtSecret))
	if err != nil {
		log.Error().Msg("[CHATROOMS]: Failed to create JWT for anonymous user" + err.Error())
		return nil, errors.New("failed to create chatrooms")
	}

	return &model.CreateChatroomResponse{AuthToken: tokenString, Chatroom: *chatroom}, nil

}

func JoinChatroom(ctx context.Context, chatroomId uint) (*model.SafeChatroom, error) {
	store := utils.GetStore(ctx)
	orgId := utils.GetOrgId(ctx)
	safeUser := utils.GetSafeUser(ctx)

	return store.Chatrooms().JoinChatroom(chatroomId, safeUser.Id, safeUser.Name, orgId)
}

func GetChatroomsByUserId(ctx context.Context) (*[]model.SafeChatroom, error) {
	store := utils.GetStore(ctx)
	orgId := utils.GetOrgId(ctx)
	safeUser := utils.GetSafeUser(ctx)
	return store.Chatrooms().GetChatroomsByUserId(safeUser.Id, orgId)
}

func CloseChatroom(ctx context.Context, chatroomId uint) error {
	store := utils.GetStore(ctx)
	orgId := utils.GetOrgId(ctx)

	return store.Chatrooms().CloseChatroom(chatroomId, orgId)
}
