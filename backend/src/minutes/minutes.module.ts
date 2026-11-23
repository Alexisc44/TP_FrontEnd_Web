import { Module } from '@nestjs/common';
import { MinutesController } from './minutes.controller';
import { MinutesService } from './minutes.service';
import { Minute } from './minute.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssociationsModule } from '../associations/associations.module';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [MinutesController],
  providers: [MinutesService],
  imports: [TypeOrmModule.forFeature([Minute]), UsersModule, AssociationsModule],
})
export class MinutesModule {}
