import { Chatroom } from '@prisma/client';

export class RedisSocketEventSendDto {
  public readonly userId: string;
  public readonly socketId: string;
  public readonly event: string;
  public readonly data: unknown;
}

export class AddMessageEventDto {
  sender: 'USER' | 'AGENT';
  message: string;
  id: number;
  chatroomId: number;
  Chatroom: Chatroom;
}

export class ResponseAndPublishDto {
  data: any;
  channel: string;
}
