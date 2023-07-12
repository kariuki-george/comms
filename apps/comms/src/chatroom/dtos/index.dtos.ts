import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateChatroomDto {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  name: string;
  @IsInt()
  chatbotId: number;
  @IsString()
  ipaddress: string;
}

export class MessageDto {
  @IsString()
  message: string;
  @IsInt()
  chatroomId: number;
}

export class CloseChatroomDto {
  @IsInt()
  chatroomId: number;
}
