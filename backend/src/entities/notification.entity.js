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
exports.Notification = exports.NotificationStatus = exports.NotificationType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const multimedia_entity_1 = require("./multimedia.entity");
var NotificationType;
(function (NotificationType) {
    NotificationType["INTERES"] = "INTERES";
    NotificationType["CONTACTO"] = "CONTACTO";
    NotificationType["COMPROBANTE_DE_PAGO"] = "COMPROBANTE_DE_PAGO";
    NotificationType["AVISO_PAGO_VENCIDO"] = "AVISO_PAGO_VENCIDO";
    NotificationType["CAMBIO_ESTADO_PUBLICACION"] = "CAMBIO_ESTADO_PUBLICACION";
    NotificationType["CAMBIO_ESTADO_CONTRATO"] = "CAMBIO_ESTADO_CONTRATO";
    NotificationType["NUEVA_ASIGNACION_PROPIEDAD_AGENTE"] = "NUEVA_ASIGNACION_PROPIEDAD_AGENTE";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var NotificationStatus;
(function (NotificationStatus) {
    NotificationStatus["SEND"] = "SEND";
    NotificationStatus["OPEN"] = "OPEN";
})(NotificationStatus || (exports.NotificationStatus = NotificationStatus = {}));
let Notification = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)('notifications')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _targetUserIds_decorators;
    let _targetUserIds_initializers = [];
    let _targetUserIds_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _targetMails_decorators;
    let _targetMails_initializers = [];
    let _targetMails_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _multimedia_decorators;
    let _multimedia_initializers = [];
    let _multimedia_extraInitializers = [];
    let _viewer_decorators;
    let _viewer_initializers = [];
    let _viewer_extraInitializers = [];
    var Notification = _classThis = class {
        constructor() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.targetUserIds = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _targetUserIds_initializers, void 0));
            this.type = (__runInitializers(this, _targetUserIds_extraInitializers), __runInitializers(this, _type_initializers, void 0));
            this.targetMails = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _targetMails_initializers, void 0));
            this.status = (__runInitializers(this, _targetMails_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.createdAt = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            // Relations
            this.multimedia = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _multimedia_initializers, void 0));
            this.viewer = (__runInitializers(this, _multimedia_extraInitializers), __runInitializers(this, _viewer_initializers, void 0));
            __runInitializers(this, _viewer_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Notification");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _targetUserIds_decorators = [(0, typeorm_1.Column)({ type: 'json' })];
        _type_decorators = [(0, typeorm_1.Column)({
                type: 'enum',
                enum: NotificationType,
            })];
        _targetMails_decorators = [(0, typeorm_1.Column)({ type: 'json', nullable: true })];
        _status_decorators = [(0, typeorm_1.Column)({
                type: 'enum',
                enum: NotificationStatus,
                default: NotificationStatus.SEND,
            })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
        _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
        _deletedAt_decorators = [(0, typeorm_1.DeleteDateColumn)()];
        _multimedia_decorators = [(0, typeorm_1.ManyToOne)(() => multimedia_entity_1.Multimedia), (0, typeorm_1.JoinColumn)({ name: 'multimediaId' })];
        _viewer_decorators = [(0, typeorm_1.ManyToOne)(() => user_entity_1.User), (0, typeorm_1.JoinColumn)({ name: 'viewerId' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _targetUserIds_decorators, { kind: "field", name: "targetUserIds", static: false, private: false, access: { has: obj => "targetUserIds" in obj, get: obj => obj.targetUserIds, set: (obj, value) => { obj.targetUserIds = value; } }, metadata: _metadata }, _targetUserIds_initializers, _targetUserIds_extraInitializers);
        __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
        __esDecorate(null, null, _targetMails_decorators, { kind: "field", name: "targetMails", static: false, private: false, access: { has: obj => "targetMails" in obj, get: obj => obj.targetMails, set: (obj, value) => { obj.targetMails = value; } }, metadata: _metadata }, _targetMails_initializers, _targetMails_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _multimedia_decorators, { kind: "field", name: "multimedia", static: false, private: false, access: { has: obj => "multimedia" in obj, get: obj => obj.multimedia, set: (obj, value) => { obj.multimedia = value; } }, metadata: _metadata }, _multimedia_initializers, _multimedia_extraInitializers);
        __esDecorate(null, null, _viewer_decorators, { kind: "field", name: "viewer", static: false, private: false, access: { has: obj => "viewer" in obj, get: obj => obj.viewer, set: (obj, value) => { obj.viewer = value; } }, metadata: _metadata }, _viewer_initializers, _viewer_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Notification = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Notification = _classThis;
})();
exports.Notification = Notification;
