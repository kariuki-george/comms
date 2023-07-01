import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { OrgsService } from './orgs.service';
import { CreateOrgDto } from './dtos/index.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('orgs')
export class OrgsController {
  constructor(private readonly orgsService: OrgsService) {}

  @Post()
  @UseGuards(AuthGuard)
  createOrg(@Body() input: CreateOrgDto, @Req() req) {
    return this.orgsService.createOrg(input, req.user.id);
  }

  @Get()
  @UseGuards(AuthGuard)
  getByUserId(@Req() req) {
    return this.orgsService.getByUserId(req.user.id);
  }
}
