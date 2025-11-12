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
exports.Identity = exports.FAQItem = exports.Partnership = exports.SocialMedia = exports.SocialMediaItem = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
let SocialMediaItem = (() => {
    var _a;
    let _url_decorators;
    let _url_initializers = [];
    let _url_extraInitializers = [];
    let _available_decorators;
    let _available_initializers = [];
    let _available_extraInitializers = [];
    return _a = class SocialMediaItem {
            constructor() {
                this.url = __runInitializers(this, _url_initializers, void 0);
                this.available = (__runInitializers(this, _url_extraInitializers), __runInitializers(this, _available_initializers, void 0));
                __runInitializers(this, _available_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _url_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _available_decorators = [(0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _url_decorators, { kind: "field", name: "url", static: false, private: false, access: { has: obj => "url" in obj, get: obj => obj.url, set: (obj, value) => { obj.url = value; } }, metadata: _metadata }, _url_initializers, _url_extraInitializers);
            __esDecorate(null, null, _available_decorators, { kind: "field", name: "available", static: false, private: false, access: { has: obj => "available" in obj, get: obj => obj.available, set: (obj, value) => { obj.available = value; } }, metadata: _metadata }, _available_initializers, _available_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.SocialMediaItem = SocialMediaItem;
let SocialMedia = (() => {
    var _a;
    let _instagram_decorators;
    let _instagram_initializers = [];
    let _instagram_extraInitializers = [];
    let _facebook_decorators;
    let _facebook_initializers = [];
    let _facebook_extraInitializers = [];
    let _linkedin_decorators;
    let _linkedin_initializers = [];
    let _linkedin_extraInitializers = [];
    let _youtube_decorators;
    let _youtube_initializers = [];
    let _youtube_extraInitializers = [];
    return _a = class SocialMedia {
            constructor() {
                this.instagram = __runInitializers(this, _instagram_initializers, void 0);
                this.facebook = (__runInitializers(this, _instagram_extraInitializers), __runInitializers(this, _facebook_initializers, void 0));
                this.linkedin = (__runInitializers(this, _facebook_extraInitializers), __runInitializers(this, _linkedin_initializers, void 0));
                this.youtube = (__runInitializers(this, _linkedin_extraInitializers), __runInitializers(this, _youtube_initializers, void 0));
                __runInitializers(this, _youtube_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _instagram_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(() => SocialMediaItem)];
            _facebook_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(() => SocialMediaItem)];
            _linkedin_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(() => SocialMediaItem)];
            _youtube_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(() => SocialMediaItem)];
            __esDecorate(null, null, _instagram_decorators, { kind: "field", name: "instagram", static: false, private: false, access: { has: obj => "instagram" in obj, get: obj => obj.instagram, set: (obj, value) => { obj.instagram = value; } }, metadata: _metadata }, _instagram_initializers, _instagram_extraInitializers);
            __esDecorate(null, null, _facebook_decorators, { kind: "field", name: "facebook", static: false, private: false, access: { has: obj => "facebook" in obj, get: obj => obj.facebook, set: (obj, value) => { obj.facebook = value; } }, metadata: _metadata }, _facebook_initializers, _facebook_extraInitializers);
            __esDecorate(null, null, _linkedin_decorators, { kind: "field", name: "linkedin", static: false, private: false, access: { has: obj => "linkedin" in obj, get: obj => obj.linkedin, set: (obj, value) => { obj.linkedin = value; } }, metadata: _metadata }, _linkedin_initializers, _linkedin_extraInitializers);
            __esDecorate(null, null, _youtube_decorators, { kind: "field", name: "youtube", static: false, private: false, access: { has: obj => "youtube" in obj, get: obj => obj.youtube, set: (obj, value) => { obj.youtube = value; } }, metadata: _metadata }, _youtube_initializers, _youtube_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.SocialMedia = SocialMedia;
let Partnership = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _logoUrl_decorators;
    let _logoUrl_initializers = [];
    let _logoUrl_extraInitializers = [];
    return _a = class Partnership {
            constructor() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.logoUrl = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _logoUrl_initializers, void 0));
                __runInitializers(this, _logoUrl_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _description_decorators = [(0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _logoUrl_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _logoUrl_decorators, { kind: "field", name: "logoUrl", static: false, private: false, access: { has: obj => "logoUrl" in obj, get: obj => obj.logoUrl, set: (obj, value) => { obj.logoUrl = value; } }, metadata: _metadata }, _logoUrl_initializers, _logoUrl_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.Partnership = Partnership;
let FAQItem = (() => {
    var _a;
    let _question_decorators;
    let _question_initializers = [];
    let _question_extraInitializers = [];
    let _answer_decorators;
    let _answer_initializers = [];
    let _answer_extraInitializers = [];
    return _a = class FAQItem {
            constructor() {
                this.question = __runInitializers(this, _question_initializers, void 0);
                this.answer = (__runInitializers(this, _question_extraInitializers), __runInitializers(this, _answer_initializers, void 0));
                __runInitializers(this, _answer_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _question_decorators = [(0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _answer_decorators = [(0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _question_decorators, { kind: "field", name: "question", static: false, private: false, access: { has: obj => "question" in obj, get: obj => obj.question, set: (obj, value) => { obj.question = value; } }, metadata: _metadata }, _question_initializers, _question_extraInitializers);
            __esDecorate(null, null, _answer_decorators, { kind: "field", name: "answer", static: false, private: false, access: { has: obj => "answer" in obj, get: obj => obj.answer, set: (obj, value) => { obj.answer = value; } }, metadata: _metadata }, _answer_initializers, _answer_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.FAQItem = FAQItem;
let Identity = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)('identities')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _address_decorators;
    let _address_initializers = [];
    let _address_extraInitializers = [];
    let _phone_decorators;
    let _phone_initializers = [];
    let _phone_extraInitializers = [];
    let _mail_decorators;
    let _mail_initializers = [];
    let _mail_extraInitializers = [];
    let _businessHours_decorators;
    let _businessHours_initializers = [];
    let _businessHours_extraInitializers = [];
    let _urlLogo_decorators;
    let _urlLogo_initializers = [];
    let _urlLogo_extraInitializers = [];
    let _socialMedia_decorators;
    let _socialMedia_initializers = [];
    let _socialMedia_extraInitializers = [];
    let _partnerships_decorators;
    let _partnerships_initializers = [];
    let _partnerships_extraInitializers = [];
    let _faqs_decorators;
    let _faqs_initializers = [];
    let _faqs_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var Identity = _classThis = class {
        constructor() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.address = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _address_initializers, void 0));
            this.phone = (__runInitializers(this, _address_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
            this.mail = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _mail_initializers, void 0));
            this.businessHours = (__runInitializers(this, _mail_extraInitializers), __runInitializers(this, _businessHours_initializers, void 0));
            this.urlLogo = (__runInitializers(this, _businessHours_extraInitializers), __runInitializers(this, _urlLogo_initializers, void 0));
            this.socialMedia = (__runInitializers(this, _urlLogo_extraInitializers), __runInitializers(this, _socialMedia_initializers, void 0));
            this.partnerships = (__runInitializers(this, _socialMedia_extraInitializers), __runInitializers(this, _partnerships_initializers, void 0));
            this.faqs = (__runInitializers(this, _partnerships_extraInitializers), __runInitializers(this, _faqs_initializers, void 0));
            this.createdAt = (__runInitializers(this, _faqs_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Identity");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _name_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255 }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
        _address_decorators = [(0, typeorm_1.Column)({ type: 'text' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
        _phone_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 20 }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
        _mail_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255 }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsEmail)()];
        _businessHours_decorators = [(0, typeorm_1.Column)({ type: 'text' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
        _urlLogo_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
        _socialMedia_decorators = [(0, typeorm_1.Column)({ type: 'json', nullable: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(() => SocialMedia)];
        _partnerships_decorators = [(0, typeorm_1.Column)({ type: 'json', nullable: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => Partnership)];
        _faqs_decorators = [(0, typeorm_1.Column)({ type: 'json', nullable: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => FAQItem)];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
        _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
        _deletedAt_decorators = [(0, typeorm_1.DeleteDateColumn)()];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: obj => "address" in obj, get: obj => obj.address, set: (obj, value) => { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
        __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: obj => "phone" in obj, get: obj => obj.phone, set: (obj, value) => { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
        __esDecorate(null, null, _mail_decorators, { kind: "field", name: "mail", static: false, private: false, access: { has: obj => "mail" in obj, get: obj => obj.mail, set: (obj, value) => { obj.mail = value; } }, metadata: _metadata }, _mail_initializers, _mail_extraInitializers);
        __esDecorate(null, null, _businessHours_decorators, { kind: "field", name: "businessHours", static: false, private: false, access: { has: obj => "businessHours" in obj, get: obj => obj.businessHours, set: (obj, value) => { obj.businessHours = value; } }, metadata: _metadata }, _businessHours_initializers, _businessHours_extraInitializers);
        __esDecorate(null, null, _urlLogo_decorators, { kind: "field", name: "urlLogo", static: false, private: false, access: { has: obj => "urlLogo" in obj, get: obj => obj.urlLogo, set: (obj, value) => { obj.urlLogo = value; } }, metadata: _metadata }, _urlLogo_initializers, _urlLogo_extraInitializers);
        __esDecorate(null, null, _socialMedia_decorators, { kind: "field", name: "socialMedia", static: false, private: false, access: { has: obj => "socialMedia" in obj, get: obj => obj.socialMedia, set: (obj, value) => { obj.socialMedia = value; } }, metadata: _metadata }, _socialMedia_initializers, _socialMedia_extraInitializers);
        __esDecorate(null, null, _partnerships_decorators, { kind: "field", name: "partnerships", static: false, private: false, access: { has: obj => "partnerships" in obj, get: obj => obj.partnerships, set: (obj, value) => { obj.partnerships = value; } }, metadata: _metadata }, _partnerships_initializers, _partnerships_extraInitializers);
        __esDecorate(null, null, _faqs_decorators, { kind: "field", name: "faqs", static: false, private: false, access: { has: obj => "faqs" in obj, get: obj => obj.faqs, set: (obj, value) => { obj.faqs = value; } }, metadata: _metadata }, _faqs_initializers, _faqs_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Identity = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Identity = _classThis;
})();
exports.Identity = Identity;
