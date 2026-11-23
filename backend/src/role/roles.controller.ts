import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from './role.entity';
import { RoleInput } from './role.input';
import { RoleUpdate } from './role.update.dto';
import { RolesService } from './roles.service';
import { User } from '../users/user.entity';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private service: RolesService) {}
  
  @Get('users/:name')
  @ApiOkResponse({ description: 'Users with this role were successfully retrieved.' })
  @ApiNotFoundResponse({ description: 'No users found for this role.' })
  async getUsersByRole(@Param('name') role: string): Promise<User[]> {
    if (!role || role.trim() === '') {
      throw new BadRequestException('Role name cannot be empty');
    }
    const users = await this.service.getUsersByRole(role);
    if (!users || users.length === 0) {
      throw new NotFoundException(`No users found for role: ${role}`);
    }
    return users;
  }

  @Post()
  @ApiCreatedResponse({ description: 'The role has been successfully created.' })
  @ApiNotFoundResponse({ description: 'The user or association was not found.' })
  async create(@Body() input: RoleInput): Promise<Role> {
    if (!input.name || input.name.trim() === '') {
      throw new BadRequestException('Role name cannot be empty');
    }
    if (isNaN(+input.idUser) || +input.idUser <= 0) {
      throw new BadRequestException('Invalid user ID');
    }
    if (isNaN(+input.idAssociation) || +input.idAssociation <= 0) {
      throw new BadRequestException('Invalid association ID');
    }
    return await this.service.create(
      input.name,
      +input.idUser,
      +input.idAssociation,
    );
  }

  @Get(':userId/:associationId')
  @ApiOkResponse({ description: 'Successfully retrieved the role.' })
  @ApiNotFoundResponse({ description: 'Role not found.' })
  async getByUserAndAssociation(
    @Param('userId') userId: string,
    @Param('associationId') associationId: string,
  ): Promise<Role> {
    if (isNaN(+userId) || +userId <= 0) {
      throw new BadRequestException('Invalid user ID');
    }
    if (isNaN(+associationId) || +associationId <= 0) {
      throw new BadRequestException('Invalid association ID');
    }
    const role = await this.service.getByUserAndAssociation(+userId, +associationId);
    if (!role) {
      throw new NotFoundException(`Role not found for user ${userId} and association ${associationId}`);
    }
    return role;
  }

  @Put(':userId/:associationId')
  @ApiOkResponse({ description: 'The role has been successfully updated.' })
  @ApiNotFoundResponse({ description: 'Role not found.' })
  async update(
    @Body() input: RoleUpdate,
    @Param('userId') userId: string,
    @Param('associationId') associationId: string,
  ): Promise<Role> {
    if (isNaN(+userId) || +userId <= 0) {
      throw new BadRequestException('Invalid user ID');
    }
    if (isNaN(+associationId) || +associationId <= 0) {
      throw new BadRequestException('Invalid association ID');
    }
    if (!input.name || input.name.trim() === '') {
      throw new BadRequestException('Role name cannot be empty');
    }
    const role = await this.service.update(+userId, +associationId, input.name);
    if (!role) {
      throw new NotFoundException(`Role not found for user ${userId} and association ${associationId}`);
    }
    return role;
  }
  

  @Delete(':userId/:associationId')
  @ApiOkResponse({ description: 'The role has been successfully deleted.' })
  @ApiNotFoundResponse({ description: 'Role not found.' })
  async delete(
    @Param('userId') userId: string,
    @Param('associationId') associationId: string,
  ): Promise<boolean> {
    if (isNaN(+userId) || +userId <= 0) {
      throw new BadRequestException('Invalid user ID');
    }
    if (isNaN(+associationId) || +associationId <= 0) {
      throw new BadRequestException('Invalid association ID');
    }
    const result = await this.service.delete(+userId, +associationId);
    if (!result) {
      throw new NotFoundException(`Role not found for user ${userId} and association ${associationId}`);
    }
    return result;
  }

}
