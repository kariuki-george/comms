import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  IsUUID,
} from 'class-validator';

export class CreateTenantDto {
  @ApiProperty()
  @IsEmail()
  email: string;
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsStrongPassword({ minLength: 8 })
  password: string;
}

export class ConfirmTenantDto {
  @ApiProperty()
  @IsEmail()
  email: string;
  @IsString()
  @IsUUID()
  tenantConfirmToken: string;
}

export class AssignRoleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tenantId: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  roleId: string;
}

export class DenyRoleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tenantId: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  roleId: string;
}
