import { Injectable, NotFoundException } from '@nestjs/common';
import { Minute } from './minute.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { AssociationsService } from '../associations/associations.service';
import { UsersService } from '../users/users.service';
import { Association } from '../associations/association.entity';

@Injectable()
export class MinutesService {

constructor(
        private serviceUsers: UsersService,
        private serviceAssociations: AssociationsService,
        @InjectRepository(Minute)
        private repository: Repository<Minute>

    ) {}

    async getAll(): Promise<Minute[]> {
        return await this.repository.find();
    }
        
    async create(minuteId: number, content: string, idUsers: number[], date: string, idAssociation: number): Promise<Minute> {
            let users: User[] = [];
            for (const userId of idUsers) {
                const user = await this.serviceUsers.getById(userId);
                users.push(user);
            }

            const association = await this.serviceAssociations.getById(idAssociation);

            const newMinute = this.repository.create({ id: minuteId, content: content, voters: users, date: date, association: association });
            return await this.repository.save(newMinute);
        }
    
        async getById(minuteId: number): Promise<Minute> {
        
                const minute = await this.repository.findOneBy({id: minuteId});

                if (!minute) {
                    throw new NotFoundException(`Minute with ID ${minuteId} not found`);
                }
        
                return minute;
            }
    
        async update(minuteId: number, idUsers: number[], content: string, date: string, idAssociation: number): Promise<Minute> {
            const minute = await this.getById(minuteId);

            if (content !== undefined) {
                minute.content = content;
            }

            if (date !== undefined) {
                minute.date = date;
            }
            
            if (idAssociation !== undefined) {
                const association = await this.serviceAssociations.getById(idAssociation);
                minute.association = association;
            }

            if (idUsers !== undefined) {
                const users: User[] = [];
                for (const userId of idUsers) {
                    users.push(await this.serviceUsers.getById(userId));
                }
                minute.voters = users;
            }

            return await this.repository.save(minute);
        }
    
        async delete(assoId: number) : Promise<Boolean> {   
            const result = await this.repository.delete(assoId);

            if (result.affected === 0) {
                throw new NotFoundException(`Minute with ID ${assoId} not found`);
            }

            return true;
        }
        
        async getVoters(minuteId: number): Promise<User[]> {
            const asso = await this.getById(minuteId);
            return await asso.voters;
        }

        async getAssociation(minuteId: number): Promise<Association> {
            const asso = await this.getById(minuteId);
            return await asso.association;
        }
}
