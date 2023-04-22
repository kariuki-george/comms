import { AbstractDocument } from '@lib/databases/abstract.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ versionKey: false })
export class Tenant extends AbstractDocument {
  @Prop()
  @ApiProperty()
  email: string;
  @Prop()
  @ApiProperty()
  name: string;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);
