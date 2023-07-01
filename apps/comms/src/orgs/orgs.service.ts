import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrgDto } from './dtos/index.dto';
import { DBService } from '@db';
import { Org } from '@prisma/client';

@Injectable()
export class OrgsService {
  constructor(private readonly dbService: DBService) {}
  async createOrg({ name }: CreateOrgDto, userId: number): Promise<Org> {
    // Check name uniques
    const orgName = await this.dbService.org.findFirst({ where: { name } });
    if (orgName) {
      throw new BadRequestException(
        'Org with the provided name already exists',
      );
    }

    const roles = await this.dbService.role.findMany();

    const rolesJSon = {};
    roles.map((role) => (rolesJSon[role.name] = role));

    return this.dbService.org.create({
      data: { name, UserRole: { create: { roles: rolesJSon, userId } } },
    });
  }

  // Might require a better db model

  getByUserId(userId: number) {
    return this.dbService.userRole.findMany({
      where: { userId },
      select: {
        Org: {
          select: { name: true, id: true, createdAt: true, updatedAt: true },
        },
      },
    });
  }
}
