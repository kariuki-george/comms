import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatbotsModule } from './chatbots/chatbots.module';

@Module({
  imports: [ChatbotsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
