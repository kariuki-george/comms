import { PrismaService } from '@lib/databases/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/index.dtos';
import * as argon from 'argon2';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(data: CreateUserDto): Promise<User> {
    // Check if user already exists
    const user = await this.prismaService.user.findUnique({
      where: { email: data.email },
    });
    if (user) {
      throw new BadRequestException(
        'User with the provided details already exists',
      );
    }

    // Hash the password
    const hash = await argon.hash(data.password);

    return this.prismaService.user.create({
      data: { ...data, password: hash },
      select: {
        email: true,
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  findOne({ email, id }: Partial<User>) {
    if (!email && !id) {
      throw new BadRequestException('Query user by email or id');
    }
    if (email) {
      return this.prismaService.user.findUnique({ where: { email } });
    }
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }

  updateOne(userId: number, details: Partial<User>): Promise<User> {
    return this.prismaService.user.update({
      data: details,
      where: { id: userId },
    });
  }
}
