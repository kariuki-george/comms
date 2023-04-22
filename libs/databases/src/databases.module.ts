import Config from '@lib/config/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: Config) => ({
        uri: configService.MONGODB_URI,
      }),
      inject: [Config],
    }),
  ],
})
export class DatabaseModule {}
