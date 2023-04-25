import { AbstractDocument } from '@lib/databases/abstract.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ versionKey: false })
export class Tenant extends AbstractDocument {
  @Prop({ unique: true })
  @ApiProperty()
  email: string;
  @Prop()
  @ApiProperty()
  name: string;
  @Prop({ select: false })
  @ApiProperty()
  roles?: string[];
  @Prop({ select: false })
  refreshToken?: string;

  @Prop({ select: false })
  ipAddresses?: string[];
  @Prop({ select: false })
  tenantConfirmAccountToken?: string;
  @Prop({ select: false })
  loginToken?: string;

  @Prop({ default: false, select: false })
  emailVerified?: boolean;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);
