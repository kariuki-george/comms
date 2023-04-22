import { AbstractRepository } from '@lib/databases/abstract.repo';
import { Injectable, Logger } from '@nestjs/common';
import { Tenant } from './models/tenant.model';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

@Injectable()
export class TenantsRepo extends AbstractRepository<Tenant> {
  protected readonly logger = new Logger(TenantsRepo.name);
  constructor(
    @InjectModel(Tenant.name) tenantModel: Model<Tenant>,
    @InjectConnection() connection: Connection,
  ) {
    super(tenantModel, connection);
  }
}
