import { AbstractRepository } from '@lib/databases/abstract.repo';
import { Injectable, Logger } from '@nestjs/common';
import { Role } from './entities/role.entity';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RolesRepo extends AbstractRepository<Role> {
  protected readonly logger = new Logger(RolesRepo.name);
  constructor(
    @InjectModel(Role.name) roleModel: Model<Role>,
    @InjectConnection() connection: Connection,
  ) {
    super(roleModel, connection);
  }
}
