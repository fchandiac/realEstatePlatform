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
exports.PropertyType = void 0;
const typeorm_1 = require("typeorm");
let PropertyType = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)('property_types')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _hasBedrooms_decorators;
    let _hasBedrooms_initializers = [];
    let _hasBedrooms_extraInitializers = [];
    let _hasBathrooms_decorators;
    let _hasBathrooms_initializers = [];
    let _hasBathrooms_extraInitializers = [];
    let _hasBuiltSquareMeters_decorators;
    let _hasBuiltSquareMeters_initializers = [];
    let _hasBuiltSquareMeters_extraInitializers = [];
    let _hasLandSquareMeters_decorators;
    let _hasLandSquareMeters_initializers = [];
    let _hasLandSquareMeters_extraInitializers = [];
    let _hasParkingSpaces_decorators;
    let _hasParkingSpaces_initializers = [];
    let _hasParkingSpaces_extraInitializers = [];
    let _hasFloors_decorators;
    let _hasFloors_initializers = [];
    let _hasFloors_extraInitializers = [];
    let _hasConstructionYear_decorators;
    let _hasConstructionYear_initializers = [];
    let _hasConstructionYear_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var PropertyType = _classThis = class {
        constructor() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.hasBedrooms = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _hasBedrooms_initializers, void 0));
            this.hasBathrooms = (__runInitializers(this, _hasBedrooms_extraInitializers), __runInitializers(this, _hasBathrooms_initializers, void 0));
            this.hasBuiltSquareMeters = (__runInitializers(this, _hasBathrooms_extraInitializers), __runInitializers(this, _hasBuiltSquareMeters_initializers, void 0));
            this.hasLandSquareMeters = (__runInitializers(this, _hasBuiltSquareMeters_extraInitializers), __runInitializers(this, _hasLandSquareMeters_initializers, void 0));
            this.hasParkingSpaces = (__runInitializers(this, _hasLandSquareMeters_extraInitializers), __runInitializers(this, _hasParkingSpaces_initializers, void 0));
            this.hasFloors = (__runInitializers(this, _hasParkingSpaces_extraInitializers), __runInitializers(this, _hasFloors_initializers, void 0));
            this.hasConstructionYear = (__runInitializers(this, _hasFloors_extraInitializers), __runInitializers(this, _hasConstructionYear_initializers, void 0));
            this.createdAt = (__runInitializers(this, _hasConstructionYear_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PropertyType");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _name_decorators = [(0, typeorm_1.Column)({ unique: true })];
        _description_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _hasBedrooms_decorators = [(0, typeorm_1.Column)({ default: false })];
        _hasBathrooms_decorators = [(0, typeorm_1.Column)({ default: false })];
        _hasBuiltSquareMeters_decorators = [(0, typeorm_1.Column)({ default: false })];
        _hasLandSquareMeters_decorators = [(0, typeorm_1.Column)({ default: false })];
        _hasParkingSpaces_decorators = [(0, typeorm_1.Column)({ default: false })];
        _hasFloors_decorators = [(0, typeorm_1.Column)({ default: false })];
        _hasConstructionYear_decorators = [(0, typeorm_1.Column)({ default: false })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
        _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
        _deletedAt_decorators = [(0, typeorm_1.DeleteDateColumn)()];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _hasBedrooms_decorators, { kind: "field", name: "hasBedrooms", static: false, private: false, access: { has: obj => "hasBedrooms" in obj, get: obj => obj.hasBedrooms, set: (obj, value) => { obj.hasBedrooms = value; } }, metadata: _metadata }, _hasBedrooms_initializers, _hasBedrooms_extraInitializers);
        __esDecorate(null, null, _hasBathrooms_decorators, { kind: "field", name: "hasBathrooms", static: false, private: false, access: { has: obj => "hasBathrooms" in obj, get: obj => obj.hasBathrooms, set: (obj, value) => { obj.hasBathrooms = value; } }, metadata: _metadata }, _hasBathrooms_initializers, _hasBathrooms_extraInitializers);
        __esDecorate(null, null, _hasBuiltSquareMeters_decorators, { kind: "field", name: "hasBuiltSquareMeters", static: false, private: false, access: { has: obj => "hasBuiltSquareMeters" in obj, get: obj => obj.hasBuiltSquareMeters, set: (obj, value) => { obj.hasBuiltSquareMeters = value; } }, metadata: _metadata }, _hasBuiltSquareMeters_initializers, _hasBuiltSquareMeters_extraInitializers);
        __esDecorate(null, null, _hasLandSquareMeters_decorators, { kind: "field", name: "hasLandSquareMeters", static: false, private: false, access: { has: obj => "hasLandSquareMeters" in obj, get: obj => obj.hasLandSquareMeters, set: (obj, value) => { obj.hasLandSquareMeters = value; } }, metadata: _metadata }, _hasLandSquareMeters_initializers, _hasLandSquareMeters_extraInitializers);
        __esDecorate(null, null, _hasParkingSpaces_decorators, { kind: "field", name: "hasParkingSpaces", static: false, private: false, access: { has: obj => "hasParkingSpaces" in obj, get: obj => obj.hasParkingSpaces, set: (obj, value) => { obj.hasParkingSpaces = value; } }, metadata: _metadata }, _hasParkingSpaces_initializers, _hasParkingSpaces_extraInitializers);
        __esDecorate(null, null, _hasFloors_decorators, { kind: "field", name: "hasFloors", static: false, private: false, access: { has: obj => "hasFloors" in obj, get: obj => obj.hasFloors, set: (obj, value) => { obj.hasFloors = value; } }, metadata: _metadata }, _hasFloors_initializers, _hasFloors_extraInitializers);
        __esDecorate(null, null, _hasConstructionYear_decorators, { kind: "field", name: "hasConstructionYear", static: false, private: false, access: { has: obj => "hasConstructionYear" in obj, get: obj => obj.hasConstructionYear, set: (obj, value) => { obj.hasConstructionYear = value; } }, metadata: _metadata }, _hasConstructionYear_initializers, _hasConstructionYear_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PropertyType = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PropertyType = _classThis;
})();
exports.PropertyType = PropertyType;
