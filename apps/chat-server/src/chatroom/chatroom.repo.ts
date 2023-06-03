import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from 'db/db/abstract.repo';
import { Chatroom } from './models/chatroom.model';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

@Injectable()
export class ChatroomRepo extends AbstractRepository<Chatroom> {
  protected readonly logger = new Logger(ChatroomRepo.name);

  constructor(
    @InjectModel(Chatroom.name) chatRoomModel: Model<Chatroom>,
    @InjectConnection() connection: Connection,
  ) {
    super(chatRoomModel, connection);
  }
}
