import { Injectable } from '@nestjs/common';
import { CreateTenantDto } from './dtos/index.dtos';

@Injectable()
export class TenantsService {
  async createTenant(input: CreateTenantDto) {
    console.log(input);
  }
}
