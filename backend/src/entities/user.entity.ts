import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { IsNotEmpty, IsString, IsOptional, IsEmail, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import * as bcrypt from 'bcrypt';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  VACATION = 'VACATION',
  LEAVE = 'LEAVE',
}

export enum UserRole {
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
  AGENT = 'AGENT',
  COMMUNITY = 'COMMUNITY',
}

export enum Permission {
  MANAGE_USERS = 'MANAGE_USERS',
  MANAGE_AGENTS = 'MANAGE_AGENTS',
  MANAGE_ADMINS = 'MANAGE_ADMINS',
  MANAGE_PROPERTIES = 'MANAGE_PROPERTIES',
  ASSIGN_PROPERTY_AGENT = 'ASSIGN_PROPERTY_AGENT',
  MANAGE_CONTRACTS = 'MANAGE_CONTRACTS',
  MANAGE_NOTIFICATIONS = 'MANAGE_NOTIFICATIONS',
  MANAGE_MULTIMEDIA = 'MANAGE_MULTIMEDIA',
  MANAGE_DOCUMENT_TYPES = 'MANAGE_DOCUMENT_TYPES',
  MANAGE_PROPERTY_TYPES = 'MANAGE_PROPERTY_TYPES',
  MANAGE_ARTICLES = 'MANAGE_ARTICLES',
  MANAGE_TESTIMONIALS = 'MANAGE_TESTIMONIALS',
  VIEW_REPORTS = 'VIEW_REPORTS',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export class PersonalInfo {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  preferences?: any;
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @IsNotEmpty()
  @IsString()
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  password: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  @IsNotEmpty()
  @IsEnum(UserStatus)
  status: UserStatus;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.COMMUNITY,
  })
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  permissions?: Permission[];

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => PersonalInfo)
  personalInfo?: PersonalInfo;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin?: Date;

  // Authentication methods
  async setPassword(plainPassword: string): Promise<void> {
    this.password = await bcrypt.hash(plainPassword, 12);
  }

  async validatePassword(plainPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, this.password);
  }

  get name(): string {
    if (this.personalInfo?.firstName && this.personalInfo?.lastName) {
      return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`;
    }
    return this.username;
  }
}