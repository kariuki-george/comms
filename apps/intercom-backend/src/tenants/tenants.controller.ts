import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTenantDto } from './dtos/index.dtos';
import { TenantsService } from './tenants.service';

@Controller('tenants')
@ApiTags('Tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}
  @Post()
  @ApiBadRequestResponse({
    description: 'An email and name must be provided',
  })
  @ApiCreatedResponse({
    description: 'Tenant created successfully',
  })
  async createTenant(@Body() createTenantInput: CreateTenantDto) {
    await this.tenantsService.createTenant(createTenantInput);
  }
}
