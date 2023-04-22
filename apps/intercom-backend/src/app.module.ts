import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatbotsModule } from './chatbots/chatbots.module';
import { TenantsModule } from './tenants/tenants.module';
import { ConfigModule } from '@lib/config';
import { DatabaseModule } from '@lib/databases';
import { KafkaModule } from '@lib/providers/kafka/kafka.module';
import { AuthModule } from './auth/auth.module';
import { OrganizationsModule } from './organizations/organizations.module';

@Module({
  imports: [
    ConfigModule,
    ChatbotsModule,
    TenantsModule,
    DatabaseModule,
    KafkaModule,
    AuthModule,
    OrganizationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
