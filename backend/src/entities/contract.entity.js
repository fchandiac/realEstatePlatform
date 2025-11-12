"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contract = exports.ContractRole = exports.ContractStatus = exports.ContractOperationType = void 0;
const typeorm_1 = require("typeorm");
const property_entity_1 = require("./property.entity");
const user_entity_1 = require("./user.entity");
var ContractOperationType;
(function (ContractOperationType) {
    ContractOperationType["COMPRAVENTA"] = "COMPRAVENTA";
    ContractOperationType["ARRIENDO"] = "ARRIENDO";
})(ContractOperationType || (exports.ContractOperationType = ContractOperationType = {}));
var ContractStatus;
(function (ContractStatus) {
    ContractStatus["IN_PROCESS"] = "IN_PROCESS";
    ContractStatus["CLOSED"] = "CLOSED";
    ContractStatus["FAILED"] = "FAILED";
    ContractStatus["ON_HOLD"] = "ON_HOLD";
})(ContractStatus || (exports.ContractStatus = ContractStatus = {}));
var ContractRole;
(function (ContractRole) {
    ContractRole["SELLER"] = "SELLER";
    ContractRole["BUYER"] = "BUYER";
    ContractRole["LANDLORD"] = "LANDLORD";
    ContractRole["TENANT"] = "TENANT";
    ContractRole["NOTARY"] = "NOTARY";
    ContractRole["REGISTRAR"] = "REGISTRAR";
    ContractRole["WITNESS"] = "WITNESS";
    ContractRole["GUARANTOR"] = "GUARANTOR";
    ContractRole["REPRESENTATIVE"] = "REPRESENTATIVE";
    ContractRole["PROMISSOR"] = "PROMISSOR";
    ContractRole["THIRD_PARTY"] = "THIRD_PARTY";
    ContractRole["AGENT"] = "AGENT";
})(ContractRole || (exports.ContractRole = ContractRole = {}));
let Contract = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)('contracts')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _propertyId_decorators;
    let _propertyId_initializers = [];
    let _propertyId_extraInitializers = [];
    let _operation_decorators;
    let _operation_initializers = [];
    let _operation_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _amount_decorators;
    let _amount_initializers = [];
    let _amount_extraInitializers = [];
    let _commissionPercent_decorators;
    let _commissionPercent_initializers = [];
    let _commissionPercent_extraInitializers = [];
    let _commissionAmount_decorators;
    let _commissionAmount_initializers = [];
    let _commissionAmount_extraInitializers = [];
    let _payments_decorators;
    let _payments_initializers = [];
    let _payments_extraInitializers = [];
    let _documents_decorators;
    let _documents_initializers = [];
    let _documents_extraInitializers = [];
    let _people_decorators;
    let _people_initializers = [];
    let _people_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _user_decorators;
    let _user_initializers = [];
    let _user_extraInitializers = [];
    let _property_decorators;
    let _property_initializers = [];
    let _property_extraInitializers = [];
    var Contract = _classThis = class {
        constructor() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.userId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.propertyId = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _propertyId_initializers, void 0));
            this.operation = (__runInitializers(this, _propertyId_extraInitializers), __runInitializers(this, _operation_initializers, void 0));
            this.status = (__runInitializers(this, _operation_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.endDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
            this.amount = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
            this.commissionPercent = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _commissionPercent_initializers, void 0));
            this.commissionAmount = (__runInitializers(this, _commissionPercent_extraInitializers), __runInitializers(this, _commissionAmount_initializers, void 0));
            this.payments = (__runInitializers(this, _commissionAmount_extraInitializers), __runInitializers(this, _payments_initializers, void 0));
            this.documents = (__runInitializers(this, _payments_extraInitializers), __runInitializers(this, _documents_initializers, void 0));
            this.people = (__runInitializers(this, _documents_extraInitializers), __runInitializers(this, _people_initializers, void 0));
            this.description = (__runInitializers(this, _people_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.createdAt = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            // Relations
            this.user = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _user_initializers, void 0));
            this.property = (__runInitializers(this, _user_extraInitializers), __runInitializers(this, _property_initializers, void 0));
            __runInitializers(this, _property_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Contract");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _userId_decorators = [(0, typeorm_1.Column)('uuid')];
        _propertyId_decorators = [(0, typeorm_1.Column)('uuid')];
        _operation_decorators = [(0, typeorm_1.Column)({
                type: 'enum',
                enum: ContractOperationType,
            })];
        _status_decorators = [(0, typeorm_1.Column)({
                type: 'enum',
                enum: ContractStatus,
                default: ContractStatus.IN_PROCESS,
            })];
        _endDate_decorators = [(0, typeorm_1.Column)({ type: 'date', nullable: true })];
        _amount_decorators = [(0, typeorm_1.Column)('int')];
        _commissionPercent_decorators = [(0, typeorm_1.Column)('float')];
        _commissionAmount_decorators = [(0, typeorm_1.Column)('float')];
        _payments_decorators = [(0, typeorm_1.Column)({ type: 'json', nullable: true })];
        _documents_decorators = [(0, typeorm_1.Column)({ type: 'json', nullable: true })];
        _people_decorators = [(0, typeorm_1.Column)({ type: 'json' })];
        _description_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
        _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
        _deletedAt_decorators = [(0, typeorm_1.DeleteDateColumn)()];
        _user_decorators = [(0, typeorm_1.ManyToOne)(() => user_entity_1.User), (0, typeorm_1.JoinColumn)({ name: 'userId' })];
        _property_decorators = [(0, typeorm_1.ManyToOne)(() => property_entity_1.Property), (0, typeorm_1.JoinColumn)({ name: 'propertyId' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _propertyId_decorators, { kind: "field", name: "propertyId", static: false, private: false, access: { has: obj => "propertyId" in obj, get: obj => obj.propertyId, set: (obj, value) => { obj.propertyId = value; } }, metadata: _metadata }, _propertyId_initializers, _propertyId_extraInitializers);
        __esDecorate(null, null, _operation_decorators, { kind: "field", name: "operation", static: false, private: false, access: { has: obj => "operation" in obj, get: obj => obj.operation, set: (obj, value) => { obj.operation = value; } }, metadata: _metadata }, _operation_initializers, _operation_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
        __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: obj => "amount" in obj, get: obj => obj.amount, set: (obj, value) => { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
        __esDecorate(null, null, _commissionPercent_decorators, { kind: "field", name: "commissionPercent", static: false, private: false, access: { has: obj => "commissionPercent" in obj, get: obj => obj.commissionPercent, set: (obj, value) => { obj.commissionPercent = value; } }, metadata: _metadata }, _commissionPercent_initializers, _commissionPercent_extraInitializers);
        __esDecorate(null, null, _commissionAmount_decorators, { kind: "field", name: "commissionAmount", static: false, private: false, access: { has: obj => "commissionAmount" in obj, get: obj => obj.commissionAmount, set: (obj, value) => { obj.commissionAmount = value; } }, metadata: _metadata }, _commissionAmount_initializers, _commissionAmount_extraInitializers);
        __esDecorate(null, null, _payments_decorators, { kind: "field", name: "payments", static: false, private: false, access: { has: obj => "payments" in obj, get: obj => obj.payments, set: (obj, value) => { obj.payments = value; } }, metadata: _metadata }, _payments_initializers, _payments_extraInitializers);
        __esDecorate(null, null, _documents_decorators, { kind: "field", name: "documents", static: false, private: false, access: { has: obj => "documents" in obj, get: obj => obj.documents, set: (obj, value) => { obj.documents = value; } }, metadata: _metadata }, _documents_initializers, _documents_extraInitializers);
        __esDecorate(null, null, _people_decorators, { kind: "field", name: "people", static: false, private: false, access: { has: obj => "people" in obj, get: obj => obj.people, set: (obj, value) => { obj.people = value; } }, metadata: _metadata }, _people_initializers, _people_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _user_decorators, { kind: "field", name: "user", static: false, private: false, access: { has: obj => "user" in obj, get: obj => obj.user, set: (obj, value) => { obj.user = value; } }, metadata: _metadata }, _user_initializers, _user_extraInitializers);
        __esDecorate(null, null, _property_decorators, { kind: "field", name: "property", static: false, private: false, access: { has: obj => "property" in obj, get: obj => obj.property, set: (obj, value) => { obj.property = value; } }, metadata: _metadata }, _property_initializers, _property_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Contract = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Contract = _classThis;
})();
exports.Contract = Contract;
