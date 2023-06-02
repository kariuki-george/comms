import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/index.dto';
import { UserRes } from './res';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserInput: CreateUserDto): Promise<UserRes> {
    const { createdAt, email, id, name } = await this.usersService.createUser(
      createUserInput,
    );
    return { createdAt, email, id, name };
  }
}
