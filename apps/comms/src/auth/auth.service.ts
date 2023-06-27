import { DBService } from '@db';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dtos/index.dto';
import { verify } from 'argon2';
import { sign, verify as jwtVerify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { UserRes } from 'src/users/res';

export interface LoginRes {
  user: UserRes;
  authJWT: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly dbService: DBService,
    private readonly configService: ConfigService,
  ) {}

  async login({ email, password }: LoginDto): Promise<LoginRes> {
    const user = await this.dbService.user.findUnique({ where: { email } });

    if (!user)
      throw new NotFoundException('User with the provided email not found');

    const isValid = await verify(user.password, password);

    if (!isValid) {
      throw new UnauthorizedException('Provided password is not valid');
    }

    // Create login tokens
    const authJWT = sign(
      {
        createdAt: user.createdAt,
        email: user.email,
        id: user.id,
        name: user.name,
      },
      this.configService.get<string>('JWTSECRET'),
    );

    return {
      authJWT,
      user: {
        createdAt: user.createdAt,
        email: user.email,
        id: user.id,
        name: user.name,
      },
    };
  }

  verifyWithJwt(token: string) {
    return jwtVerify(token, this.configService.get<string>('JWTSECRET'));
  }
}
