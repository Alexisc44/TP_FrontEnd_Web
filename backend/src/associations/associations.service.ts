import { Injectable, NotFoundException } from '@nestjs/common';
import { Association } from './association.entity';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from '../role/role.entity';
import { AssociationsDTO } from './association.dto';
import { Member } from './association.member';
import { Minute } from '../minutes/minute.entity';

@Injectable()
export class AssociationsService {

    constructor(
        private service: UsersService,
        @InjectRepository(Association)
        private repository: Repository<Association>,
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
        @InjectRepository(Minute)
        private minuteRepository: Repository<Minute>
    ) {}


    async getAllDTO(): Promise<AssociationsDTO[]> {
        const associations = await this.repository.find();
        if (associations.length === 0) {
            return [];
        }

        const roles = await this.roleRepository.find({
            where: { association: { id: In(associations.map(({ id }) => id)) } },
        });
        // disctionnaire idAssociation -> liste des ses roles
        const rolesByAssociation = new Map<number, Role[]>();
        for (const role of roles) {
            const associationId = role.association.id;
            const associationRoles = rolesByAssociation.get(associationId) ?? [];
            associationRoles.push(role);
            rolesByAssociation.set(associationId, associationRoles);
        }

        return associations.map((association) =>
            this.toDTO(association, rolesByAssociation.get(association.id) ?? []),
        );
    }

    async getDTOById(assoId: number): Promise<AssociationsDTO> {
        const association = await this.getById(assoId);
        const roles = await this.roleRepository.find({
            where: { association: { id: association.id } },
        });

        return this.toDTO(association, roles);
    }

    async createDTO(
        assoId: number,
        idUsers: number[],
        name: string,
    ): Promise<AssociationsDTO> {
        const association = await this.create(assoId, idUsers, name);
        return this.getDTOById(association.id);
    }

    async updateDTO(
        assoId: number,
        idUsers: number[],
        name: string,
    ): Promise<AssociationsDTO> {
        await this.update(assoId, idUsers, name);
        return this.getDTOById(assoId);
    }

    private toDTO(association: Association, roles: Role[]): AssociationsDTO {
        const rolesByUser = new Map<number, string>();
        for (const role of roles) {
            rolesByUser.set(role.user.id, role.name);
        }

        const members = association.users.map(
            (user) =>
                new Member(
                    user.lastname,
                    user.firstname,
                    user.age,
                    rolesByUser.get(user.id) ?? null,
                ),
        );

        return new AssociationsDTO(association.name, members);
    }
        
    async create(assoId: number, idUsers: number[], name: string): Promise<Association> {
            let users: User[] = [];
            for (const userId of idUsers) {
                const user = await this.service.getById(userId);
                users.push(user);
            }

            const newAsso = this.repository.create({ id: assoId, users: users, name: name });
            return await this.repository.save(newAsso);
        }
    
        async getById(assoId: number): Promise<Association> {
        
                const asso = await this.repository.findOneBy({id: assoId});

                if (!asso) {
                    throw new NotFoundException(`Association with ID ${assoId} not found`);
                }
        
                return asso;
            }
    
        async update(assoId: number, idUsers: number[], name: string): Promise<Association> {
            const asso = await this.getById(assoId);

            if (name !== undefined) {
                asso.name = name;
            }

            if (idUsers !== undefined) {
                const users: User[] = [];
                for (const userId of idUsers) {
                    users.push(await this.service.getById(userId));
                }
                asso.users = users;
            }

            return await this.repository.save(asso);
        }
    
        async delete(assoId: number) : Promise<Boolean> {   
            const result = await this.repository.delete(assoId);

            if (result.affected === 0) {
                throw new NotFoundException(`Association with ID ${assoId} not found`);
            }

            return true;
        }
        
        async getMembers(assoId: number): Promise<User[]> {
            const asso = await this.getById(assoId);
            return await asso.users;
        }

        async getMinutesByAssociation(assoId: number, sort: 'date' | 'id', order: 'DESC' | 'ASC'): Promise<Minute[]>{
            if (sort === 'date'){
                return this.minuteRepository.find({where: {association: {id: assoId}}, relations: {association: true}, order: {date: order}});
            }
            else{
                return this.minuteRepository.find({where: {association: {id: assoId}}, relations: {association: true}, order: {id: order}});
            }
        }
}
