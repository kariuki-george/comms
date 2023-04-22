import { Module } from '@nestjs/common';

import { TypedConfigModule, fileLoader } from 'nest-typed-config';
import config from './config';

@Module({
  imports: [
    TypedConfigModule.forRoot({
      schema: config,
      load: fileLoader(),
    }),
  ],
})
export class ConfigModule {}
