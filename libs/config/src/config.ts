import { IsInt, IsNumber, IsPositive, IsString } from 'class-validator';

export default class Config {
  @IsString()
  MONGODB_URI: string;
  @IsNumber()
  @IsInt()
  @IsPositive()
  INTERCOM_PORT: number;
}
