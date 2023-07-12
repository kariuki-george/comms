import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrgsService } from './orgs.service';
import { CreateOrgDto } from './dtos/index.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiHeader,
} from '@nestjs/swagger';

@Controller('orgs')
@ApiTags('Orgs')
export class OrgsController {
  constructor(private readonly orgsService: OrgsService) {}

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({
    description: 'Created Org successfully',
  })
  @ApiBadRequestResponse({
    description:
      'Thrown on bad DTO, org with the provided name already existing',
  })
  @UseGuards(AuthGuard)
  @ApiHeader({
    name: 'aid',
    allowEmptyValue: false,

    required: true,
  })
  createOrg(@Body() input: CreateOrgDto, @Req() req) {
    return this.orgsService.createOrg(input, req.user.id);
  }

  @Get()
  @ApiOkResponse({
    description:
      'Returns a list of all orgs a user is subscribed to as an agent or admin',
    isArray: true,
  })
  @UseGuards(AuthGuard)
  @ApiHeader({
    name: 'aid',
    allowEmptyValue: false,

    required: true,
  })
  getByUserId(@Req() req) {
    return this.orgsService.getByUserId(req.user.id);
  }
}
