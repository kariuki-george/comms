import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { RolesRepo } from './roles.repo';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RolesSchema } from './entities/role.entity';

@Module({
  controllers: [RolesController],
  providers: [RolesService, RolesRepo],
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RolesSchema }]),
  ],
  exports: [RolesService],
})
export class RolesModule {}
