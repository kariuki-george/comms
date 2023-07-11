import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChatroomDto, MessageDto } from './dtos/index.dtos';
import { DBService } from '@db';
import { AuthService } from 'src/auth/auth.service';
import { RedisPubSubService } from '@redis';
import { PubSubChannels } from '@redis/types/index.types';
import { User, message } from '@prisma/client';

@Injectable()
export class ChatroomService {
  constructor(
    private readonly dbService: DBService,
    private readonly authService: AuthService,
    private readonly redisPubSubService: RedisPubSubService,
  ) {}

  async createChatRoom(
    { chatbotId, email, name }: CreateChatroomDto,
    country: object,
  ) {
    // Create chatroom
    const chatroom = await this.dbService.chatroom.create({
      data: {
        userEmail: email,
        userName: name,
        chatbotId,
        country,
      },
    });

    // Create auth for user
    const authToken = this.authService.createJwt({
      email,
      name,
      chatbotId,
      sender: 'USER',
      id: email,
    });

    return { chatroom, authToken };
  }

  async addMessage(input: MessageDto, user: any): Promise<message> {
    // Save the message
    const data = await this.dbService.message.create({
      data: { ...input, sender: user.sender ?? 'AGENT' },
      include: { Chatroom: true },
    });

    // Broadcast the message
    await this.redisPubSubService.publish(PubSubChannels.add_message, data);

    delete data.Chatroom;
    return data;
  }

  async joinChatRoom(chatroomId: number, agent: User) {
    const chatroom = await this.dbService.chatroom.update({
      where: { id: chatroomId },
      data: { agentId: agent.id, agentJoinedAt: new Date() },
    });

    return chatroom;
  }

  async getNewChatroom(orgId: number) {
    return this.dbService.chatroom.findMany({
      where: { Chatbot: { orgId }, agentId: null },
    });
  }

  getMyChatrooms(agentId: number) {
    return this.dbService.chatroom.findMany({
      where: {
        agentId,
        status: 'OPEN',
      },
    });
  }
  getAllMessages(chatroomId: number) {
    return this.dbService.message.findMany({ where: { chatroomId } });
  }

  closeChatroom(chatroomId: number) {
    return this.dbService.chatroom.update({
      where: {
        id: chatroomId,
      },
      data: {
        status: 'CLOSED',
      },
    });
  }
}
