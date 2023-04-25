import { AbstractDocument } from '@lib/databases/abstract.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ versionKey: false })
export class Role extends AbstractDocument {
  @Prop()
  @ApiProperty()
  name: string;
}

export const RolesSchema = SchemaFactory.createForClass(Role);
