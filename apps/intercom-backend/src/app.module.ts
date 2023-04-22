import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatbotsModule } from './chatbots/chatbots.module';
import { TenantsModule } from './tenants/tenants.module';
import { AccountsModule } from './accounts/accounts.module';
import { ConfigModule } from '@lib/config';
import { DatabaseModule } from '@lib/databases';

@Module({
  imports: [
    ConfigModule,
    ChatbotsModule,
    TenantsModule,
    AccountsModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
