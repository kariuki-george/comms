import { Body, Controller, Post, Res } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Tenant } from 'src/tenants/models/tenant.model';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/index.dtos';
import { Response } from 'express';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiBadRequestResponse({ description: 'Bad email or password' })
  @ApiNotFoundResponse({ description: 'Tenant not found' })
  @ApiOkResponse({
    description: 'Login successfully. Sets the needed cookies',
    type: Tenant,
  })
  async login(
    @Res() response: Response,
    @Body() input: LoginDto,
  ): Promise<Tenant> {
    const authDetails = await this.authService.login(input);

    response.cookie('rid', authDetails.refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 14,
    });
    response.cookie('aid', authDetails.authToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 3,
    });
    return authDetails.tenant;
  }

  // @Post("refreshToken")
  // @ApiOkResponse({description:"Refreshed the auth tokens"})
  // @ApiBadRequestResponse({description:"Refreshing tokens failed"})
  // async refreshTokens(@Body() refreshToken:string):Promise<Tenant>{
  //   return this.authService.refreshToken(refreshToken)
  // }
}
