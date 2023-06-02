import { IsEmail, IsStrongPassword } from 'class-validator';

export class LoginDto {
  @IsStrongPassword()
  password: string;
  @IsEmail()
  email: string;
}
