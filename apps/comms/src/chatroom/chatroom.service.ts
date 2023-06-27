import { Injectable } from '@nestjs/common';
import { CreateChatroomDto, MessageDto } from './dtos/index.dtos';
import { DBService } from '@db';
import { ResponseAndPublishDto } from '@ws/dtos/index.dtos';

@Injectable()
export class ChatroomService {
  constructor(private readonly dbService: DBService) {}

  async createChatRoom({ chatbotId, email, name }: CreateChatroomDto) {
    // Create chatroom
    const chatroom = await this.dbService.chatroom.create({
      data: {
        userEmail: email,
        userName: name,
        chatbotId,
      },
    });
    // Add chatroom to an agent queue
    // await this.redisPubSubService.publish('CHATROOM_CREATE', {
    //   chatroom: chatroom.id,
    //   chatbotId,
    // });
    return chatroom;
  }

  async addMessage(input: MessageDto): Promise<ResponseAndPublishDto> {
    // Save the message
    const data = await this.dbService.message.create({
      data: input,
    });
    // Broadcast the message

    return { data, channel: 'ADD_MESSAGE' };
  }
}
