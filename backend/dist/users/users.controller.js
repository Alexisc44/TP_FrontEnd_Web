"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const swagger_1 = require("@nestjs/swagger");
const user_input_1 = require("./user.input");
const bcrypt = __importStar(require("bcrypt"));
let UsersController = class UsersController {
    service;
    compteur_id = 1;
    constructor(service) {
        this.service = service;
    }
    async getAll() {
        return await this.service.getAll();
    }
    async getAll2() {
        return await this.service.getAll();
    }
    async create(input) {
        if (!input.firstname || input.firstname.trim() === '') {
            throw new common_1.BadRequestException('Firstname cannot be empty');
        }
        if (!input.lastname || input.lastname.trim() === '') {
            throw new common_1.BadRequestException('Lastname cannot be empty');
        }
        if (isNaN(+input.age) || +input.age < 0) {
            throw new common_1.BadRequestException('Age must be a positive number');
        }
        if (!input.password || input.password.trim() === '') {
            throw new common_1.BadRequestException('Password cannot be empty');
        }
        const saltOrRounds = 10;
        const hash = await bcrypt.hash(input.password, saltOrRounds);
        const user = await this.service.create(this.compteur_id, input.lastname, input.firstname, +input.age, hash);
        this.compteur_id++;
        return user;
    }
    async getById(parameter) {
        const userId = +parameter;
        if (isNaN(userId) || userId <= 0) {
            throw new common_1.NotFoundException(`Invalid user ID: ${parameter}`);
        }
        const user = await this.service.getById(userId);
        if (user === undefined) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        return user;
    }
    async update(input, param) {
        const userId = +param;
        if (isNaN(userId) || userId <= 0) {
            throw new common_1.NotFoundException(`Invalid user ID: ${param}`);
        }
        if (!input.firstname || input.firstname.trim() === '') {
            throw new common_1.BadRequestException('Firstname cannot be empty');
        }
        if (!input.lastname || input.lastname.trim() === '') {
            throw new common_1.BadRequestException('Lastname cannot be empty');
        }
        if (isNaN(+input.age) || +input.age < 0) {
            throw new common_1.BadRequestException('Age must be a positive number');
        }
        if (!input.password || input.password.trim() === '') {
            throw new common_1.BadRequestException('Password cannot be empty');
        }
        const saltOrRounds = 10;
        const hash = await bcrypt.hash(input.password, saltOrRounds);
        const user = await this.service.update(userId, input.lastname, input.firstname, +input.age, hash);
        if (user === undefined) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        return user;
    }
    async delete(parameter) {
        const userId = +parameter;
        if (isNaN(userId) || userId <= 0) {
            throw new common_1.NotFoundException(`Invalid user ID: ${parameter}`);
        }
        const user = await this.service.delete(userId);
        if (user === undefined) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        return user;
    }
    async getRolesByUser(parameter) {
        const userId = +parameter;
        if (isNaN(userId) || userId <= 0) {
            throw new common_1.NotFoundException(`Invalid user ID: ${parameter}`);
        }
        const roles = await this.service.getRolesByUser(userId);
        if (roles === undefined || roles.length === 0) {
            throw new common_1.NotFoundException(`Roles for user ${userId} not found`);
        }
        return roles;
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Successfully retrieved the list of all users.'
    }),
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAll", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Successfully retrieved the list of all users.'
    }),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAll2", null);
__decorate([
    (0, swagger_1.ApiCreatedResponse)({
        description: 'The user has been successfully created.'
    }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_input_1.UserInput]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Successfully retrieved the user.'
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'User not found.' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getById", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'The user has been successfully updated.'
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'User not found.' }),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_input_1.UserInput, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'The user has been successfully deleted.'
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'User not found.' }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "delete", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'The roles of the user were successfully retrieved.'
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'User not found.' }),
    (0, common_1.Get)(':id/roles'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getRolesByUser", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map