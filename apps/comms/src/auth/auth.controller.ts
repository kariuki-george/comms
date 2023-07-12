import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/index.dto';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginRes } from './res/index.res';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOkResponse({
    description: 'Successfully logged In',
    type: LoginRes,
  })
  @ApiBadRequestResponse({ description: 'Error is thrown on incorrect DTO' })
  @ApiNotFoundResponse({ description: 'Thrown when provided email is missing' })
  @ApiUnauthorizedResponse({
    description: 'Thrown when password does not match the provided email',
  })
  login(@Body() input: LoginDto): Promise<LoginRes> {
    return this.authService.login(input);
  }
}
