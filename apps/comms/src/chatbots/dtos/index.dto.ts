import { IsString, IsInt } from 'class-validator';

export class CreateChatbotDto {
  @IsString()
  name: string;
  @IsInt()
  orgId: number;
}
