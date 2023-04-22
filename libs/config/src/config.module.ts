import { Module } from '@nestjs/common';

import { TypedConfigModule, fileLoader, selectConfig } from 'nest-typed-config';
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

export const outsideNestIOCConfig = selectConfig(
  TypedConfigModule.forRoot({
    schema: config,
    load: fileLoader(),
  }),
  config,
);
