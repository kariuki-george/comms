import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChatbotDto } from './dtos/index.dto';
import { DBService } from '@db';
import { randomUUID } from 'node:crypto';
import { CreateChatbotRes } from './res/index.res';
import { Chatbot } from '@prisma/client';

@Injectable()
export class ChatbotsService {
  constructor(private readonly dbService: DBService) {}
  async createChatbot({
    name,
    orgId,
  }: CreateChatbotDto): Promise<CreateChatbotRes> {
    // Validate name uniqueness as per org
    const chatbotname = await this.dbService.chatbot.findFirst({
      where: { AND: { orgId, name } },
    });
    if (chatbotname)
      throw new BadRequestException(
        'Chatbot with the provided name already exists',
      );

    //   Create chatbot key with api

    try {
      // Perform chatbotKey validation
      return await this.dbService.chatbot.create({
        data: { chatbotKey: randomUUID(), name, orgId },
      });
    } catch (error) {
      if (error.code === 'P2003') {
        throw new BadRequestException('The provided orgId is invalid');
      }
      return error;
    }
  }

  findOne(chatbotKey: string): Promise<Chatbot> {
    return this.dbService.chatbot.findFirst({ where: { chatbotKey } });
  }

  findAll(orgId: number): Promise<Chatbot[]> {
    return this.dbService.chatbot.findMany({ where: { orgId } });
  }

  deleteChatbot(chatbotId: number) {
    return this.dbService.chatbot.delete({ where: { id: chatbotId } });
  }
}
