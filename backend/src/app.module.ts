import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AssociationsModule } from './associations/associations.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Association } from './associations/association.entity';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './role/roles.module';
import { Role } from './role/role.entity';
import { MinutesModule } from './minutes/minutes.module';
import { Minute } from './minutes/minute.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
    type: 'better-sqlite3',
    database: 'mydatabase.db',
    entities: [User, Association, Role, Minute],
    synchronize: true,
  }), 
  UsersModule, AssociationsModule, RolesModule, AuthModule, MinutesModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}