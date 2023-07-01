import { Injectable } from '@nestjs/common';
import { CreateChatroomDto, MessageDto } from './dtos/index.dtos';
import { DBService } from '@db';
import { ResponseAndPublishDto } from '@ws/dtos/index.dtos';
import { AuthService } from 'src/auth/auth.service';
import { RedisPubSubService } from '@redis';
import { PubSubChannels } from '@redis/types/index.types';

@Injectable()
export class ChatroomService {
  constructor(
    private readonly dbService: DBService,
    private readonly authService: AuthService,
    private readonly redisPubSubService: RedisPubSubService,
  ) {}

  async createChatRoom({ chatbotId, email, name }: CreateChatroomDto) {
    // Create chatroom
    const chatroom = await this.dbService.chatroom.create({
      data: {
        userEmail: email,
        userName: name,
        chatbotId,
      },
    });

    // Create auth for user
    const authToken = this.authService.createJwt({
      email,
      name,
      chatbotId,
      sender: 'USER',
    });

    // Add chatroom to an agent queue
    await this.redisPubSubService.publish(PubSubChannels.create_chatroom, {
      chatroom: chatroom.id,
      chatbotId,
    });

    return { chatroom, authToken };
  }

  async addMessage(
    input: MessageDto,
    sender: 'USER' | 'AGENT',
  ): Promise<ResponseAndPublishDto> {
    // Save the message
    const data = await this.dbService.message.create({
      data: { ...input, sender },
    });
    // Broadcast the message

    return { data, channel: PubSubChannels.add_message + input.chatroomId };
  }
}
