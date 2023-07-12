import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty()
  name: string;
  /**
   * Password should be strong - contain upper, lower, number and special chars
   * @example ##33AAdd
   */
  @IsStrongPassword()
  password: string;
}
