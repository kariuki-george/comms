import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ConfirmTenantDto, CreateTenantDto } from './dtos/index.dtos';
import { TenantsService } from './tenants.service';
import { Tenant } from './models/tenant.model';
import { USER_ALREADY_EXISTS } from '@lib/errors';

@Controller('tenants')
@ApiTags('Tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}
  @Post()
  @ApiBadRequestResponse({
    description: 'An email and name must be provided',
  })
  @ApiCreatedResponse({
    description:
      'Tenant created successfully. A magic link will be sent to the tenant email for verification',
  })
  @ApiConflictResponse({
    description: USER_ALREADY_EXISTS,
  })
  createTenant(@Body() createTenantInput: CreateTenantDto): Promise<Tenant> {
    return this.tenantsService.createTenant(createTenantInput);
  }

  @Post('/confirm-email')
  @ApiOkResponse({
    description: "Tenant's email successfully confirmed",
  })
  @ApiBadRequestResponse({
    description: 'Email or Token is invalid',
  })
  @ApiNotFoundResponse({
    description: 'Provided email not found',
  })
  confirmTenant(@Body() confirmTenant: ConfirmTenantDto): Promise<Tenant> {
    return this.tenantsService.confirmTenant(confirmTenant);
  }

  @Post('/login-link')
  @ApiOkResponse({
    description: 'Magic link sent to email',
  })
  @ApiNotFoundResponse({
    description: 'Provided email not found',
  })
  @ApiOperation({
    description:
      'This operation requests a magic link with a token for tenant login',
  })
  tenantLogin(@Body() email: string): Promise<boolean> {
    return this.tenantsService.tenantLogin(email);
  }
}
