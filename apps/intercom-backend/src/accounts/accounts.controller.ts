import { Body, Controller, Post } from '@nestjs/common';
import { CreateAccountDto } from './dtos/index.dtos';
import { ApiBadRequestResponse, ApiTags } from '@nestjs/swagger';
import { AccountsService } from './accounts.service';

@Controller('accounts')
@ApiTags('Accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}
  @Post()
  @ApiBadRequestResponse({
    description: 'Name should be a string and should not be empty',
  })
  createAccount(@Body() body: CreateAccountDto) {
    return true;
  }
}
