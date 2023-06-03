import { Chatroom } from '../models/chatroom.model';

export class CreateChatRoomRes {
  chatroom: Chatroom;
  sessionKey: string;
}
