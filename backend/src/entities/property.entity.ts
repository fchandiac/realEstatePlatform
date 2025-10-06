import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IsNotEmpty, IsString, IsOptional, IsEnum, IsNumber, IsUUID, ValidateNested, IsArray } from 'class-validator';
import { Min } from 'class-validator';
import { Type } from 'class-transformer';
import { User } from './user.entity';

export enum PropertyStatus {
  REQUEST = 'REQUEST',
  PRE_APPROVED = 'PRE-APPROVED',
  PUBLISHED = 'PUBLISHED',
  INACTIVE = 'INACTIVE',
  SOLD = 'SOLD',
  RENTED = 'RENTED',
}

export enum PropertyOperationType {
  SALE = 'SALE',
  RENT = 'RENT',
}

export class RegionCommune {
  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  communes?: string[];
}

export class MultimediaItem {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class PostRequest {
  @IsOptional()
  @IsString()
  origin?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  userType?: string;

  @IsOptional()
  @IsNumber()
  valuationAmount?: number;
}

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
  })
  @IsNotEmpty()
  @IsEnum(PropertyStatus)
  status: PropertyStatus;

  @Column({ type: 'uuid' })
  @IsNotEmpty()
  @IsUUID()
  creatorUserId: string;

  @Column({
    type: 'enum',
    enum: PropertyOperationType,
  })
  @IsNotEmpty()
  @IsEnum(PropertyOperationType)
  operationType: PropertyOperationType;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'creatorUserId' })
  creatorUser: User;

  @Column({ type: 'uuid', nullable: true })
  @IsOptional()
  @IsUUID()
  assignedAgentId?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assignedAgentId' })
  assignedAgent?: User;

  @Column({ type: 'int', default: 0 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  priceCLP: number;

  @Column({ type: 'float', default: 0 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  priceUF: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @IsString()
  seoTitle?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  @IsOptional()
  @IsString()
  seoDescription?: string;

  @Column({ type: 'date', nullable: true })
  @IsOptional()
  publicationDate?: Date;

  @Column({ type: 'int', nullable: true })
  @IsOptional()
  @IsNumber()
  bathrooms?: number;

  @Column({ type: 'float', nullable: true })
  @IsOptional()
  @IsNumber()
  builtSquareMeters?: number;

  @Column({ type: 'float', nullable: true })
  @IsOptional()
  @IsNumber()
  landSquareMeters?: number;

  @Column({ type: 'int', nullable: true })
  @IsOptional()
  @IsNumber()
  bedrooms?: number;

  @Column({ type: 'int', nullable: true })
  @IsOptional()
  @IsNumber()
  parkingSpaces?: number;

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => RegionCommune)
  regionCommune?: RegionCommune;

  @Column({ type: 'float', nullable: true })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @Column({ type: 'float', nullable: true })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MultimediaItem)
  multimedia?: MultimediaItem[];

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  changeHistory?: any;

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  views?: any;

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  leads?: any;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @IsString()
  propertyRole?: string;

  @Column({
    type: 'enum',
    enum: PropertyOperationType,
    nullable: true,
  })
  @IsOptional()
  @IsEnum(PropertyOperationType)
  operation?: PropertyOperationType;

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => PostRequest)
  postRequest?: PostRequest;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}