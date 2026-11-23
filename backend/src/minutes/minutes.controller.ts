import { Controller, Get, Body, Post, Param, NotFoundException, Put, Delete, BadRequestException } from '@nestjs/common';
import { Minute } from './minute.entity';
import {
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger';
import { MinutesService } from './minutes.service';
import { MinuteInput } from './minute.input';

@ApiTags('minutes')
@Controller('minutes')
export class MinutesController {
    compteur_id = 1;
    constructor(
        private service: MinutesService,
    ) {}

    @ApiOkResponse({
        description: 'Successfully retrieved the list of all minutes.'
    })
    @Get()
        async getAll(): Promise<Minute[]> {
            return await this.service.getAll();
        }


    @ApiCreatedResponse({
        description: 'The minute has been successfully created.'
    })
    @ApiNotFoundResponse({ description: 'The user or association was not found.' })
    @Post()
        async create(@Body() input: MinuteInput): Promise<Minute> {
            if (!input.content || input.content.trim() === '') {
                throw new BadRequestException('Content cannot be empty');
            }
            if (!input.idVoters || !Array.isArray(input.idVoters) || input.idVoters.length === 0) {
                throw new BadRequestException('Minute must have at least one voter');
            }
            for (const voterId of input.idVoters) {
                if (isNaN(+voterId) || +voterId <= 0) {
                    throw new BadRequestException(`Invalid voter ID: ${voterId}`);
                }
            }
            if (!input.date || input.date.trim() === '') {
                throw new BadRequestException('Date cannot be empty');
            }
            if (isNaN(+input.idAssociation) || +input.idAssociation <= 0) {
                throw new BadRequestException('Invalid association ID');
            }
            const minute = await this.service.create(this.compteur_id, input.content, input.idVoters, input.date, input.idAssociation);
            this.compteur_id ++;
            return minute;
        }

    @ApiOkResponse({
        description: 'Successfully retrieved the minute.'
    })
    @ApiNotFoundResponse({ description: 'minute not found.' })
    @Get(':id')
        async getById(@Param('id') parameter : string): Promise<Minute> {
            const minuteId = +parameter;
            
            if (isNaN(minuteId) || minuteId <= 0) {
                throw new NotFoundException(`Invalid minute ID: ${parameter}`);
            }

            const minute = await this.service.getById(minuteId);

            if (minute === undefined){
                    throw new NotFoundException(`minute with ID ${minuteId} not found`);
                }

            return minute;
        }

    @ApiOkResponse({
        description: 'The minute has been successfully updated.'
    })
    @ApiNotFoundResponse({ description: 'minute not found.' })
    @Put(':id')
        async update(@Body() input : MinuteInput, @Param('id') param : string) : Promise<Minute> {
            const minuteId = +param;
            
            if (isNaN(minuteId) || minuteId <= 0) {
                throw new NotFoundException(`Invalid minute ID: ${param}`);
            }
            if (!input.content || input.content.trim() === '') {
                throw new BadRequestException('Content cannot be empty');
            }
            if (!input.idVoters || !Array.isArray(input.idVoters) || input.idVoters.length === 0) {
                throw new BadRequestException('Minute must have at least one voter');
            }
            for (const voterId of input.idVoters) {
                if (isNaN(+voterId) || +voterId <= 0) {
                    throw new BadRequestException(`Invalid voter ID: ${voterId}`);
                }
            }
            if (!input.date || input.date.trim() === '') {
                throw new BadRequestException('Date cannot be empty');
            }
            if (isNaN(+input.idAssociation) || +input.idAssociation <= 0) {
                throw new BadRequestException('Invalid association ID');
            }
            
            const minute = await this.service.update(minuteId, input.idVoters, input.content, input.date, input.idAssociation);

            if (minute === undefined){
                    throw new NotFoundException(`minute with ID ${minuteId} not found`);
                }

            return minute;
        }

    @ApiOkResponse({
        description: 'The minute has been successfully deleted.'
    })
    @ApiNotFoundResponse({ description: 'minute not found.' })
    @Delete(':id')
        async delete(@Param('id') parameter : string) : Promise<Boolean> {
            const minuteId = +parameter;
            
            if (isNaN(minuteId) || minuteId <= 0) {
                throw new NotFoundException(`Invalid minute ID: ${parameter}`);
            }
            
            const minute = await this.service.delete(minuteId);

            if (minute === undefined){
                    throw new NotFoundException(`minute with ID ${minuteId} not found`);
                }

            return minute;
        }
}
