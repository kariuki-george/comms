import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChatroomDto } from './dtos/index.dtos';
import { ConfigService } from '@nestjs/config';
import { sign } from 'jsonwebtoken';

@Injectable()
export class ChatroomService {
  constructor(private readonly configService: ConfigService) {}

  async createChatRoom({}: CreateChatroomDto) {
    // Get chatbot
    // Improve the query to a lighter transport
  }
}
