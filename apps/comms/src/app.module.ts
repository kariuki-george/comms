import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { ChatbotsModule } from './chatbots/chatbots.module';
import { OrgsModule } from './orgs/orgs.module';
import { ChatroomModule } from './chatroom/chatroom.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@db';
import { WsModule } from '@ws';
import { RedisModule } from '@redis';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    RolesModule,
    ChatbotsModule,
    OrgsModule,
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
