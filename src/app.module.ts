import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatbotsModule } from './chatbots/chatbots.module';
import { TenantsModule } from './tenants/tenants.module';
import { ConfigModule } from '@lib/config';
import { DatabaseModule } from '@lib/databases';
import { KafkaModule } from '@lib/providers/kafka/kafka.module';
import { AuthModule } from './auth/auth.module';
import { ChatroomsModule } from './chatrooms/chatrooms.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RolesModule } from './roles/roles.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule,
    ChatbotsModule,
    TenantsModule,
    DatabaseModule,
    KafkaModule,
    AuthModule,
    ChatroomsModule,
    NotificationsModule,
    RolesModule,
    CacheModule.register({isGlobal:true}),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
