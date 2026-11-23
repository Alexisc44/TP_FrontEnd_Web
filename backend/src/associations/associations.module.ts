import { Module } from '@nestjs/common';
import { AssociationsService } from './associations.service';
import { AssociationsController } from './associations.controller';
import { UsersModule } from '../users/users.module';
import { Association } from './association.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../role/role.entity';
import { Minute } from '../minutes/minute.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Association, Role, Minute]), UsersModule],
  providers: [AssociationsService],
  controllers: [AssociationsController],
  exports: [AssociationsService]
})
export class AssociationsModule {}
