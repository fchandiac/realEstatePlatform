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
exports.Property = exports.CurrencyPriceEnum = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const user_entity_1 = require("./user.entity");
const property_status_enum_1 = require("../common/enums/property-status.enum");
const property_operation_type_enum_1 = require("../common/enums/property-operation-type.enum");
const multimedia_entity_1 = require("./multimedia.entity");
const regions_enum_1 = require("../common/regions/regions.enum");
const comunas_enum_1 = require("../common/regions/comunas.enum");
const property_type_entity_1 = require("./property-type.entity");
var CurrencyPriceEnum;
(function (CurrencyPriceEnum) {
    CurrencyPriceEnum["CLP"] = "CLP";
    CurrencyPriceEnum["UF"] = "UF";
})(CurrencyPriceEnum || (exports.CurrencyPriceEnum = CurrencyPriceEnum = {}));
let Property = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)('properties')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _operationType_decorators;
    let _operationType_initializers = [];
    let _operationType_extraInitializers = [];
    let _creatorUser_decorators;
    let _creatorUser_initializers = [];
    let _creatorUser_extraInitializers = [];
    let _creatorUserId_decorators;
    let _creatorUserId_initializers = [];
    let _creatorUserId_extraInitializers = [];
    let _assignedAgent_decorators;
    let _assignedAgent_initializers = [];
    let _assignedAgent_extraInitializers = [];
    let _assignedAgentId_decorators;
    let _assignedAgentId_initializers = [];
    let _assignedAgentId_extraInitializers = [];
    let _price_decorators;
    let _price_initializers = [];
    let _price_extraInitializers = [];
    let _currencyPrice_decorators;
    let _currencyPrice_initializers = [];
    let _currencyPrice_extraInitializers = [];
    let _seoTitle_decorators;
    let _seoTitle_initializers = [];
    let _seoTitle_extraInitializers = [];
    let _seoDescription_decorators;
    let _seoDescription_initializers = [];
    let _seoDescription_extraInitializers = [];
    let _seoKeywords_decorators;
    let _seoKeywords_initializers = [];
    let _seoKeywords_extraInitializers = [];
    let _publicationDate_decorators;
    let _publicationDate_initializers = [];
    let _publicationDate_extraInitializers = [];
    let _isFeatured_decorators;
    let _isFeatured_initializers = [];
    let _isFeatured_extraInitializers = [];
    let _propertyType_decorators;
    let _propertyType_initializers = [];
    let _propertyType_extraInitializers = [];
    let _propertyTypeId_decorators;
    let _propertyTypeId_initializers = [];
    let _propertyTypeId_extraInitializers = [];
    let _builtSquareMeters_decorators;
    let _builtSquareMeters_initializers = [];
    let _builtSquareMeters_extraInitializers = [];
    let _landSquareMeters_decorators;
    let _landSquareMeters_initializers = [];
    let _landSquareMeters_extraInitializers = [];
    let _bedrooms_decorators;
    let _bedrooms_initializers = [];
    let _bedrooms_extraInitializers = [];
    let _bathrooms_decorators;
    let _bathrooms_initializers = [];
    let _bathrooms_extraInitializers = [];
    let _parkingSpaces_decorators;
    let _parkingSpaces_initializers = [];
    let _parkingSpaces_extraInitializers = [];
    let _floors_decorators;
    let _floors_initializers = [];
    let _floors_extraInitializers = [];
    let _constructionYear_decorators;
    let _constructionYear_initializers = [];
    let _constructionYear_extraInitializers = [];
    let _state_decorators;
    let _state_initializers = [];
    let _state_extraInitializers = [];
    let _city_decorators;
    let _city_initializers = [];
    let _city_extraInitializers = [];
    let _address_decorators;
    let _address_initializers = [];
    let _address_extraInitializers = [];
    let _latitude_decorators;
    let _latitude_initializers = [];
    let _latitude_extraInitializers = [];
    let _longitude_decorators;
    let _longitude_initializers = [];
    let _longitude_extraInitializers = [];
    let _multimedia_decorators;
    let _multimedia_initializers = [];
    let _multimedia_extraInitializers = [];
    let _mainImageUrl_decorators;
    let _mainImageUrl_initializers = [];
    let _mainImageUrl_extraInitializers = [];
    let _postRequest_decorators;
    let _postRequest_initializers = [];
    let _postRequest_extraInitializers = [];
    let _changeHistory_decorators;
    let _changeHistory_initializers = [];
    let _changeHistory_extraInitializers = [];
    let _views_decorators;
    let _views_initializers = [];
    let _views_extraInitializers = [];
    let _leads_decorators;
    let _leads_initializers = [];
    let _leads_extraInitializers = [];
    let _internalNotes_decorators;
    let _internalNotes_initializers = [];
    let _internalNotes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _publishedAt_decorators;
    let _publishedAt_initializers = [];
    let _publishedAt_extraInitializers = [];
    let _lastModifiedAt_decorators;
    let _lastModifiedAt_initializers = [];
    let _lastModifiedAt_extraInitializers = [];
    var Property = _classThis = class {
        constructor() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            // Basic Information
            this.title = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.status = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.operationType = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _operationType_initializers, void 0));
            // Users Relations
            this.creatorUser = (__runInitializers(this, _operationType_extraInitializers), __runInitializers(this, _creatorUser_initializers, void 0));
            this.creatorUserId = (__runInitializers(this, _creatorUser_extraInitializers), __runInitializers(this, _creatorUserId_initializers, void 0));
            this.assignedAgent = (__runInitializers(this, _creatorUserId_extraInitializers), __runInitializers(this, _assignedAgent_initializers, void 0));
            this.assignedAgentId = (__runInitializers(this, _assignedAgent_extraInitializers), __runInitializers(this, _assignedAgentId_initializers, void 0));
            // Pricing Information
            this.price = (__runInitializers(this, _assignedAgentId_extraInitializers), __runInitializers(this, _price_initializers, void 0));
            this.currencyPrice = (__runInitializers(this, _price_extraInitializers), __runInitializers(this, _currencyPrice_initializers, void 0));
            // SEO Information
            this.seoTitle = (__runInitializers(this, _currencyPrice_extraInitializers), __runInitializers(this, _seoTitle_initializers, void 0));
            this.seoDescription = (__runInitializers(this, _seoTitle_extraInitializers), __runInitializers(this, _seoDescription_initializers, void 0));
            this.seoKeywords = (__runInitializers(this, _seoDescription_extraInitializers), __runInitializers(this, _seoKeywords_initializers, void 0));
            // Publication Information
            this.publicationDate = (__runInitializers(this, _seoKeywords_extraInitializers), __runInitializers(this, _publicationDate_initializers, void 0));
            this.isFeatured = (__runInitializers(this, _publicationDate_extraInitializers), __runInitializers(this, _isFeatured_initializers, void 0));
            // Physical Characteristics
            this.propertyType = (__runInitializers(this, _isFeatured_extraInitializers), __runInitializers(this, _propertyType_initializers, void 0));
            this.propertyTypeId = (__runInitializers(this, _propertyType_extraInitializers), __runInitializers(this, _propertyTypeId_initializers, void 0));
            this.builtSquareMeters = (__runInitializers(this, _propertyTypeId_extraInitializers), __runInitializers(this, _builtSquareMeters_initializers, void 0));
            this.landSquareMeters = (__runInitializers(this, _builtSquareMeters_extraInitializers), __runInitializers(this, _landSquareMeters_initializers, void 0));
            this.bedrooms = (__runInitializers(this, _landSquareMeters_extraInitializers), __runInitializers(this, _bedrooms_initializers, void 0));
            this.bathrooms = (__runInitializers(this, _bedrooms_extraInitializers), __runInitializers(this, _bathrooms_initializers, void 0));
            this.parkingSpaces = (__runInitializers(this, _bathrooms_extraInitializers), __runInitializers(this, _parkingSpaces_initializers, void 0));
            this.floors = (__runInitializers(this, _parkingSpaces_extraInitializers), __runInitializers(this, _floors_initializers, void 0));
            this.constructionYear = (__runInitializers(this, _floors_extraInitializers), __runInitializers(this, _constructionYear_initializers, void 0));
            // Location Information
            this.state = (__runInitializers(this, _constructionYear_extraInitializers), __runInitializers(this, _state_initializers, void 0)); // Renamed from 'region'
            this.city = (__runInitializers(this, _state_extraInitializers), __runInitializers(this, _city_initializers, void 0)); // Renamed from 'commune'
            this.address = (__runInitializers(this, _city_extraInitializers), __runInitializers(this, _address_initializers, void 0));
            this.latitude = (__runInitializers(this, _address_extraInitializers), __runInitializers(this, _latitude_initializers, void 0));
            this.longitude = (__runInitializers(this, _latitude_extraInitializers), __runInitializers(this, _longitude_initializers, void 0));
            // Multimedia (OneToMany relation to Multimedia table)
            this.multimedia = (__runInitializers(this, _longitude_extraInitializers), __runInitializers(this, _multimedia_initializers, void 0));
            this.mainImageUrl = (__runInitializers(this, _multimedia_extraInitializers), __runInitializers(this, _mainImageUrl_initializers, void 0));
            // Business Logic Fields
            this.postRequest = (__runInitializers(this, _mainImageUrl_extraInitializers), __runInitializers(this, _postRequest_initializers, void 0));
            this.changeHistory = (__runInitializers(this, _postRequest_extraInitializers), __runInitializers(this, _changeHistory_initializers, void 0));
            this.views = (__runInitializers(this, _changeHistory_extraInitializers), __runInitializers(this, _views_initializers, void 0));
            this.leads = (__runInitializers(this, _views_extraInitializers), __runInitializers(this, _leads_initializers, void 0));
            // Internal Notes
            this.internalNotes = (__runInitializers(this, _leads_extraInitializers), __runInitializers(this, _internalNotes_initializers, void 0));
            // Timestamps
            this.createdAt = (__runInitializers(this, _internalNotes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0)); // This is already configured as a soft delete column
            this.publishedAt = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _publishedAt_initializers, void 0));
            this.lastModifiedAt = (__runInitializers(this, _publishedAt_extraInitializers), __runInitializers(this, _lastModifiedAt_initializers, void 0));
            __runInitializers(this, _lastModifiedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Property");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid'), (0, class_validator_1.IsUUID)()];
        _title_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255 }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
        _description_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
        _status_decorators = [(0, typeorm_1.Column)({
                type: 'enum',
                enum: property_status_enum_1.PropertyStatus,
                default: property_status_enum_1.PropertyStatus.REQUEST,
            }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsEnum)(property_status_enum_1.PropertyStatus)];
        _operationType_decorators = [(0, typeorm_1.Column)({
                type: 'enum',
                enum: property_operation_type_enum_1.PropertyOperationType,
            }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsEnum)(property_operation_type_enum_1.PropertyOperationType)];
        _creatorUser_decorators = [(0, typeorm_1.ManyToOne)(() => user_entity_1.User), (0, typeorm_1.JoinColumn)({ name: 'creatorUserId' })];
        _creatorUserId_decorators = [(0, typeorm_1.Column)({ type: 'uuid', nullable: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
        _assignedAgent_decorators = [(0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }), (0, typeorm_1.JoinColumn)({ name: 'assignedAgentId' })];
        _assignedAgentId_decorators = [(0, typeorm_1.Column)({ type: 'uuid', nullable: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
        _price_decorators = [(0, typeorm_1.Column)({ type: 'float', default: 0 }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
        _currencyPrice_decorators = [(0, typeorm_1.Column)({
                type: 'enum',
                enum: CurrencyPriceEnum,
                default: CurrencyPriceEnum.CLP,
            }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsEnum)(CurrencyPriceEnum)];
        _seoTitle_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
        _seoDescription_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
        _seoKeywords_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
        _publicationDate_decorators = [(0, typeorm_1.Column)({ type: 'datetime', nullable: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)()];
        _isFeatured_decorators = [(0, typeorm_1.Column)({ type: 'boolean', default: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
        _propertyType_decorators = [(0, typeorm_1.ManyToOne)(() => property_type_entity_1.PropertyType, { nullable: true }), (0, typeorm_1.JoinColumn)({ name: 'propertyTypeId' })];
        _propertyTypeId_decorators = [(0, typeorm_1.Column)({ type: 'uuid', nullable: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
        _builtSquareMeters_decorators = [(0, typeorm_1.Column)({ type: 'decimal', precision: 8, scale: 2, nullable: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
        _landSquareMeters_decorators = [(0, typeorm_1.Column)({ type: 'decimal', precision: 8, scale: 2, nullable: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
        _bedrooms_decorators = [(0, typeorm_1.Column)({ type: 'int', nullable: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
        _bathrooms_decorators = [(0, typeorm_1.Column)({ type: 'int', nullable: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
        _parkingSpaces_decorators = [(0, typeorm_1.Column)({ type: 'int', nullable: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
        _floors_decorators = [(0, typeorm_1.Column)({ type: 'int', nullable: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
        _constructionYear_decorators = [(0, typeorm_1.Column)({ type: 'int', nullable: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
        _state_decorators = [(0, typeorm_1.Column)({ type: 'enum', enum: regions_enum_1.RegionEnum, nullable: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(regions_enum_1.RegionEnum)];
        _city_decorators = [(0, typeorm_1.Column)({ type: 'enum', enum: comunas_enum_1.ComunaEnum, nullable: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(comunas_enum_1.ComunaEnum)];
        _address_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
        _latitude_decorators = [(0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 8, nullable: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
        _longitude_decorators = [(0, typeorm_1.Column)({ type: 'decimal', precision: 11, scale: 8, nullable: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
        _multimedia_decorators = [(0, typeorm_1.OneToMany)(() => multimedia_entity_1.Multimedia, (m) => m.property, { cascade: true }), (0, class_validator_1.IsOptional)()];
        _mainImageUrl_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
        _postRequest_decorators = [(0, typeorm_1.Column)({ type: 'json', nullable: true }), (0, class_validator_1.IsOptional)()];
        _changeHistory_decorators = [(0, typeorm_1.Column)({ type: 'json', nullable: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)()];
        _views_decorators = [(0, typeorm_1.Column)({ type: 'json', nullable: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)()];
        _leads_decorators = [(0, typeorm_1.Column)({ type: 'json', nullable: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)()];
        _internalNotes_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
        _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
        _deletedAt_decorators = [(0, typeorm_1.DeleteDateColumn)()];
        _publishedAt_decorators = [(0, typeorm_1.Column)({ type: 'datetime', nullable: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)()];
        _lastModifiedAt_decorators = [(0, typeorm_1.Column)({ type: 'datetime', nullable: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)()];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _operationType_decorators, { kind: "field", name: "operationType", static: false, private: false, access: { has: obj => "operationType" in obj, get: obj => obj.operationType, set: (obj, value) => { obj.operationType = value; } }, metadata: _metadata }, _operationType_initializers, _operationType_extraInitializers);
        __esDecorate(null, null, _creatorUser_decorators, { kind: "field", name: "creatorUser", static: false, private: false, access: { has: obj => "creatorUser" in obj, get: obj => obj.creatorUser, set: (obj, value) => { obj.creatorUser = value; } }, metadata: _metadata }, _creatorUser_initializers, _creatorUser_extraInitializers);
        __esDecorate(null, null, _creatorUserId_decorators, { kind: "field", name: "creatorUserId", static: false, private: false, access: { has: obj => "creatorUserId" in obj, get: obj => obj.creatorUserId, set: (obj, value) => { obj.creatorUserId = value; } }, metadata: _metadata }, _creatorUserId_initializers, _creatorUserId_extraInitializers);
        __esDecorate(null, null, _assignedAgent_decorators, { kind: "field", name: "assignedAgent", static: false, private: false, access: { has: obj => "assignedAgent" in obj, get: obj => obj.assignedAgent, set: (obj, value) => { obj.assignedAgent = value; } }, metadata: _metadata }, _assignedAgent_initializers, _assignedAgent_extraInitializers);
        __esDecorate(null, null, _assignedAgentId_decorators, { kind: "field", name: "assignedAgentId", static: false, private: false, access: { has: obj => "assignedAgentId" in obj, get: obj => obj.assignedAgentId, set: (obj, value) => { obj.assignedAgentId = value; } }, metadata: _metadata }, _assignedAgentId_initializers, _assignedAgentId_extraInitializers);
        __esDecorate(null, null, _price_decorators, { kind: "field", name: "price", static: false, private: false, access: { has: obj => "price" in obj, get: obj => obj.price, set: (obj, value) => { obj.price = value; } }, metadata: _metadata }, _price_initializers, _price_extraInitializers);
        __esDecorate(null, null, _currencyPrice_decorators, { kind: "field", name: "currencyPrice", static: false, private: false, access: { has: obj => "currencyPrice" in obj, get: obj => obj.currencyPrice, set: (obj, value) => { obj.currencyPrice = value; } }, metadata: _metadata }, _currencyPrice_initializers, _currencyPrice_extraInitializers);
        __esDecorate(null, null, _seoTitle_decorators, { kind: "field", name: "seoTitle", static: false, private: false, access: { has: obj => "seoTitle" in obj, get: obj => obj.seoTitle, set: (obj, value) => { obj.seoTitle = value; } }, metadata: _metadata }, _seoTitle_initializers, _seoTitle_extraInitializers);
        __esDecorate(null, null, _seoDescription_decorators, { kind: "field", name: "seoDescription", static: false, private: false, access: { has: obj => "seoDescription" in obj, get: obj => obj.seoDescription, set: (obj, value) => { obj.seoDescription = value; } }, metadata: _metadata }, _seoDescription_initializers, _seoDescription_extraInitializers);
        __esDecorate(null, null, _seoKeywords_decorators, { kind: "field", name: "seoKeywords", static: false, private: false, access: { has: obj => "seoKeywords" in obj, get: obj => obj.seoKeywords, set: (obj, value) => { obj.seoKeywords = value; } }, metadata: _metadata }, _seoKeywords_initializers, _seoKeywords_extraInitializers);
        __esDecorate(null, null, _publicationDate_decorators, { kind: "field", name: "publicationDate", static: false, private: false, access: { has: obj => "publicationDate" in obj, get: obj => obj.publicationDate, set: (obj, value) => { obj.publicationDate = value; } }, metadata: _metadata }, _publicationDate_initializers, _publicationDate_extraInitializers);
        __esDecorate(null, null, _isFeatured_decorators, { kind: "field", name: "isFeatured", static: false, private: false, access: { has: obj => "isFeatured" in obj, get: obj => obj.isFeatured, set: (obj, value) => { obj.isFeatured = value; } }, metadata: _metadata }, _isFeatured_initializers, _isFeatured_extraInitializers);
        __esDecorate(null, null, _propertyType_decorators, { kind: "field", name: "propertyType", static: false, private: false, access: { has: obj => "propertyType" in obj, get: obj => obj.propertyType, set: (obj, value) => { obj.propertyType = value; } }, metadata: _metadata }, _propertyType_initializers, _propertyType_extraInitializers);
        __esDecorate(null, null, _propertyTypeId_decorators, { kind: "field", name: "propertyTypeId", static: false, private: false, access: { has: obj => "propertyTypeId" in obj, get: obj => obj.propertyTypeId, set: (obj, value) => { obj.propertyTypeId = value; } }, metadata: _metadata }, _propertyTypeId_initializers, _propertyTypeId_extraInitializers);
        __esDecorate(null, null, _builtSquareMeters_decorators, { kind: "field", name: "builtSquareMeters", static: false, private: false, access: { has: obj => "builtSquareMeters" in obj, get: obj => obj.builtSquareMeters, set: (obj, value) => { obj.builtSquareMeters = value; } }, metadata: _metadata }, _builtSquareMeters_initializers, _builtSquareMeters_extraInitializers);
        __esDecorate(null, null, _landSquareMeters_decorators, { kind: "field", name: "landSquareMeters", static: false, private: false, access: { has: obj => "landSquareMeters" in obj, get: obj => obj.landSquareMeters, set: (obj, value) => { obj.landSquareMeters = value; } }, metadata: _metadata }, _landSquareMeters_initializers, _landSquareMeters_extraInitializers);
        __esDecorate(null, null, _bedrooms_decorators, { kind: "field", name: "bedrooms", static: false, private: false, access: { has: obj => "bedrooms" in obj, get: obj => obj.bedrooms, set: (obj, value) => { obj.bedrooms = value; } }, metadata: _metadata }, _bedrooms_initializers, _bedrooms_extraInitializers);
        __esDecorate(null, null, _bathrooms_decorators, { kind: "field", name: "bathrooms", static: false, private: false, access: { has: obj => "bathrooms" in obj, get: obj => obj.bathrooms, set: (obj, value) => { obj.bathrooms = value; } }, metadata: _metadata }, _bathrooms_initializers, _bathrooms_extraInitializers);
        __esDecorate(null, null, _parkingSpaces_decorators, { kind: "field", name: "parkingSpaces", static: false, private: false, access: { has: obj => "parkingSpaces" in obj, get: obj => obj.parkingSpaces, set: (obj, value) => { obj.parkingSpaces = value; } }, metadata: _metadata }, _parkingSpaces_initializers, _parkingSpaces_extraInitializers);
        __esDecorate(null, null, _floors_decorators, { kind: "field", name: "floors", static: false, private: false, access: { has: obj => "floors" in obj, get: obj => obj.floors, set: (obj, value) => { obj.floors = value; } }, metadata: _metadata }, _floors_initializers, _floors_extraInitializers);
        __esDecorate(null, null, _constructionYear_decorators, { kind: "field", name: "constructionYear", static: false, private: false, access: { has: obj => "constructionYear" in obj, get: obj => obj.constructionYear, set: (obj, value) => { obj.constructionYear = value; } }, metadata: _metadata }, _constructionYear_initializers, _constructionYear_extraInitializers);
        __esDecorate(null, null, _state_decorators, { kind: "field", name: "state", static: false, private: false, access: { has: obj => "state" in obj, get: obj => obj.state, set: (obj, value) => { obj.state = value; } }, metadata: _metadata }, _state_initializers, _state_extraInitializers);
        __esDecorate(null, null, _city_decorators, { kind: "field", name: "city", static: false, private: false, access: { has: obj => "city" in obj, get: obj => obj.city, set: (obj, value) => { obj.city = value; } }, metadata: _metadata }, _city_initializers, _city_extraInitializers);
        __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: obj => "address" in obj, get: obj => obj.address, set: (obj, value) => { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
        __esDecorate(null, null, _latitude_decorators, { kind: "field", name: "latitude", static: false, private: false, access: { has: obj => "latitude" in obj, get: obj => obj.latitude, set: (obj, value) => { obj.latitude = value; } }, metadata: _metadata }, _latitude_initializers, _latitude_extraInitializers);
        __esDecorate(null, null, _longitude_decorators, { kind: "field", name: "longitude", static: false, private: false, access: { has: obj => "longitude" in obj, get: obj => obj.longitude, set: (obj, value) => { obj.longitude = value; } }, metadata: _metadata }, _longitude_initializers, _longitude_extraInitializers);
        __esDecorate(null, null, _multimedia_decorators, { kind: "field", name: "multimedia", static: false, private: false, access: { has: obj => "multimedia" in obj, get: obj => obj.multimedia, set: (obj, value) => { obj.multimedia = value; } }, metadata: _metadata }, _multimedia_initializers, _multimedia_extraInitializers);
        __esDecorate(null, null, _mainImageUrl_decorators, { kind: "field", name: "mainImageUrl", static: false, private: false, access: { has: obj => "mainImageUrl" in obj, get: obj => obj.mainImageUrl, set: (obj, value) => { obj.mainImageUrl = value; } }, metadata: _metadata }, _mainImageUrl_initializers, _mainImageUrl_extraInitializers);
        __esDecorate(null, null, _postRequest_decorators, { kind: "field", name: "postRequest", static: false, private: false, access: { has: obj => "postRequest" in obj, get: obj => obj.postRequest, set: (obj, value) => { obj.postRequest = value; } }, metadata: _metadata }, _postRequest_initializers, _postRequest_extraInitializers);
        __esDecorate(null, null, _changeHistory_decorators, { kind: "field", name: "changeHistory", static: false, private: false, access: { has: obj => "changeHistory" in obj, get: obj => obj.changeHistory, set: (obj, value) => { obj.changeHistory = value; } }, metadata: _metadata }, _changeHistory_initializers, _changeHistory_extraInitializers);
        __esDecorate(null, null, _views_decorators, { kind: "field", name: "views", static: false, private: false, access: { has: obj => "views" in obj, get: obj => obj.views, set: (obj, value) => { obj.views = value; } }, metadata: _metadata }, _views_initializers, _views_extraInitializers);
        __esDecorate(null, null, _leads_decorators, { kind: "field", name: "leads", static: false, private: false, access: { has: obj => "leads" in obj, get: obj => obj.leads, set: (obj, value) => { obj.leads = value; } }, metadata: _metadata }, _leads_initializers, _leads_extraInitializers);
        __esDecorate(null, null, _internalNotes_decorators, { kind: "field", name: "internalNotes", static: false, private: false, access: { has: obj => "internalNotes" in obj, get: obj => obj.internalNotes, set: (obj, value) => { obj.internalNotes = value; } }, metadata: _metadata }, _internalNotes_initializers, _internalNotes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _publishedAt_decorators, { kind: "field", name: "publishedAt", static: false, private: false, access: { has: obj => "publishedAt" in obj, get: obj => obj.publishedAt, set: (obj, value) => { obj.publishedAt = value; } }, metadata: _metadata }, _publishedAt_initializers, _publishedAt_extraInitializers);
        __esDecorate(null, null, _lastModifiedAt_decorators, { kind: "field", name: "lastModifiedAt", static: false, private: false, access: { has: obj => "lastModifiedAt" in obj, get: obj => obj.lastModifiedAt, set: (obj, value) => { obj.lastModifiedAt = value; } }, metadata: _metadata }, _lastModifiedAt_initializers, _lastModifiedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Property = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Property = _classThis;
})();
exports.Property = Property;
