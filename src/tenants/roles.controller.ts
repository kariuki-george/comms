import { Body, Controller, Post } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { AssignRoleDto, DenyRoleDto } from './dtos/index.dtos';
import { ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';

@Controller('tenants/roles')
export class RolesController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  @ApiOkResponse({
    description: 'Denied role successfully',
  })
  @ApiNotFoundResponse({ description: 'Role not found' })
  denyRole(@Body() input: DenyRoleDto): Promise<boolean> {
    return this.tenantsService.denyRole(input);
  }
  @Post()
  @ApiOkResponse({
    description: 'Assigned role successfully',
  })
  @ApiNotFoundResponse({ description: 'Role not found' })
  assignRole(@Body() input: AssignRoleDto): Promise<boolean> {
    return this.tenantsService.assignRole(input);
  }
}
