import { Module } from '@nestjs/common';
import { TenantsController } from './tenants.controller';
import { TenantsService } from './tenants.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Tenant, TenantSchema } from './models/tenant.model';
import { TenantsRepo } from './tenants.repo';
import { RolesModule } from 'src/roles/roles.module';
import { RolesController } from './roles.controller';

@Module({
  controllers: [TenantsController, RolesController],
  providers: [TenantsService, TenantsRepo],
  imports: [
    MongooseModule.forFeature([{ name: Tenant.name, schema: TenantSchema }]),
    RolesModule,
  ],
  exports: [TenantsService],
})
export class TenantsModule {}
