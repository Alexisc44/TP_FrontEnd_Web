import { Controller, Get, Body, Post, Param, NotFoundException, Put, Delete, Query } from '@nestjs/common';
import { AssociationsService } from './associations.service';
import { User } from '../users/user.entity';
import { AssociationsDTO } from './association.dto';
import {
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger';
import { AssociationsInput } from './association.input';
import { Minute } from '../minutes/minute.entity';

@ApiTags('associations')
@Controller('associations')
export class AssociationsController {
    compteur_id = 1;
    constructor(
        private service: AssociationsService
    ) {}

@Get(':id/members')
@ApiOkResponse({
    description: 'Successfully retrieved the members of the association.'
})
@ApiNotFoundResponse({ description: 'Association not found.' })
    async getMembers(@Param('id') parameter: string): Promise<User[]> {
        const assoId = +parameter;
        
        if (isNaN(assoId) || assoId <= 0) {
            throw new NotFoundException(`Invalid association ID: ${parameter}`);
        }

        const members = await this.service.getMembers(assoId);

        if (members === undefined) {
            throw new NotFoundException(`Association with ID ${assoId} not found`);
        }

        return members;
    }

@Get(':id/minutes')
@ApiOkResponse({
  description: 'Successfully retrieved the minutes of the association.'
})
@ApiNotFoundResponse({ description: 'Association not found.' })
async getMinutesByAssociation(@Param('id') parameter: string, @Query('sort') sort: 'date' | 'id' = 'date', @Query('order') order: 'ASC' | 'DESC' = 'DESC',): Promise<Minute[]> {
    const assoId = +parameter;

    if (isNaN(assoId) || assoId <= 0) {
        throw new NotFoundException(`Invalid association ID: ${parameter}`);
    }
    
    if (!(sort ==='date' || sort==='id')){
        sort = 'date';
    }
    if (!(order ==='DESC' || order==='ASC')){
        order = 'DESC';
    }
  
  return this.service.getMinutesByAssociation(assoId, sort, order);
}

@Get('all')
@ApiOkResponse({
    description: 'Successfully retrieved the list of all associations.'
})
    async getAll(): Promise<AssociationsDTO[]> {
        return await this.service.getAllDTO();
    }

@Get()
@ApiOkResponse({
    description: 'Successfully retrieved the list of all associations.'
})
    async getAll2(): Promise<AssociationsDTO[]> {
        return await this.service.getAllDTO();
    }


@Post()
@ApiCreatedResponse({
    description: 'The association has been successfully created.'
})
@ApiNotFoundResponse({ description: 'One of the users was not found.' })
    async create(@Body() input: AssociationsInput): Promise<AssociationsDTO> {
        if (!input.name || input.name.trim() === '') {
            throw new NotFoundException('Association name cannot be empty');
        }
        if (!input.idUsers || !Array.isArray(input.idUsers) || input.idUsers.length === 0) {
            throw new NotFoundException('Association must have at least one user');
        }
        for (const userId of input.idUsers) {
            if (isNaN(+userId) || +userId <= 0) {
                throw new NotFoundException(`Invalid user ID: ${userId}`);
            }
        }
        const asso = await this.service.createDTO(this.compteur_id, input.idUsers, input.name);
        this.compteur_id ++;
        return asso;
    }

@Get(':id')
@ApiOkResponse({
    description: 'Successfully retrieved the association.'
})
@ApiNotFoundResponse({ description: 'Association not found.' })
    async getById(@Param('id') parameter : string): Promise<AssociationsDTO> {
        const assoId = +parameter;

        if (isNaN(assoId) || assoId <= 0) {
            throw new NotFoundException(`Invalid association ID: ${parameter}`);
        }

        const asso = await this.service.getDTOById(assoId);

        if (asso === undefined){
                throw new NotFoundException(`Association with ID ${assoId} not found`);
            }

        return asso;
    }

@Put(':id')
@ApiOkResponse({
    description: 'The association has been successfully updated.'
})
@ApiNotFoundResponse({ description: 'Association not found.' })
    async update(@Body() input : AssociationsInput, @Param('id') param : string) : Promise<AssociationsDTO> {
        const assoId = +param;

        if (isNaN(assoId) || assoId <= 0) {
            throw new NotFoundException(`Invalid association ID: ${param}`);
        }
        if (!input.name || input.name.trim() === '') {
            throw new NotFoundException('Association name cannot be empty');
        }
        if (!input.idUsers || !Array.isArray(input.idUsers) || input.idUsers.length === 0) {
            throw new NotFoundException('Association must have at least one user');
        }
        for (const userId of input.idUsers) {
            if (isNaN(+userId) || +userId <= 0) {
                throw new NotFoundException(`Invalid user ID: ${userId}`);
            }
        }

        const asso = await this.service.updateDTO(assoId, input.idUsers, input.name);

        if (asso === undefined){
                throw new NotFoundException(`Association with ID ${assoId} not found`);
            }

        return asso;
    }

    @Delete(':id')
    @ApiOkResponse({
        description: 'The association has been successfully deleted.'
    })
    @ApiNotFoundResponse({ description: 'Association not found.' })
        async delete(@Param('id') parameter : string) : Promise<Boolean> {
            const assoId = +parameter;

            if (isNaN(assoId) || assoId <= 0) {
                throw new NotFoundException(`Invalid association ID: ${parameter}`);
            }

            const user = await this.service.delete(assoId);

            if (user === undefined){
                    throw new NotFoundException(`Association with ID ${assoId} not found`);
                }

            return user;
        }
}