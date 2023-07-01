import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateChatroomDto {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  name: string;
  @IsInt()
  chatbotId: number;
}

export class MessageDto {
  @IsString()
  message: string;
  @IsInt()
  chatroomId: number;
}
