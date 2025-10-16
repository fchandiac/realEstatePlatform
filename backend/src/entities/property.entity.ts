import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Generated,
} from 'typeorm';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsUUID,
  ValidateNested,
  IsArray,
  IsBoolean,
  IsDate,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { User } from './user.entity';
import { PropertyStatus } from '../common/enums/property-status.enum';
import { PropertyOperationType } from '../common/enums/property-operation-type.enum';
import {
  MultimediaReference,
  PostRequest,
  ChangeHistoryEntry,
  ViewEntry,
  RegionCommune,
  LeadEntry,
} from '../common/interfaces/property.interfaces';

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  // Basic Information
  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  title: string;

  @Column({ type: 'text' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @Column({
    type: 'enum',
    enum: PropertyStatus,
    default: PropertyStatus.REQUEST,
  })
  @IsNotEmpty()
  @IsEnum(PropertyStatus)
  status: PropertyStatus;

  @Column({
    type: 'enum',
    enum: PropertyOperationType,
  })
  @IsNotEmpty()
  @IsEnum(PropertyOperationType)
  operationType: PropertyOperationType;

  // Users Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'creatorUserId' })
  creatorUser: User;

  @Column({ type: 'uuid', nullable: true })
  @IsOptional()
  @IsUUID()
  creatorUserId?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assignedAgentId' })
  assignedAgent?: User;

  @Column({ type: 'uuid', nullable: true })
  @IsOptional()
  @IsUUID()
  assignedAgentId?: string;

  // Pricing Information
  @Column({ type: 'bigint', default: 0 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  priceCLP: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  priceUF: number;

  @Column({ type: 'bigint', nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  rentPriceCLP?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  rentPriceUF?: number;

  @Column({ type: 'bigint', nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  expenses?: number;

  // SEO Information
  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @IsString()
  seoTitle?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  @IsOptional()
  @IsString()
  seoDescription?: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  seoKeywords?: string;

  // Publication Information
  @Column({ type: 'datetime', nullable: true })
  @IsOptional()
  @IsDate()
  publicationDate?: Date;

  @Column({ type: 'boolean', default: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @Column({ type: 'int', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  priority?: number;

  // Physical Characteristics
  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @IsString()
  propertyType?: string;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  builtSquareMeters?: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  landSquareMeters?: number;

  @Column({ type: 'int', nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bedrooms?: number;

  @Column({ type: 'int', nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bathrooms?: number;

  @Column({ type: 'int', nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  parkingSpaces?: number;

  @Column({ type: 'int', nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  floors?: number;

  @Column({ type: 'int', nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  constructionYear?: number;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  amenities?: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  nearbyServices?: string;

  // Location Information
  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @IsString()
  address?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @IsString()
  city?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @IsString()
  neighborhood?: string;

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  regionCommune?: RegionCommune;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @IsOptional()
  @IsString()
  zipCode?: string;

  // Multimedia
  @Column({ type: 'json', nullable: true })
  @IsOptional()
  @IsArray()
  multimedia?: MultimediaReference[];

  // Business Logic Fields
  @Column({ type: 'json', nullable: true })
  @IsOptional()
  postRequest?: PostRequest;

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  @IsArray()
  changeHistory?: ChangeHistoryEntry[];

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  @IsArray()
  views?: ViewEntry[];

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  @IsArray()
  leads?: LeadEntry[];

  // Statistics
  @Column({ type: 'int', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  viewCount?: number;

  @Column({ type: 'int', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  favoriteCount?: number;

  @Column({ type: 'int', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  contactCount?: number;

  // Internal Notes
  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  internalNotes?: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  rejectionReason?: string;

  // Timestamps
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column({ type: 'datetime', nullable: true })
  @IsOptional()
  @IsDate()
  publishedAt?: Date;

  @Column({ type: 'datetime', nullable: true })
  @IsOptional()
  @IsDate()
  lastModifiedAt?: Date;
}
