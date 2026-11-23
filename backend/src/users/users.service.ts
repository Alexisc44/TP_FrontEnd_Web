import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { Role } from '../role/role.entity';
import { AssociationsDTO } from '../associations/association.dto';
import { Association } from '../associations/association.entity';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private repository: Repository<User>,
        @InjectRepository(Association)
        private repoAssociation: Repository<Association>,

        @InjectRepository(Role)
        private repoRole: Repository<Role>
    ) {}

    async getAll(): Promise<User[]> {
        return await this.repository.find();
    }
    
    async create(userId: number, lastname: string, firstname: string, age: number, password: string): Promise<User> {
            const newUser = await this.repository.create({id: userId, lastname: lastname, firstname: firstname, age: age, password: password});
            await this.repository.save(newUser);
            return newUser;
        }

    async getById(userId: number): Promise<User> {
    
            const user = await this.repository.findOneBy({id: Equal(userId)});
    
            if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

            return user;
        }

    async update(userId: number, lastname: string, firstname: string, age: number, password: string) : Promise<User> {
    
            const user = await this.getById(userId);
    
            if (firstname !== undefined){
                user.firstname = firstname
            }
            if (lastname !== undefined){
                user.lastname = lastname
            }
            if (age !== undefined){
                user.age = age
            }
            if (password !== undefined){
                user.password = password
            }

            return await this.repository.save(user)
        }

    async delete(userId: number) : Promise<Boolean> {   
        const result = await this.repository.delete(userId);

        if (result.affected === 0) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        return true;
    }

    async getRolesByUser(userId: number): Promise<Role[]> {
        return this.repoRole.find({where: {user: { id: userId }}, relations: { user: true, association: true },});
    }
    //Est ce qu'il faut maintenant tout le temps utiliser les AssociationDTO
}
