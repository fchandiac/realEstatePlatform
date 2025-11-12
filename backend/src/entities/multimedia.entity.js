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
exports.Multimedia = exports.MultimediaType = exports.MultimediaFormat = void 0;
const typeorm_1 = require("typeorm");
const property_entity_1 = require("./property.entity");
var MultimediaFormat;
(function (MultimediaFormat) {
    MultimediaFormat["IMG"] = "IMG";
    MultimediaFormat["VIDEO"] = "VIDEO";
})(MultimediaFormat || (exports.MultimediaFormat = MultimediaFormat = {}));
var MultimediaType;
(function (MultimediaType) {
    MultimediaType["DNI_FRONT"] = "DNI_FRONT";
    MultimediaType["DNI_REAR"] = "DNI_REAR";
    MultimediaType["SLIDE"] = "SLIDE";
    MultimediaType["LOGO"] = "LOGO";
    MultimediaType["STAFF"] = "STAFF";
    MultimediaType["PROPERTY_IMG"] = "PROPERTY_IMG";
    MultimediaType["PROPERTY_VIDEO"] = "PROPERTY_VIDEO";
    MultimediaType["PARTNERSHIP"] = "PARTNERSHIP";
    MultimediaType["DOCUMENT"] = "DOCUMENT";
    MultimediaType["TESTIMONIAL_IMG"] = "TESTIMONIAL_IMG";
    MultimediaType["SLIDER"] = "SLIDER";
})(MultimediaType || (exports.MultimediaType = MultimediaType = {}));
let Multimedia = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)('multimedia')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _format_decorators;
    let _format_initializers = [];
    let _format_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _url_decorators;
    let _url_initializers = [];
    let _url_extraInitializers = [];
    let _seoTitle_decorators;
    let _seoTitle_initializers = [];
    let _seoTitle_extraInitializers = [];
    let _filename_decorators;
    let _filename_initializers = [];
    let _filename_extraInitializers = [];
    let _fileSize_decorators;
    let _fileSize_initializers = [];
    let _fileSize_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _property_decorators;
    let _property_initializers = [];
    let _property_extraInitializers = [];
    let _propertyId_decorators;
    let _propertyId_initializers = [];
    let _propertyId_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var Multimedia = _classThis = class {
        constructor() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.format = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _format_initializers, void 0));
            this.type = (__runInitializers(this, _format_extraInitializers), __runInitializers(this, _type_initializers, void 0));
            this.url = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _url_initializers, void 0));
            this.seoTitle = (__runInitializers(this, _url_extraInitializers), __runInitializers(this, _seoTitle_initializers, void 0));
            this.filename = (__runInitializers(this, _seoTitle_extraInitializers), __runInitializers(this, _filename_initializers, void 0));
            this.fileSize = (__runInitializers(this, _filename_extraInitializers), __runInitializers(this, _fileSize_initializers, void 0));
            this.description = (__runInitializers(this, _fileSize_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.userId = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.property = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _property_initializers, void 0));
            this.propertyId = (__runInitializers(this, _property_extraInitializers), __runInitializers(this, _propertyId_initializers, void 0));
            this.createdAt = (__runInitializers(this, _propertyId_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Multimedia");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _format_decorators = [(0, typeorm_1.Column)({
                type: 'enum',
                enum: MultimediaFormat,
            })];
        _type_decorators = [(0, typeorm_1.Column)({
                type: 'enum',
                enum: MultimediaType,
            })];
        _url_decorators = [(0, typeorm_1.Column)()];
        _seoTitle_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _filename_decorators = [(0, typeorm_1.Column)()];
        _fileSize_decorators = [(0, typeorm_1.Column)('int')];
        _description_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _userId_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _property_decorators = [(0, typeorm_1.ManyToOne)(() => property_entity_1.Property, { nullable: true, onDelete: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'propertyId' })];
        _propertyId_decorators = [(0, typeorm_1.Column)({ type: 'uuid', nullable: true })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
        _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
        _deletedAt_decorators = [(0, typeorm_1.DeleteDateColumn)()];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _format_decorators, { kind: "field", name: "format", static: false, private: false, access: { has: obj => "format" in obj, get: obj => obj.format, set: (obj, value) => { obj.format = value; } }, metadata: _metadata }, _format_initializers, _format_extraInitializers);
        __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
        __esDecorate(null, null, _url_decorators, { kind: "field", name: "url", static: false, private: false, access: { has: obj => "url" in obj, get: obj => obj.url, set: (obj, value) => { obj.url = value; } }, metadata: _metadata }, _url_initializers, _url_extraInitializers);
        __esDecorate(null, null, _seoTitle_decorators, { kind: "field", name: "seoTitle", static: false, private: false, access: { has: obj => "seoTitle" in obj, get: obj => obj.seoTitle, set: (obj, value) => { obj.seoTitle = value; } }, metadata: _metadata }, _seoTitle_initializers, _seoTitle_extraInitializers);
        __esDecorate(null, null, _filename_decorators, { kind: "field", name: "filename", static: false, private: false, access: { has: obj => "filename" in obj, get: obj => obj.filename, set: (obj, value) => { obj.filename = value; } }, metadata: _metadata }, _filename_initializers, _filename_extraInitializers);
        __esDecorate(null, null, _fileSize_decorators, { kind: "field", name: "fileSize", static: false, private: false, access: { has: obj => "fileSize" in obj, get: obj => obj.fileSize, set: (obj, value) => { obj.fileSize = value; } }, metadata: _metadata }, _fileSize_initializers, _fileSize_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _property_decorators, { kind: "field", name: "property", static: false, private: false, access: { has: obj => "property" in obj, get: obj => obj.property, set: (obj, value) => { obj.property = value; } }, metadata: _metadata }, _property_initializers, _property_extraInitializers);
        __esDecorate(null, null, _propertyId_decorators, { kind: "field", name: "propertyId", static: false, private: false, access: { has: obj => "propertyId" in obj, get: obj => obj.propertyId, set: (obj, value) => { obj.propertyId = value; } }, metadata: _metadata }, _propertyId_initializers, _propertyId_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Multimedia = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Multimedia = _classThis;
})();
exports.Multimedia = Multimedia;
