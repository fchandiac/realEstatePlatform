import { IsNotEmpty, IsString, IsOptional, IsEmail, IsEnum, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { UserStatus, UserRole, Permission, PersonalInfo } from '../../../entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsArray()
  @IsEnum(Permission, { each: true })
  permissions?: Permission[];

  @IsOptional()
  @ValidateNested()
  @Type(() => PersonalInfo)
  personalInfo?: PersonalInfo;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsArray()
  @IsEnum(Permission, { each: true })
  permissions?: Permission[];

  @IsOptional()
  @ValidateNested()
  @Type(() => PersonalInfo)
  personalInfo?: PersonalInfo;
}

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}

export class AssignRoleDto {
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}

export class UpdatePermissionsDto {
  @IsNotEmpty()
  @IsArray()
  @IsEnum(Permission, { each: true })
  permissions: Permission[];
}