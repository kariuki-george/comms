import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChatbotDto } from './dtos/index.dto';
import { DBService } from '@db/database';
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

    return this.dbService.chatbot.create({
      data: { chatbotKey: randomUUID(), name, orgId },
      select: {
        id: true,
        name: true,
        orgId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  findOne(chatbotId: number): Promise<Chatbot> {
    return this.dbService.chatbot.findUnique({ where: { id: chatbotId } });
  }
}
