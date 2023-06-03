import { IsString } from 'class-validator';

export class CreateOrgDto {
  @IsString()
  name: string;
}
