import { Body, Controller, Post, UseGuards } from '@nestjs/common';
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
}
