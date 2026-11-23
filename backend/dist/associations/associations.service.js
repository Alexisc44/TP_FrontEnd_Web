"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssociationsService = void 0;
const common_1 = require("@nestjs/common");
const association_entity_1 = require("./association.entity");
const users_service_1 = require("../users/users.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const role_entity_1 = require("../role/role.entity");
const association_dto_1 = require("./association.dto");
const association_member_1 = require("./association.member");
const minute_entity_1 = require("../minutes/minute.entity");
let AssociationsService = class AssociationsService {
    service;
    repository;
    roleRepository;
    minuteRepository;
    constructor(service, repository, roleRepository, minuteRepository) {
        this.service = service;
        this.repository = repository;
        this.roleRepository = roleRepository;
        this.minuteRepository = minuteRepository;
    }
    async getAllDTO() {
        const associations = await this.repository.find();
        if (associations.length === 0) {
            return [];
        }
        const roles = await this.roleRepository.find({
            where: { association: { id: (0, typeorm_2.In)(associations.map(({ id }) => id)) } },
        });
        const rolesByAssociation = new Map();
        for (const role of roles) {
            const associationId = role.association.id;
            const associationRoles = rolesByAssociation.get(associationId) ?? [];
            associationRoles.push(role);
            rolesByAssociation.set(associationId, associationRoles);
        }
        return associations.map((association) => this.toDTO(association, rolesByAssociation.get(association.id) ?? []));
    }
    async getDTOById(assoId) {
        const association = await this.getById(assoId);
        const roles = await this.roleRepository.find({
            where: { association: { id: association.id } },
        });
        return this.toDTO(association, roles);
    }
    async createDTO(assoId, idUsers, name) {
        const association = await this.create(assoId, idUsers, name);
        return this.getDTOById(association.id);
    }
    async updateDTO(assoId, idUsers, name) {
        await this.update(assoId, idUsers, name);
        return this.getDTOById(assoId);
    }
    toDTO(association, roles) {
        const rolesByUser = new Map();
        for (const role of roles) {
            rolesByUser.set(role.user.id, role.name);
        }
        const members = association.users.map((user) => new association_member_1.Member(user.lastname, user.firstname, user.age, rolesByUser.get(user.id) ?? null));
        return new association_dto_1.AssociationsDTO(association.name, members);
    }
    async create(assoId, idUsers, name) {
        let users = [];
        for (const userId of idUsers) {
            const user = await this.service.getById(userId);
            users.push(user);
        }
        const newAsso = this.repository.create({ id: assoId, users: users, name: name });
        return await this.repository.save(newAsso);
    }
    async getById(assoId) {
        const asso = await this.repository.findOneBy({ id: assoId });
        if (!asso) {
            throw new common_1.NotFoundException(`Association with ID ${assoId} not found`);
        }
        return asso;
    }
    async update(assoId, idUsers, name) {
        const asso = await this.getById(assoId);
        if (name !== undefined) {
            asso.name = name;
        }
        if (idUsers !== undefined) {
            const users = [];
            for (const userId of idUsers) {
                users.push(await this.service.getById(userId));
            }
            asso.users = users;
        }
        return await this.repository.save(asso);
    }
    async delete(assoId) {
        const result = await this.repository.delete(assoId);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Association with ID ${assoId} not found`);
        }
        return true;
    }
    async getMembers(assoId) {
        const asso = await this.getById(assoId);
        return await asso.users;
    }
    async getMinutesByAssociation(assoId, sort, order) {
        if (sort === 'date') {
            return this.minuteRepository.find({ where: { association: { id: assoId } }, relations: { association: true }, order: { date: order } });
        }
        else {
            return this.minuteRepository.find({ where: { association: { id: assoId } }, relations: { association: true }, order: { id: order } });
        }
    }
};
exports.AssociationsService = AssociationsService;
exports.AssociationsService = AssociationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(association_entity_1.Association)),
    __param(2, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __param(3, (0, typeorm_1.InjectRepository)(minute_entity_1.Minute)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AssociationsService);
//# sourceMappingURL=associations.service.js.map