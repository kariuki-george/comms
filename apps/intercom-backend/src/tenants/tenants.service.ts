import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfirmTenantDto, CreateTenantDto } from './dtos/index.dtos';
import { TenantsRepo } from './tenants.repo';
import {
  EMAIL_NOT_FOUND,
  USER_ALREADY_EXISTS,
  TOKEN_MISMATCH,
} from '@lib/errors';
import { Tenant } from './models/tenant.model';
import { EventsService } from '@lib/providers/kafka/events.service';
import { AUTH_MAGIC_LINK, TENANTS_CREATE } from '@lib/providers/kafka/events';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class TenantsService {
  constructor(
    private readonly tenantsRepo: TenantsRepo,
    private readonly eventsService: EventsService,
  ) {}

  async createTenant({ email, name }: CreateTenantDto): Promise<Tenant> {
    // Check if the tenant exists
    let tenant = await this.tenantsRepo.findOne({ email });
    if (tenant) {
      throw new ConflictException(USER_ALREADY_EXISTS);
    }
    // Create a new tenant
    // Create a token for email confirmation

    tenant = await this.tenantsRepo.create({
      email,
      name,
      tenantConfirmAccountToken: uuidv4(),
    });

    // Handle account confirmation
    // Send a magic link

    await this.eventsService.publishEvent(
      {
        email,
        name,
        tenantConfirmAccountToken: tenant.tenantConfirmAccountToken,
      },
      TENANTS_CREATE,
    );

    return tenant;
  }

  async confirmTenant({
    email,
    tenantConfirmToken,
  }: ConfirmTenantDto): Promise<Tenant> {
    const tenant = await this.tenantsRepo.findOne(
      { email },
      { tenantConfirmAccountToken: true },
    );

    if (!tenant) {
      throw new NotFoundException(EMAIL_NOT_FOUND);
    }

    if (tenant.tenantConfirmAccountToken !== tenantConfirmToken) {
      throw new BadRequestException(TOKEN_MISMATCH);
    }

    return this.tenantsRepo.findOneAndUpdate(
      { email },
      { $set: { emailVerified: true, tenantConfirmAccountToken: null } },
      { emailVerified: true, email: true, name: true },
    );
  }

  async tenantLogin(email: string): Promise<boolean> {
    const tenant = await this.tenantsRepo.findOne({ email });
    if (!tenant) {
      throw new NotFoundException(EMAIL_NOT_FOUND);
    }

    const loginToken = uuidv4();
    await this.tenantsRepo.findOneAndUpdate(
      { email },
      {
        $set: {
          loginToken,
        },
      },
    );
    await this.eventsService.publishEvent(
      { email, loginToken },
      AUTH_MAGIC_LINK,
    );
    return true;
  }
}
