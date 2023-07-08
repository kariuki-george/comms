import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsString,
} from 'class-validator';

export class CreateChatroomDto {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  name: string;
  @IsInt()
  chatbotId: number;
  @IsObject()
  country: object;
}

export class MessageDto {
  @IsString()
  message: string;
  @IsInt()
  chatroomId: number;
}
