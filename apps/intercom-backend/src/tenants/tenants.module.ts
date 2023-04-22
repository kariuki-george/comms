import { Module } from '@nestjs/common';
import { TenantsController } from './tenants.controller';
import { TenantsService } from './tenants.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Tenant, TenantSchema } from './models/tenant.model';
import { TenantsRepo } from './tenants.repo';

@Module({
  controllers: [TenantsController],
  providers: [TenantsService, TenantsRepo],
  imports: [
    MongooseModule.forFeature([{ name: Tenant.name, schema: TenantSchema }]),
  ],
})
export class TenantsModule {}
