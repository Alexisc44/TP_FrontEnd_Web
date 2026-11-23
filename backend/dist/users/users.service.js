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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("./user.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const role_entity_1 = require("../role/role.entity");
const association_entity_1 = require("../associations/association.entity");
let UsersService = class UsersService {
    repository;
    repoAssociation;
    repoRole;
    constructor(repository, repoAssociation, repoRole) {
        this.repository = repository;
        this.repoAssociation = repoAssociation;
        this.repoRole = repoRole;
    }
    async getAll() {
        return await this.repository.find();
    }
    async create(lastname, firstname, age, password) {
        const newUser = await this.repository.create({ lastname: lastname, firstname: firstname, age: age, password: password });
        await this.repository.save(newUser);
        return newUser;
    }
    async getById(userId) {
        const user = await this.repository.findOneBy({ id: (0, typeorm_2.Equal)(userId) });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        return user;
    }
    async update(userId, lastname, firstname, age, password) {
        const user = await this.getById(userId);
        if (firstname !== undefined) {
            user.firstname = firstname;
        }
        if (lastname !== undefined) {
            user.lastname = lastname;
        }
        if (age !== undefined) {
            user.age = age;
        }
        if (password !== undefined) {
            user.password = password;
        }
        return await this.repository.save(user);
    }
    async delete(userId) {
        const result = await this.repository.delete(userId);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        return true;
    }
    async getRolesByUser(userId) {
        return this.repoRole.find({ where: { user: { id: userId } }, relations: { user: true, association: true }, });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(association_entity_1.Association)),
    __param(2, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map