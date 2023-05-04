import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/index.dtos';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  // Create a user
  @ApiOperation({
    description:
      "Creates a user. The user doesn't need verification for simplicity",
  })
  @ApiCreatedResponse({ description: 'User created successfully', type: User })
  @ApiBadRequestResponse({
    description: 'User with provided details already exists',
  })
  @Post()
  createUser(@Body() input: CreateUserDto): Promise<User> {
    return this.usersService.createUser(input);
  }
}
