import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesRepo } from './roles.repo';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(private readonly rolesRepo: RolesRepo) {}

  create({ name }: CreateRoleDto): Promise<Role> {
    return this.rolesRepo.create({ name });
  }

  findAll(): Promise<Role[]> {
    return this.rolesRepo.find({});
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.rolesRepo.findOne({ _id: id });
    if (role) return role;
    throw new NotFoundException('Role not found');
  }

  update(id: string, { name }: UpdateRoleDto): Promise<Role> {
    return this.rolesRepo.findOneAndUpdate({ _id: id }, { $set: { name } });
  }

  async remove(id: string): Promise<boolean> {
    await this.rolesRepo.findAndDelete(id);
    return true;
  }
}
