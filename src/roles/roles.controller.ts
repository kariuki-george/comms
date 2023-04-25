import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from './entities/role.entity';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiResponse({
    type: Role,
  })
  @ApiCreatedResponse({ description: 'Created role successfully' })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @ApiResponse({
    type: Role,
    isArray: true,
  })
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    type: Role,
  })
  @ApiNotFoundResponse({ description: 'Role not found' })
  findOne(@Param('id') id: string): Promise<Role> {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({
    type: Role,
  })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Return true for successful deletion' })
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
