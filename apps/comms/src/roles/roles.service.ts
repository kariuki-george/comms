import { DBService } from '@db';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AssignRoleDto } from './dto/index.dto';

// TODO: WORK ON ROLES
@Injectable()
export class RolesService {
  constructor(private readonly dbService: DBService) {}

  //   async ssignRole({ roleId, userId }: AssignRoleDto): Promise<boolean> {
  //     // Find user roles
  //     const userRole = await this.dbService.userRole.findFirst({
  //       where: { userId },
  //     });
  //   }
}
