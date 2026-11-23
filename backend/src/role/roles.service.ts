import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { AssociationsService } from '../associations/associations.service';
import { UsersService } from '../users/users.service';
import { Role } from './role.entity';
import { User } from '../users/user.entity';

@Injectable()
export class RolesService {
  constructor(
    private usersService: UsersService,
    private associationsService: AssociationsService,
    @InjectRepository(Role)
    private repository: Repository<Role>,
  ) {}

  async create(name: string, userId: number, associationId: number): Promise<Role> {
    const user = await this.usersService.getById(userId);
    const association = await this.associationsService.getById(associationId);
    const role = this.repository.create({ name, user, association });

    return await this.repository.save(role);
  }

  async getByUserAndAssociation(userId: number, associationId: number): Promise<Role> {
    const role = await this.repository.findOne({
      where: {
        user: { id: Equal(userId) },
        association: { id: Equal(associationId) },
      },
    });

    if (!role) {
      throw new NotFoundException(
        `Role for user ${userId} in association ${associationId} not found`,
      );
    }

    return role;
  }

  async update(userId: number, associationId: number, name: string): Promise<Role> {
    const role = await this.getByUserAndAssociation(userId, associationId);
    role.name = name;

    return await this.repository.save(role);
  }

  async delete(userId: number, associationId: number): Promise<boolean> {
    const role = await this.getByUserAndAssociation(userId, associationId);
    await this.repository.delete(role.id);

    return true;
  }

  async getUsersByRole(role: string): Promise<User[]> {
    const RolesFind = await this.repository.find({where: {name: role}, relations: {user: true}});
    return RolesFind.map(RoleFind => RoleFind.user);
  }

}
