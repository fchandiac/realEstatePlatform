import { IsNotEmpty, IsString, IsOptional, IsEmail, IsEnum, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { UserStatus, UserRole, Permission, PersonalInfo } from '../../../entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  mail: string;

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
  mail?: string;

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
  mail: string;

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