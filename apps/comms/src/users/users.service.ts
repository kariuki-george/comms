import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/index.dto';
import { DBService } from '@db/database';
import { hash } from 'argon2';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DBService) {}
  async createUser({ email, name, password }: CreateUserDto): Promise<User> {
    // Check if user exists
    const userEmail = await this.dbService.user.findUnique({
      where: { email },
      select: { email: true },
    });
    if (userEmail) {
      throw new BadRequestException(
        'User with the provided email already exists',
      );
    }

    return this.dbService.user.create({
      data: { email, name, password: await hash(password) },
    });
  }
}
