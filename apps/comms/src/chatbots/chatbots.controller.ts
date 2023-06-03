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

  @Get(':chatbotId')
  getChatBot(@Param('chatbotId') chatbotId: string) {
    // TODO: Handle auth to prevent exposing hidden fields
    if (!Number(chatbotId)) {
      throw new BadRequestException('Invalid chatbotId');
    }
    return this.chatbotsService.findOne(Number(chatbotId));
  }
}
