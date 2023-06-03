import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@db/database';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { RolesModule } from './roles/roles.module';
import { ChatbotsModule } from './chatbots/chatbots.module';
import { OrgsModule } from './orgs/orgs.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
     RolesModule,
     ChatbotsModule,
     OrgsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
