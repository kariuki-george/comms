import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AssignRoleDto, CreateTenantDto, DenyRoleDto } from './dtos/index.dtos';
import { TenantsRepo } from './tenants.repo';
import { USER_ALREADY_EXISTS } from '@lib/errors';
import { Tenant } from './models/tenant.model';
import { EventsService } from '@lib/providers/kafka/events.service';
import { TENANTS_CREATE } from '@lib/providers/kafka/events';
import argon from 'argon2';
import { RolesService } from 'src/roles/roles.service';

// NOTE: HANDLE SENSITIVE FIELDS WITH CARE

@Injectable()
export class TenantsService {
  constructor(
    private readonly tenantsRepo: TenantsRepo,
    private readonly eventsService: EventsService,
    private readonly rolesService: RolesService,
  ) {}

  async createTenant({
    email,
    name,
    password,
  }: CreateTenantDto): Promise<Tenant> {
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
      password: await argon.hash(password),
    });

    // Handle account confirmation
    // Send a magic link

    await this.eventsService.publishEvent(
      {
        email,
        name,
      },
      TENANTS_CREATE,
    );

    return tenant;
  }

  async createSuperTenant({
    email,
    name,
    password,
  }: CreateTenantDto): Promise<Tenant> {
    const roles = await this.rolesService.findAll();
    return this.tenantsRepo.create({
      name,
      email,
      password: await argon.hash(password),
      roles: roles.map((role) => role._id.toString()),
    });
  }

  async getTenant(id: string): Promise<Tenant> {
    const tenant = await this.tenantsRepo.findOne({ _id: id });
    if (tenant) return tenant;
    throw new NotFoundException('Tenant not found');
  }

  async denyRole(input: DenyRoleDto): Promise<boolean> {
    // validate role
    await this.rolesService.findOne(input.roleId);

    await this.tenantsRepo.findOneAndUpdate(
      { _id: input.tenantId },
      { $unset: { roles: input.roleId } },
    );
    return true;
  }
  async assignRole(input: AssignRoleDto): Promise<boolean> {
    // validate role
    await this.rolesService.findOne(input.roleId);

    await this.tenantsRepo.findOneAndUpdate(
      { _id: input.tenantId },
      { $set: { roles: input.roleId } },
    );
    return true;
  }

  async findOne({ email, _id }: Partial<Tenant>) {
    if (!email && !_id) {
      throw new BadRequestException('Query user by email or id');
    }
    return this.tenantsRepo.findOne({ $or: [{ email }, , { _id }] });
  }

  async updateOne(id: string, update: Partial<Tenant>): Promise<Tenant> {
    return this.tenantsRepo.findOneAndUpdate({ _id: id }, { $set: update });
  }

  // Can be improved when email  is available
  // async confirmTenant({
  //   email,
  //   tenantConfirmToken,
  // }: ConfirmTenantDto): Promise<Tenant> {
  //   const tenant = await this.tenantsRepo.findOne(
  //     { email },
  //     { tenantConfirmAccountToken: true },
  //   );

  //   if (!tenant) {
  //     throw new NotFoundException(EMAIL_NOT_FOUND);
  //   }

  //   if (tenant.tenantConfirmAccountToken !== tenantConfirmToken) {
  //     throw new BadRequestException(TOKEN_MISMATCH);
  //   }

  //   return this.tenantsRepo.findOneAndUpdate(
  //     { email },
  //     { $set: { emailVerified: true, tenantConfirmAccountToken: null } },
  //     { emailVerified: true, email: true, name: true },
  //   );
  // }
}
