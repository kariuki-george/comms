import { Global, Module } from '@nestjs/common';
import { DBService } from './database.service';

@Global()
@Module({
  providers: [DBService],
  exports: [DBService],
})
export class DatabaseModule {}
