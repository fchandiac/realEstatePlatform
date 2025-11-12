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
exports.User = exports.Permission = exports.UserRole = exports.UserStatus = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const bcrypt = require("bcrypt");
const property_entity_1 = require("./property.entity");
const contract_entity_1 = require("./contract.entity");
const document_entity_1 = require("./document.entity");
const notification_entity_1 = require("./notification.entity");
const article_entity_1 = require("./article.entity");
const testimonial_entity_1 = require("./testimonial.entity");
const person_entity_1 = require("./person.entity");
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "ACTIVE";
    UserStatus["INACTIVE"] = "INACTIVE";
    UserStatus["VACATION"] = "VACATION";
    UserStatus["LEAVE"] = "LEAVE";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["AGENT"] = "AGENT";
    UserRole["COMMUNITY"] = "COMMUNITY";
})(UserRole || (exports.UserRole = UserRole = {}));
var Permission;
(function (Permission) {
    Permission["MANAGE_USERS"] = "MANAGE_USERS";
    Permission["MANAGE_AGENTS"] = "MANAGE_AGENTS";
    Permission["MANAGE_ADMINS"] = "MANAGE_ADMINS";
    Permission["MANAGE_PROPERTIES"] = "MANAGE_PROPERTIES";
    Permission["ASSIGN_PROPERTY_AGENT"] = "ASSIGN_PROPERTY_AGENT";
    Permission["MANAGE_CONTRACTS"] = "MANAGE_CONTRACTS";
    Permission["MANAGE_NOTIFICATIONS"] = "MANAGE_NOTIFICATIONS";
    Permission["MANAGE_MULTIMEDIA"] = "MANAGE_MULTIMEDIA";
    Permission["MANAGE_DOCUMENT_TYPES"] = "MANAGE_DOCUMENT_TYPES";
    Permission["MANAGE_PROPERTY_TYPES"] = "MANAGE_PROPERTY_TYPES";
    Permission["MANAGE_ARTICLES"] = "MANAGE_ARTICLES";
    Permission["MANAGE_TESTIMONIALS"] = "MANAGE_TESTIMONIALS";
    Permission["VIEW_REPORTS"] = "VIEW_REPORTS";
    Permission["SUPER_ADMIN"] = "SUPER_ADMIN";
})(Permission || (exports.Permission = Permission = {}));
let User = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)('users')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _username_decorators;
    let _username_initializers = [];
    let _username_extraInitializers = [];
    let _email_decorators;
    let _email_initializers = [];
    let _email_extraInitializers = [];
    let _password_decorators;
    let _password_initializers = [];
    let _password_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _role_decorators;
    let _role_initializers = [];
    let _role_extraInitializers = [];
    let _permissions_decorators;
    let _permissions_initializers = [];
    let _permissions_extraInitializers = [];
    let _personalInfo_decorators;
    let _personalInfo_initializers = [];
    let _personalInfo_extraInitializers = [];
    let _favoriteProperties_decorators;
    let _favoriteProperties_initializers = [];
    let _favoriteProperties_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _lastLogin_decorators;
    let _lastLogin_initializers = [];
    let _lastLogin_extraInitializers = [];
    let _personId_decorators;
    let _personId_initializers = [];
    let _personId_extraInitializers = [];
    let _createdProperties_decorators;
    let _createdProperties_initializers = [];
    let _createdProperties_extraInitializers = [];
    let _assignedProperties_decorators;
    let _assignedProperties_initializers = [];
    let _assignedProperties_extraInitializers = [];
    let _agentContracts_decorators;
    let _agentContracts_initializers = [];
    let _agentContracts_extraInitializers = [];
    let _buyerContracts_decorators;
    let _buyerContracts_initializers = [];
    let _buyerContracts_extraInitializers = [];
    let _sellerContracts_decorators;
    let _sellerContracts_initializers = [];
    let _sellerContracts_extraInitializers = [];
    let _uploadedDocuments_decorators;
    let _uploadedDocuments_initializers = [];
    let _uploadedDocuments_extraInitializers = [];
    let _notifications_decorators;
    let _notifications_initializers = [];
    let _notifications_extraInitializers = [];
    let _articles_decorators;
    let _articles_initializers = [];
    let _articles_extraInitializers = [];
    let _testimonials_decorators;
    let _testimonials_initializers = [];
    let _testimonials_extraInitializers = [];
    let _person_decorators;
    let _person_initializers = [];
    let _person_extraInitializers = [];
    var User = _classThis = class {
        // Authentication methods
        async setPassword(plainPassword) {
            this.password = await bcrypt.hash(plainPassword, 12);
        }
        async validatePassword(plainPassword) {
            return await bcrypt.compare(plainPassword, this.password);
        }
        get name() {
            if (this.personalInfo?.firstName && this.personalInfo?.lastName) {
                return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`;
            }
            return this.username;
        }
        constructor() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.username = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _username_initializers, void 0));
            this.email = (__runInitializers(this, _username_extraInitializers), __runInitializers(this, _email_initializers, void 0));
            this.password = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _password_initializers, void 0));
            this.status = (__runInitializers(this, _password_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.role = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _role_initializers, void 0));
            this.permissions = (__runInitializers(this, _role_extraInitializers), __runInitializers(this, _permissions_initializers, void 0));
            this.personalInfo = (__runInitializers(this, _permissions_extraInitializers), __runInitializers(this, _personalInfo_initializers, void 0));
            this.favoriteProperties = (__runInitializers(this, _personalInfo_extraInitializers), __runInitializers(this, _favoriteProperties_initializers, void 0));
            this.createdAt = (__runInitializers(this, _favoriteProperties_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.lastLogin = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _lastLogin_initializers, void 0));
            this.personId = (__runInitializers(this, _lastLogin_extraInitializers), __runInitializers(this, _personId_initializers, void 0));
            // Relaciones navegables (OneToMany)
            this.createdProperties = (__runInitializers(this, _personId_extraInitializers), __runInitializers(this, _createdProperties_initializers, void 0));
            this.assignedProperties = (__runInitializers(this, _createdProperties_extraInitializers), __runInitializers(this, _assignedProperties_initializers, void 0));
            this.agentContracts = (__runInitializers(this, _assignedProperties_extraInitializers), __runInitializers(this, _agentContracts_initializers, void 0));
            // buyerContracts & sellerContracts are modeled via Contract.people JSON in the current schema,
            // keep placeholder relations if in future Contract stores explicit buyerId/sellerId
            this.buyerContracts = (__runInitializers(this, _agentContracts_extraInitializers), __runInitializers(this, _buyerContracts_initializers, void 0));
            this.sellerContracts = (__runInitializers(this, _buyerContracts_extraInitializers), __runInitializers(this, _sellerContracts_initializers, void 0));
            this.uploadedDocuments = (__runInitializers(this, _sellerContracts_extraInitializers), __runInitializers(this, _uploadedDocuments_initializers, void 0));
            this.notifications = (__runInitializers(this, _uploadedDocuments_extraInitializers), __runInitializers(this, _notifications_initializers, void 0));
            this.articles = (__runInitializers(this, _notifications_extraInitializers), __runInitializers(this, _articles_initializers, void 0));
            this.testimonials = (__runInitializers(this, _articles_extraInitializers), __runInitializers(this, _testimonials_initializers, void 0));
            // Relación con Person
            this.person = (__runInitializers(this, _testimonials_extraInitializers), __runInitializers(this, _person_initializers, void 0));
            __runInitializers(this, _person_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "User");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _username_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
        _email_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsEmail)()];
        _password_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255 }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
        _status_decorators = [(0, typeorm_1.Column)({
                type: 'enum',
                enum: UserStatus,
                default: UserStatus.ACTIVE,
            }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsEnum)(UserStatus)];
        _role_decorators = [(0, typeorm_1.Column)({
                type: 'enum',
                enum: UserRole,
                default: UserRole.COMMUNITY,
            }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsEnum)(UserRole)];
        _permissions_decorators = [(0, typeorm_1.Column)({ type: 'json', nullable: true }), (0, class_validator_1.IsOptional)()];
        _personalInfo_decorators = [(0, typeorm_1.Column)({ type: 'json', nullable: true }), (0, class_validator_1.IsOptional)()];
        _favoriteProperties_decorators = [(0, typeorm_1.Column)({ type: 'json', nullable: true }), (0, class_validator_1.IsOptional)()];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
        _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
        _deletedAt_decorators = [(0, typeorm_1.DeleteDateColumn)()];
        _lastLogin_decorators = [(0, typeorm_1.Column)({ type: 'timestamp', nullable: true })];
        _personId_decorators = [(0, typeorm_1.Column)({ type: 'uuid', nullable: true })];
        _createdProperties_decorators = [(0, typeorm_1.OneToMany)(() => property_entity_1.Property, (p) => p.creatorUser)];
        _assignedProperties_decorators = [(0, typeorm_1.OneToMany)(() => property_entity_1.Property, (p) => p.assignedAgent)];
        _agentContracts_decorators = [(0, typeorm_1.OneToMany)(() => contract_entity_1.Contract, (c) => c.user)];
        _buyerContracts_decorators = [(0, typeorm_1.OneToMany)(() => contract_entity_1.Contract, (c) => c.property)];
        _sellerContracts_decorators = [(0, typeorm_1.OneToMany)(() => contract_entity_1.Contract, (c) => c.property)];
        _uploadedDocuments_decorators = [(0, typeorm_1.OneToMany)(() => document_entity_1.Document, (d) => d.uploadedBy)];
        _notifications_decorators = [(0, typeorm_1.OneToMany)(() => notification_entity_1.Notification, (n) => n.viewer)];
        _articles_decorators = [(0, typeorm_1.OneToMany)(() => article_entity_1.Article, (a) => a.id)];
        _testimonials_decorators = [(0, typeorm_1.OneToMany)(() => testimonial_entity_1.Testimonial, (t) => t.id)];
        _person_decorators = [(0, typeorm_1.OneToOne)(() => person_entity_1.Person, { nullable: true }), (0, typeorm_1.JoinColumn)({ name: 'personId' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _username_decorators, { kind: "field", name: "username", static: false, private: false, access: { has: obj => "username" in obj, get: obj => obj.username, set: (obj, value) => { obj.username = value; } }, metadata: _metadata }, _username_initializers, _username_extraInitializers);
        __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: obj => "email" in obj, get: obj => obj.email, set: (obj, value) => { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
        __esDecorate(null, null, _password_decorators, { kind: "field", name: "password", static: false, private: false, access: { has: obj => "password" in obj, get: obj => obj.password, set: (obj, value) => { obj.password = value; } }, metadata: _metadata }, _password_initializers, _password_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: obj => "role" in obj, get: obj => obj.role, set: (obj, value) => { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
        __esDecorate(null, null, _permissions_decorators, { kind: "field", name: "permissions", static: false, private: false, access: { has: obj => "permissions" in obj, get: obj => obj.permissions, set: (obj, value) => { obj.permissions = value; } }, metadata: _metadata }, _permissions_initializers, _permissions_extraInitializers);
        __esDecorate(null, null, _personalInfo_decorators, { kind: "field", name: "personalInfo", static: false, private: false, access: { has: obj => "personalInfo" in obj, get: obj => obj.personalInfo, set: (obj, value) => { obj.personalInfo = value; } }, metadata: _metadata }, _personalInfo_initializers, _personalInfo_extraInitializers);
        __esDecorate(null, null, _favoriteProperties_decorators, { kind: "field", name: "favoriteProperties", static: false, private: false, access: { has: obj => "favoriteProperties" in obj, get: obj => obj.favoriteProperties, set: (obj, value) => { obj.favoriteProperties = value; } }, metadata: _metadata }, _favoriteProperties_initializers, _favoriteProperties_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _lastLogin_decorators, { kind: "field", name: "lastLogin", static: false, private: false, access: { has: obj => "lastLogin" in obj, get: obj => obj.lastLogin, set: (obj, value) => { obj.lastLogin = value; } }, metadata: _metadata }, _lastLogin_initializers, _lastLogin_extraInitializers);
        __esDecorate(null, null, _personId_decorators, { kind: "field", name: "personId", static: false, private: false, access: { has: obj => "personId" in obj, get: obj => obj.personId, set: (obj, value) => { obj.personId = value; } }, metadata: _metadata }, _personId_initializers, _personId_extraInitializers);
        __esDecorate(null, null, _createdProperties_decorators, { kind: "field", name: "createdProperties", static: false, private: false, access: { has: obj => "createdProperties" in obj, get: obj => obj.createdProperties, set: (obj, value) => { obj.createdProperties = value; } }, metadata: _metadata }, _createdProperties_initializers, _createdProperties_extraInitializers);
        __esDecorate(null, null, _assignedProperties_decorators, { kind: "field", name: "assignedProperties", static: false, private: false, access: { has: obj => "assignedProperties" in obj, get: obj => obj.assignedProperties, set: (obj, value) => { obj.assignedProperties = value; } }, metadata: _metadata }, _assignedProperties_initializers, _assignedProperties_extraInitializers);
        __esDecorate(null, null, _agentContracts_decorators, { kind: "field", name: "agentContracts", static: false, private: false, access: { has: obj => "agentContracts" in obj, get: obj => obj.agentContracts, set: (obj, value) => { obj.agentContracts = value; } }, metadata: _metadata }, _agentContracts_initializers, _agentContracts_extraInitializers);
        __esDecorate(null, null, _buyerContracts_decorators, { kind: "field", name: "buyerContracts", static: false, private: false, access: { has: obj => "buyerContracts" in obj, get: obj => obj.buyerContracts, set: (obj, value) => { obj.buyerContracts = value; } }, metadata: _metadata }, _buyerContracts_initializers, _buyerContracts_extraInitializers);
        __esDecorate(null, null, _sellerContracts_decorators, { kind: "field", name: "sellerContracts", static: false, private: false, access: { has: obj => "sellerContracts" in obj, get: obj => obj.sellerContracts, set: (obj, value) => { obj.sellerContracts = value; } }, metadata: _metadata }, _sellerContracts_initializers, _sellerContracts_extraInitializers);
        __esDecorate(null, null, _uploadedDocuments_decorators, { kind: "field", name: "uploadedDocuments", static: false, private: false, access: { has: obj => "uploadedDocuments" in obj, get: obj => obj.uploadedDocuments, set: (obj, value) => { obj.uploadedDocuments = value; } }, metadata: _metadata }, _uploadedDocuments_initializers, _uploadedDocuments_extraInitializers);
        __esDecorate(null, null, _notifications_decorators, { kind: "field", name: "notifications", static: false, private: false, access: { has: obj => "notifications" in obj, get: obj => obj.notifications, set: (obj, value) => { obj.notifications = value; } }, metadata: _metadata }, _notifications_initializers, _notifications_extraInitializers);
        __esDecorate(null, null, _articles_decorators, { kind: "field", name: "articles", static: false, private: false, access: { has: obj => "articles" in obj, get: obj => obj.articles, set: (obj, value) => { obj.articles = value; } }, metadata: _metadata }, _articles_initializers, _articles_extraInitializers);
        __esDecorate(null, null, _testimonials_decorators, { kind: "field", name: "testimonials", static: false, private: false, access: { has: obj => "testimonials" in obj, get: obj => obj.testimonials, set: (obj, value) => { obj.testimonials = value; } }, metadata: _metadata }, _testimonials_initializers, _testimonials_extraInitializers);
        __esDecorate(null, null, _person_decorators, { kind: "field", name: "person", static: false, private: false, access: { has: obj => "person" in obj, get: obj => obj.person, set: (obj, value) => { obj.person = value; } }, metadata: _metadata }, _person_initializers, _person_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        User = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return User = _classThis;
})();
exports.User = User;
