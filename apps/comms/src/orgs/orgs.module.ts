import { Module } from '@nestjs/common';
import { OrgsService } from './orgs.service';
import { OrgsController } from './orgs.controller';

@Module({
  controllers: [OrgsController],
  providers: [OrgsService]
})
export class OrgsModule {}
