import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/index.dtos';
import { Response, Request } from 'express';
import { User } from 'src/users/entities/user.entity';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiBadRequestResponse({ description: 'Bad email or password' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiOkResponse({
    description: 'Login successfully. Sets the needed cookies',
    type: User,
  })
  async login(
    @Res() response: Response,
    @Body() input: LoginDto,
  ): Promise<User> {
    const authDetails = await this.authService.login(input);
    // 2 days
    response.cookie('rid', authDetails.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
    });
    // 10 hours
    response.cookie('aid', authDetails.authToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 10),
    });

    response.status(200).json(authDetails.user);
    return;
  }

  @Get('refreshToken')
  @ApiOkResponse({ description: 'Refreshed the auth tokens' })
  @ApiBadRequestResponse({ description: 'Refreshing tokens failed' })
  async refreshTokens(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<User> {
    const rid = request.cookies.rid;

    const authDetails = await this.authService.refreshToken(rid);

    response.cookie('rid', authDetails.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
    });
    // 10 hours
    response.cookie('aid', authDetails.authToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 10),
    });
    response.status(200).json(authDetails.user);
    return;
  }
}
