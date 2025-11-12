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
exports.Document = exports.DocumentStatus = void 0;
const typeorm_1 = require("typeorm");
const document_type_entity_1 = require("./document-type.entity");
const multimedia_entity_1 = require("./multimedia.entity");
const user_entity_1 = require("./user.entity");
const contract_entity_1 = require("./contract.entity");
const payment_entity_1 = require("./payment.entity");
var DocumentStatus;
(function (DocumentStatus) {
    DocumentStatus["PENDING"] = "PENDING";
    DocumentStatus["UPLOADED"] = "UPLOADED";
    DocumentStatus["RECIBIDO"] = "RECIBIDO";
    DocumentStatus["REJECTED"] = "REJECTED";
})(DocumentStatus || (exports.DocumentStatus = DocumentStatus = {}));
let Document = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)('documents')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _documentType_decorators;
    let _documentType_initializers = [];
    let _documentType_extraInitializers = [];
    let _documentTypeId_decorators;
    let _documentTypeId_initializers = [];
    let _documentTypeId_extraInitializers = [];
    let _multimedia_decorators;
    let _multimedia_initializers = [];
    let _multimedia_extraInitializers = [];
    let _multimediaId_decorators;
    let _multimediaId_initializers = [];
    let _multimediaId_extraInitializers = [];
    let _uploadedBy_decorators;
    let _uploadedBy_initializers = [];
    let _uploadedBy_extraInitializers = [];
    let _uploadedById_decorators;
    let _uploadedById_initializers = [];
    let _uploadedById_extraInitializers = [];
    let _contract_decorators;
    let _contract_initializers = [];
    let _contract_extraInitializers = [];
    let _contractId_decorators;
    let _contractId_initializers = [];
    let _contractId_extraInitializers = [];
    let _payment_decorators;
    let _payment_initializers = [];
    let _payment_extraInitializers = [];
    let _paymentId_decorators;
    let _paymentId_initializers = [];
    let _paymentId_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var Document = _classThis = class {
        constructor() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.title = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _title_initializers, void 0)); // Título del documento
            this.documentType = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _documentType_initializers, void 0));
            this.documentTypeId = (__runInitializers(this, _documentType_extraInitializers), __runInitializers(this, _documentTypeId_initializers, void 0));
            this.multimedia = (__runInitializers(this, _documentTypeId_extraInitializers), __runInitializers(this, _multimedia_initializers, void 0));
            this.multimediaId = (__runInitializers(this, _multimedia_extraInitializers), __runInitializers(this, _multimediaId_initializers, void 0));
            this.uploadedBy = (__runInitializers(this, _multimediaId_extraInitializers), __runInitializers(this, _uploadedBy_initializers, void 0));
            this.uploadedById = (__runInitializers(this, _uploadedBy_extraInitializers), __runInitializers(this, _uploadedById_initializers, void 0));
            this.contract = (__runInitializers(this, _uploadedById_extraInitializers), __runInitializers(this, _contract_initializers, void 0));
            this.contractId = (__runInitializers(this, _contract_extraInitializers), __runInitializers(this, _contractId_initializers, void 0));
            this.payment = (__runInitializers(this, _contractId_extraInitializers), __runInitializers(this, _payment_initializers, void 0));
            this.paymentId = (__runInitializers(this, _payment_extraInitializers), __runInitializers(this, _paymentId_initializers, void 0));
            this.status = (__runInitializers(this, _paymentId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.notes = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _notes_initializers, void 0)); // Notas adicionales
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Document");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _title_decorators = [(0, typeorm_1.Column)()];
        _documentType_decorators = [(0, typeorm_1.ManyToOne)(() => document_type_entity_1.DocumentType), (0, typeorm_1.JoinColumn)({ name: 'documentTypeId' })];
        _documentTypeId_decorators = [(0, typeorm_1.Column)({ type: 'uuid' })];
        _multimedia_decorators = [(0, typeorm_1.ManyToOne)(() => multimedia_entity_1.Multimedia, { nullable: true }), (0, typeorm_1.JoinColumn)({ name: 'multimediaId' })];
        _multimediaId_decorators = [(0, typeorm_1.Column)({ type: 'uuid', nullable: true })];
        _uploadedBy_decorators = [(0, typeorm_1.ManyToOne)(() => user_entity_1.User), (0, typeorm_1.JoinColumn)({ name: 'uploadedById' })];
        _uploadedById_decorators = [(0, typeorm_1.Column)({ type: 'uuid' })];
        _contract_decorators = [(0, typeorm_1.ManyToOne)(() => contract_entity_1.Contract, { nullable: true, onDelete: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'contractId' })];
        _contractId_decorators = [(0, typeorm_1.Column)({ type: 'uuid', nullable: true })];
        _payment_decorators = [(0, typeorm_1.ManyToOne)(() => payment_entity_1.Payment, { nullable: true, onDelete: 'SET NULL' }), (0, typeorm_1.JoinColumn)({ name: 'paymentId' })];
        _paymentId_decorators = [(0, typeorm_1.Column)({ type: 'uuid', nullable: true })];
        _status_decorators = [(0, typeorm_1.Column)({
                type: 'enum',
                enum: DocumentStatus,
                default: DocumentStatus.PENDING,
            })];
        _notes_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
        _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
        _deletedAt_decorators = [(0, typeorm_1.DeleteDateColumn)()];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _documentType_decorators, { kind: "field", name: "documentType", static: false, private: false, access: { has: obj => "documentType" in obj, get: obj => obj.documentType, set: (obj, value) => { obj.documentType = value; } }, metadata: _metadata }, _documentType_initializers, _documentType_extraInitializers);
        __esDecorate(null, null, _documentTypeId_decorators, { kind: "field", name: "documentTypeId", static: false, private: false, access: { has: obj => "documentTypeId" in obj, get: obj => obj.documentTypeId, set: (obj, value) => { obj.documentTypeId = value; } }, metadata: _metadata }, _documentTypeId_initializers, _documentTypeId_extraInitializers);
        __esDecorate(null, null, _multimedia_decorators, { kind: "field", name: "multimedia", static: false, private: false, access: { has: obj => "multimedia" in obj, get: obj => obj.multimedia, set: (obj, value) => { obj.multimedia = value; } }, metadata: _metadata }, _multimedia_initializers, _multimedia_extraInitializers);
        __esDecorate(null, null, _multimediaId_decorators, { kind: "field", name: "multimediaId", static: false, private: false, access: { has: obj => "multimediaId" in obj, get: obj => obj.multimediaId, set: (obj, value) => { obj.multimediaId = value; } }, metadata: _metadata }, _multimediaId_initializers, _multimediaId_extraInitializers);
        __esDecorate(null, null, _uploadedBy_decorators, { kind: "field", name: "uploadedBy", static: false, private: false, access: { has: obj => "uploadedBy" in obj, get: obj => obj.uploadedBy, set: (obj, value) => { obj.uploadedBy = value; } }, metadata: _metadata }, _uploadedBy_initializers, _uploadedBy_extraInitializers);
        __esDecorate(null, null, _uploadedById_decorators, { kind: "field", name: "uploadedById", static: false, private: false, access: { has: obj => "uploadedById" in obj, get: obj => obj.uploadedById, set: (obj, value) => { obj.uploadedById = value; } }, metadata: _metadata }, _uploadedById_initializers, _uploadedById_extraInitializers);
        __esDecorate(null, null, _contract_decorators, { kind: "field", name: "contract", static: false, private: false, access: { has: obj => "contract" in obj, get: obj => obj.contract, set: (obj, value) => { obj.contract = value; } }, metadata: _metadata }, _contract_initializers, _contract_extraInitializers);
        __esDecorate(null, null, _contractId_decorators, { kind: "field", name: "contractId", static: false, private: false, access: { has: obj => "contractId" in obj, get: obj => obj.contractId, set: (obj, value) => { obj.contractId = value; } }, metadata: _metadata }, _contractId_initializers, _contractId_extraInitializers);
        __esDecorate(null, null, _payment_decorators, { kind: "field", name: "payment", static: false, private: false, access: { has: obj => "payment" in obj, get: obj => obj.payment, set: (obj, value) => { obj.payment = value; } }, metadata: _metadata }, _payment_initializers, _payment_extraInitializers);
        __esDecorate(null, null, _paymentId_decorators, { kind: "field", name: "paymentId", static: false, private: false, access: { has: obj => "paymentId" in obj, get: obj => obj.paymentId, set: (obj, value) => { obj.paymentId = value; } }, metadata: _metadata }, _paymentId_initializers, _paymentId_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Document = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Document = _classThis;
})();
exports.Document = Document;
