import { BadRequestException, Injectable } from '@nestjs/common';
import { ChatroomRepo } from './chatroom.repo';
import { CreateChatroomDto } from './dtos/index.dtos';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { sign } from 'jsonwebtoken';
import { CreateChatRoomRes } from './res/index.res';

@Injectable()
export class ChatroomService {
  constructor(
    private readonly chatroomRepo: ChatroomRepo,
    private readonly configService: ConfigService,
  ) {}

  async createChatRoom({
    email,
    name,
    chatbotId,
  }: CreateChatroomDto): Promise<CreateChatRoomRes> {
    // Get chatbot
    // Improve the query to a lighter transport

    const chatbot = await axios.get(
      this.configService.get<string>('COMMS_SERVICE') +
        '/chatbots/' +
        chatbotId,
    );
    if (!chatbot.data) {
      throw new BadRequestException('Chatbot not found');
    }

    // Create chatroom

    const chatroom = await this.chatroomRepo.create({
      chatbotId,
      senderEmail: email,
      sendName: name,
    });

    // Create sessionKey
    const sessionKey = sign(
      {
        chatbotId,
        email,
        chatroomId: chatroom._id,
      },
      chatbotId + chatbot.data.chatbotKey,
    );
    return { sessionKey, chatroom };
  }
}
