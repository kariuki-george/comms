import {
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export default class Config {
  @IsString()
  MONGODB_URI: string;
  @IsNumber()
  @IsInt()
  @IsPositive()
  INTERCOM_PORT: number;

  @IsString()
  KAFKA_URI: string;
  @IsString()
  @IsStrongPassword({ minLength: 20 })
  JWT_SECRET: string;
}
