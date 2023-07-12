import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/index.dto';
import { UserRes } from './res';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({
    description: 'Created user successfully',
    type: UserRes,
  })
  @ApiBadRequestResponse({
    description:
      'Throws an error when the input DTO is not correct, a user with the provided email already exists ',
  })
  @HttpCode(201)
  async createUser(@Body() createUserInput: CreateUserDto): Promise<UserRes> {
    const { createdAt, email, id, name } = await this.usersService.createUser(
      createUserInput,
    );
    return { createdAt, email, id, name };
  }
}
