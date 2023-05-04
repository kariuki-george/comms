import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LoginDto } from './dtos/index.dtos';
import * as argon from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import * as jwt from 'jsonwebtoken';
import Config from '@lib/config/config';
import { User } from 'src/users/entities/user.entity';
import { PrismaService } from '@lib/databases/prisma.service';

interface LoginRes {
  user: User;
  authToken: string;
  refreshToken: string;
}
@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: Config,
  ) {}
  async login(input: LoginDto): Promise<LoginRes> {
    const user = await this.prismaService.user.findUnique({
      where: { email: input.email },
    });
    if (!user) {
      throw new NotFoundException('User with the provided email not found');
    }
    // Check password
    const isValid = argon.verify(user.password, input.password);
    if (!isValid) {
      throw new BadRequestException('Wrong email or password');
    }
    const { authToken, newRefreshToken, cleaneduser } =
      await this.createAndSaveNewTokens(user.id);

    return { user: cleaneduser, authToken, refreshToken: newRefreshToken };
  }

  private async createAndSaveNewTokens(userId: number) {
    // Validate user
    // Create auth token and refreshToken
    // Might check performance implications
    // https://github.com/ai/nanoid
    // Create new tokens

    let authToken = uuidv4();
    let newRefreshToken = uuidv4();
    // Save refreshToken and update user signing time
    const user = await this.prismaService.user.update({
      where: { id: userId },
      data: {
        refreshToken: newRefreshToken,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, refreshToken, ...cleaneduser } = user;

    // Encode them using jwt to prevent spamming
    // Check on jwt options
    authToken = jwt.sign(
      JSON.stringify({ authToken, user: cleaneduser }),
      this.configService.JWT_SECRET,
    );
    newRefreshToken = jwt.sign(
      JSON.stringify({ refreshToken: newRefreshToken, user: cleaneduser }),
      this.configService.JWT_SECRET,
    );
    return { authToken, newRefreshToken, cleaneduser };
  }

  async refreshToken(refreshTokenJwt: string) {
    // Decode the jwt
    let data: { user: User; refreshToken: string };
    try {
      const decodedRefreshToken = jwt.verify(
        refreshTokenJwt,
        this.configService.JWT_SECRET,
      );

      data = JSON.parse(decodedRefreshToken as string);
    } catch (error) {
      throw new BadRequestException('RefreshToken not valid');
    }

    // Get user
    const user = await this.prismaService.user.findUnique({
      where: { id: data.user.id },
    });

    if (!user) {
      throw new BadRequestException('Invalid refreshToken');
    }

    if (user.refreshToken != data.refreshToken) {
      throw new BadRequestException('Expired refreshToken');
    }

    const { authToken, newRefreshToken, cleaneduser } =
      await this.createAndSaveNewTokens(user.id);

    return { user: cleaneduser, authToken, refreshToken: newRefreshToken };
  }
}
