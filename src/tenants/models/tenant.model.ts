import { AbstractDocument } from '@lib/databases/abstract.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ versionKey: false, timestamps: true })
export class Tenant extends AbstractDocument {
  @Prop({ unique: true })
  @ApiProperty()
  email: string;
  @Prop()
  @ApiProperty()
  name: string;
  @Prop()
  @ApiProperty({ isArray: true })
  roles?: string[];

  @ApiProperty()
  @Prop()
  createdAt?: Date;
  @ApiProperty()
  @Prop()
  updatedAt?: Date;
  @ApiProperty()
  @Prop()
  lastSignIn?: Date;
  @Prop()
  refreshToken?: string;
  @Prop()
  password?: string;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);
