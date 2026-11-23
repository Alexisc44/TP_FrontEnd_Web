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
exports.AssociationsController = void 0;
const common_1 = require("@nestjs/common");
const associations_service_1 = require("./associations.service");
const swagger_1 = require("@nestjs/swagger");
const association_input_1 = require("./association.input");
let AssociationsController = class AssociationsController {
    service;
    compteur_id = 1;
    constructor(service) {
        this.service = service;
    }
    async getMembers(parameter) {
        const assoId = +parameter;
        if (isNaN(assoId) || assoId <= 0) {
            throw new common_1.NotFoundException(`Invalid association ID: ${parameter}`);
        }
        const members = await this.service.getMembers(assoId);
        if (members === undefined) {
            throw new common_1.NotFoundException(`Association with ID ${assoId} not found`);
        }
        return members;
    }
    async getMinutesByAssociation(parameter, sort = 'date', order = 'DESC') {
        const assoId = +parameter;
        if (isNaN(assoId) || assoId <= 0) {
            throw new common_1.NotFoundException(`Invalid association ID: ${parameter}`);
        }
        if (!(sort === 'date' || sort === 'id')) {
            sort = 'date';
        }
        if (!(order === 'DESC' || order === 'ASC')) {
            order = 'DESC';
        }
        return this.service.getMinutesByAssociation(assoId, sort, order);
    }
    async getAll() {
        return await this.service.getAllDTO();
    }
    async getAll2() {
        return await this.service.getAllDTO();
    }
    async create(input) {
        if (!input.name || input.name.trim() === '') {
            throw new common_1.NotFoundException('Association name cannot be empty');
        }
        if (!input.idUsers || !Array.isArray(input.idUsers) || input.idUsers.length === 0) {
            throw new common_1.NotFoundException('Association must have at least one user');
        }
        for (const userId of input.idUsers) {
            if (isNaN(+userId) || +userId <= 0) {
                throw new common_1.NotFoundException(`Invalid user ID: ${userId}`);
            }
        }
        const asso = await this.service.createDTO(this.compteur_id, input.idUsers, input.name);
        this.compteur_id++;
        return asso;
    }
    async getById(parameter) {
        const assoId = +parameter;
        if (isNaN(assoId) || assoId <= 0) {
            throw new common_1.NotFoundException(`Invalid association ID: ${parameter}`);
        }
        const asso = await this.service.getDTOById(assoId);
        if (asso === undefined) {
            throw new common_1.NotFoundException(`Association with ID ${assoId} not found`);
        }
        return asso;
    }
    async update(input, param) {
        const assoId = +param;
        if (isNaN(assoId) || assoId <= 0) {
            throw new common_1.NotFoundException(`Invalid association ID: ${param}`);
        }
        if (!input.name || input.name.trim() === '') {
            throw new common_1.NotFoundException('Association name cannot be empty');
        }
        if (!input.idUsers || !Array.isArray(input.idUsers) || input.idUsers.length === 0) {
            throw new common_1.NotFoundException('Association must have at least one user');
        }
        for (const userId of input.idUsers) {
            if (isNaN(+userId) || +userId <= 0) {
                throw new common_1.NotFoundException(`Invalid user ID: ${userId}`);
            }
        }
        const asso = await this.service.updateDTO(assoId, input.idUsers, input.name);
        if (asso === undefined) {
            throw new common_1.NotFoundException(`Association with ID ${assoId} not found`);
        }
        return asso;
    }
    async delete(parameter) {
        const assoId = +parameter;
        if (isNaN(assoId) || assoId <= 0) {
            throw new common_1.NotFoundException(`Invalid association ID: ${parameter}`);
        }
        const user = await this.service.delete(assoId);
        if (user === undefined) {
            throw new common_1.NotFoundException(`Association with ID ${assoId} not found`);
        }
        return user;
    }
};
exports.AssociationsController = AssociationsController;
__decorate([
    (0, common_1.Get)(':id/members'),
    (0, swagger_1.ApiOkResponse)({
        description: 'Successfully retrieved the members of the association.'
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Association not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssociationsController.prototype, "getMembers", null);
__decorate([
    (0, common_1.Get)(':id/minutes'),
    (0, swagger_1.ApiOkResponse)({
        description: 'Successfully retrieved the minutes of the association.'
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Association not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('sort')),
    __param(2, (0, common_1.Query)('order')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AssociationsController.prototype, "getMinutesByAssociation", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, swagger_1.ApiOkResponse)({
        description: 'Successfully retrieved the list of all associations.'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AssociationsController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOkResponse)({
        description: 'Successfully retrieved the list of all associations.'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AssociationsController.prototype, "getAll2", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'The association has been successfully created.'
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'One of the users was not found.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [association_input_1.AssociationsInput]),
    __metadata("design:returntype", Promise)
], AssociationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOkResponse)({
        description: 'Successfully retrieved the association.'
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Association not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssociationsController.prototype, "getById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOkResponse)({
        description: 'The association has been successfully updated.'
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Association not found.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [association_input_1.AssociationsInput, String]),
    __metadata("design:returntype", Promise)
], AssociationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOkResponse)({
        description: 'The association has been successfully deleted.'
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Association not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssociationsController.prototype, "delete", null);
exports.AssociationsController = AssociationsController = __decorate([
    (0, swagger_1.ApiTags)('associations'),
    (0, common_1.Controller)('associations'),
    __metadata("design:paramtypes", [associations_service_1.AssociationsService])
], AssociationsController);
//# sourceMappingURL=associations.controller.js.map