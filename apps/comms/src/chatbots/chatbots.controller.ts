import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ChatbotsService } from './chatbots.service';
import { CreateChatbotDto } from './dtos/index.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('chatbots')
export class ChatbotsController {
  constructor(private readonly chatbotsService: ChatbotsService) {}

  @Post()
  @UseGuards(AuthGuard)
  createChatbot(@Body() input: CreateChatbotDto) {
    return this.chatbotsService.createChatbot(input);
  }

  @Get(':chatbotKey')
  getChatBot(@Param('chatbotKey') chatbotKey: string) {
    // TODO: Handle auth to prevent exposing hidden fields
    if (!chatbotKey) {
      throw new BadRequestException('Invalid chatbotKey');
    }

    return this.chatbotsService.findOne(chatbotKey);
  }

  @Get('org/:orgId')
  @UseGuards(AuthGuard)
  getChatbots(@Param('orgId') orgId: string) {
    if (!Number(orgId)) {
      throw new BadRequestException('OrgId param is not defined');
    }
    return this.chatbotsService.findAll(Number(orgId));
  }
}
