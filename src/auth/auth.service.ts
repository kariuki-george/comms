import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { LoginDto } from './dtos/index.dtos';
import { TenantsService } from 'src/tenants/tenants.service';
import { Tenant } from 'src/tenants/models/tenant.model';
import argon from 'argon2';
import crypto from 'node:crypto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import jwt from 'jsonwebtoken';
import Config from '@lib/config/config';

interface LoginRes {
  tenant: Tenant;
  authToken: string;
  refreshToken: string;
}
@Injectable()
export class AuthService {
  constructor(
    private readonly tenantsService: TenantsService,

    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: Config,
  ) {}
  async login(input: LoginDto): Promise<LoginRes> {
    let tenant = await this.tenantsService.findOne({ email: input.email });
    // Check password
    const isValid = argon.verify(tenant.password, input.password);
    if (!isValid) {
      throw new BadRequestException('Wrong email or password');
    }
    // Validate user
    // Create auth token and refreshToken
    // Might check performance implications
    // https://github.com/ai/nanoid
    let authToken = crypto.randomBytes(16).toString('hex');
    let newRefreshToken = crypto.randomBytes(16).toString('hex');

    // Save refreshToken and update user signing time
    tenant = await this.tenantsService.updateOne(tenant._id.toString(), {
      lastSignIn: new Date(),
      refreshToken: newRefreshToken,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, refreshToken, ...cleanedTenant } = tenant;

    // cache the token in session

    await this.cacheManager.set(authToken, cleanedTenant);

    // Encode them using jwt to prevent spamming
    // Check on jwt options
    authToken = jwt.sign(authToken, this.configService.JWT_SECRET);
    newRefreshToken = jwt.sign(newRefreshToken, this.configService.JWT_SECRET);

    return { tenant: cleanedTenant, authToken, refreshToken };
  }

  refreshToken(refreshTokenJwt: string) {
    // Decode the jwt
    // const refreshToken = jwt.verify(
    //   refreshTokenJwt,
    //   this.configService.JWT_SECRET,
    // );
    // Get user
    console.log(refreshTokenJwt);
  }
}
