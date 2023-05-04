import Config from '@lib/config/config';
import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: Config) => ({
        uri: configService.MONGODB_URI,
      }),
      inject: [Config],
    }),
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
