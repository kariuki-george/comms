import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TenantsModule } from 'src/tenants/tenants.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [TenantsModule],
})
export class AuthModule {}
