import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssociationsModule } from '../associations/associations.module';
import { UsersModule } from '../users/users.module';
import { Role } from './role.entity';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role]), UsersModule, AssociationsModule],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
