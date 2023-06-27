import { Body, Controller, Post } from '@nestjs/common';
import { AuthService, LoginRes } from './auth.service';
import { LoginDto } from './dtos/index.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() input: LoginDto): Promise<LoginRes> {
    return this.authService.login(input);
  }
}
