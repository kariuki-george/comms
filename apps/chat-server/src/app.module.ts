import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatroomModule } from './chatroom/chatroom.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'db/db';
import { WsModule } from 'ws/ws';
import { RedisModule } from 'redis/redis';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ChatroomModule,
    DatabaseModule,
    WsModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
