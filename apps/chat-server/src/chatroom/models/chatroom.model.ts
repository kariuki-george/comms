import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from 'db/db/abstract.schema';

@Schema()
export class Message {
  @Prop()
  message: string;
  @Prop()
  sender: string;
}

@Schema()
export class Chatroom extends AbstractDocument {
  @Prop()
  chatbotId: number;
  @Prop({ type: Message })
  messages?: Message[];
  @Prop()
  senderEmail: string;
  @Prop()
  sendName: string;
  @Prop()
  agentEmail?: string;
  @Prop()
  agentId?: number;
}

export const ChatroomSchema = SchemaFactory.createForClass(Chatroom);
