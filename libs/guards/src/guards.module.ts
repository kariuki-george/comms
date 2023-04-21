import { Module } from '@nestjs/common';
import { GuardsService } from './guards.service';

@Module({
  providers: [GuardsService],
  exports: [GuardsService],
})
export class GuardsModule {}
