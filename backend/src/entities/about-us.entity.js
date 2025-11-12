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
exports.AboutUs = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
let AboutUs = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)('about_us')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _bio_decorators;
    let _bio_initializers = [];
    let _bio_extraInitializers = [];
    let _mision_decorators;
    let _mision_initializers = [];
    let _mision_extraInitializers = [];
    let _vision_decorators;
    let _vision_initializers = [];
    let _vision_extraInitializers = [];
    let _multimediaUrl_decorators;
    let _multimediaUrl_initializers = [];
    let _multimediaUrl_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var AboutUs = _classThis = class {
        constructor() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.bio = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _bio_initializers, void 0));
            this.mision = (__runInitializers(this, _bio_extraInitializers), __runInitializers(this, _mision_initializers, void 0));
            this.vision = (__runInitializers(this, _mision_extraInitializers), __runInitializers(this, _vision_initializers, void 0));
            this.multimediaUrl = (__runInitializers(this, _vision_extraInitializers), __runInitializers(this, _multimediaUrl_initializers, void 0));
            this.createdAt = (__runInitializers(this, _multimediaUrl_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "AboutUs");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _bio_decorators = [(0, typeorm_1.Column)({ type: 'text' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
        _mision_decorators = [(0, typeorm_1.Column)({ type: 'text' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
        _vision_decorators = [(0, typeorm_1.Column)({ type: 'text' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
        _multimediaUrl_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
        _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
        _deletedAt_decorators = [(0, typeorm_1.DeleteDateColumn)()];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _bio_decorators, { kind: "field", name: "bio", static: false, private: false, access: { has: obj => "bio" in obj, get: obj => obj.bio, set: (obj, value) => { obj.bio = value; } }, metadata: _metadata }, _bio_initializers, _bio_extraInitializers);
        __esDecorate(null, null, _mision_decorators, { kind: "field", name: "mision", static: false, private: false, access: { has: obj => "mision" in obj, get: obj => obj.mision, set: (obj, value) => { obj.mision = value; } }, metadata: _metadata }, _mision_initializers, _mision_extraInitializers);
        __esDecorate(null, null, _vision_decorators, { kind: "field", name: "vision", static: false, private: false, access: { has: obj => "vision" in obj, get: obj => obj.vision, set: (obj, value) => { obj.vision = value; } }, metadata: _metadata }, _vision_initializers, _vision_extraInitializers);
        __esDecorate(null, null, _multimediaUrl_decorators, { kind: "field", name: "multimediaUrl", static: false, private: false, access: { has: obj => "multimediaUrl" in obj, get: obj => obj.multimediaUrl, set: (obj, value) => { obj.multimediaUrl = value; } }, metadata: _metadata }, _multimediaUrl_initializers, _multimediaUrl_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AboutUs = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AboutUs = _classThis;
})();
exports.AboutUs = AboutUs;
