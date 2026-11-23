import { Controller, Get, Body, Post, Param, NotFoundException, Put, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { User } from './user.entity';
import { UsersService } from './users.service';
import {
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger';
import { UserInput } from './user.input';
import { AuthGuard } from '@nestjs/passport';
import * as bcrypt from 'bcrypt';
import { Role } from '../role/role.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {

    compteur_id = 1;
    constructor(
        private service: UsersService
    ) {}

@ApiOkResponse({
    description: 'Successfully retrieved the list of all users.'
})
@Get('all')
    async getAll(): Promise<User[]> {
        return await this.service.getAll();
    }

@ApiOkResponse({
    description: 'Successfully retrieved the list of all users.'
})
@Get()
    async getAll2(): Promise<User[]> {
        return await this.service.getAll();
    }


@ApiCreatedResponse({
    description: 'The user has been successfully created.'
})
@Post()
    async create(@Body() input: UserInput): Promise<User> {
        if (!input.firstname || input.firstname.trim() === '') {
            throw new BadRequestException('Firstname cannot be empty');
        }
        if (!input.lastname || input.lastname.trim() === '') {
            throw new BadRequestException('Lastname cannot be empty');
        }
        if (isNaN(+input.age) || +input.age < 0) {
            throw new BadRequestException('Age must be a positive number');
        }
        if (!input.password || input.password.trim() === '') {
            throw new BadRequestException('Password cannot be empty');
        }
        const saltOrRounds = 10;
        const hash = await bcrypt.hash(input.password, saltOrRounds);
        const user = await this.service.create(this.compteur_id,input.lastname, input.firstname, +input.age, hash);
        this.compteur_id ++;
        return user;
    }

@ApiOkResponse({
    description: 'Successfully retrieved the user.'
})
@ApiNotFoundResponse({ description: 'User not found.' })
@Get(':id')
    async getById(@Param('id') parameter : string): Promise<User> {
        const userId = +parameter;
        
        if (isNaN(userId) || userId <= 0) {
            throw new NotFoundException(`Invalid user ID: ${parameter}`);
        }

        const user = await this.service.getById(userId);

        if (user === undefined){
                throw new NotFoundException(`User with ID ${userId} not found`);
            }

        return user;
    }

@ApiOkResponse({
    description: 'The user has been successfully updated.'
})
@ApiNotFoundResponse({ description: 'User not found.' })
@Put(':id')
    async update(@Body() input : UserInput, @Param('id') param : string) : Promise<User> {
        const userId = +param;
        
        if (isNaN(userId) || userId <= 0) {
            throw new NotFoundException(`Invalid user ID: ${param}`);
        }
        if (!input.firstname || input.firstname.trim() === '') {
            throw new BadRequestException('Firstname cannot be empty');
        }
        if (!input.lastname || input.lastname.trim() === '') {
            throw new BadRequestException('Lastname cannot be empty');
        }
        if (isNaN(+input.age) || +input.age < 0) {
            throw new BadRequestException('Age must be a positive number');
        }
        if (!input.password || input.password.trim() === '') {
            throw new BadRequestException('Password cannot be empty');
        }
        
        const saltOrRounds = 10;
        const hash = await bcrypt.hash(input.password, saltOrRounds);
        const user = await this.service.update(userId, input.lastname, input.firstname, +input.age, hash);

        if (user === undefined){
                throw new NotFoundException(`User with ID ${userId} not found`);
            }

        return user;
    }

@ApiOkResponse({
    description: 'The user has been successfully deleted.'
})
@ApiNotFoundResponse({ description: 'User not found.' })
@Delete(':id')
    async delete(@Param('id') parameter : string) : Promise<Boolean> {
        const userId = +parameter;
        
        if (isNaN(userId) || userId <= 0) {
            throw new NotFoundException(`Invalid user ID: ${parameter}`);
        }
        
        const user = await this.service.delete(userId);

        if (user === undefined){
                throw new NotFoundException(`User with ID ${userId} not found`);
            }

        return user;
    }
    
    @ApiOkResponse({
    description: 'The roles of the user were successfully retrieved.'
    })
    @ApiNotFoundResponse({ description: 'User not found.' })
    @Get(':id/roles')
        async getRolesByUser(@Param('id') parameter : string) : Promise<Role[]> {
            const userId = +parameter;

            if (isNaN(userId) || userId <= 0) {
                throw new NotFoundException(`Invalid user ID: ${parameter}`);
            }

            const roles = await this.service.getRolesByUser(userId);
            if (roles === undefined || roles.length === 0){
                    throw new NotFoundException(`Roles for user ${userId} not found`);
                }

            return roles;
        }

}