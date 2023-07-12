import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ApiHeader, ApiHideProperty, ApiTags } from '@nestjs/swagger';

@Controller('roles')
@ApiTags('Roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiHeader({
    name: 'aid',
    allowEmptyValue: false,

    required: true,
  })
  @ApiHideProperty()
  assignRole(@Req() req) {
    console.log(req);
    return 'hi';
  }
}
