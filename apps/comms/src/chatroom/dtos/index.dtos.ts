import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateChatroomDto {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  name: string;
  @IsInt()
  chatbotId: number;
}
enum Sender {
  AGENT = 'AGENT',
  USER = 'USER',
}

export class MessageDto {
  @IsEnum(Sender)
  sender: Sender;
  @IsString()
  message: string;
  @IsInt()
  chatroomId: number;
}
