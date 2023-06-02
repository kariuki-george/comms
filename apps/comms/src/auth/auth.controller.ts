import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRes } from 'src/users/res';
import { LoginDto } from './dtos/index.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() input: LoginDto, @Res() response): Promise<UserRes> {
    const { authJWT, user } = await this.authService.login(input);
    response.cookie('aid', authJWT, {
      maxAge: 1000 * 60 * 15, // would expire after 15 minutes
      httpOnly: true,
    });

    return response.json(user);
  }
}
