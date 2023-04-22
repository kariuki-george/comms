import { Module } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  providers: [ProvidersService],
  exports: [ProvidersService],
  imports: [KafkaModule],
})
export class ProvidersModule {}
