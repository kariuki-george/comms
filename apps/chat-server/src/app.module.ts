import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatroomModule } from './chatroom/chatroom.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'db/db';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ChatroomModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
