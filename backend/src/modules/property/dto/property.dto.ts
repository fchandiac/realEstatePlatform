import { IsNotEmpty, IsString, IsOptional, IsEnum, IsNumber, IsUUID, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { PropertyStatus, PropertyOperationType, RegionCommune, MultimediaItem, PostRequest } from '../../../entities/property.entity';

export class CreatePropertyDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(PropertyStatus)
  status: PropertyStatus;

  @IsNotEmpty()
  @IsEnum(PropertyOperationType)
  operationType: PropertyOperationType;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => RegionCommune)
  regionCommune: RegionCommune;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MultimediaItem)
  multimedia?: MultimediaItem[];

  @IsOptional()
  @ValidateNested()
  @Type(() => PostRequest)
  postRequest?: PostRequest;

  @IsNotEmpty()
  @IsUUID()
  ownerId: string;
}

export class UpdatePropertyDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(PropertyStatus)
  status?: PropertyStatus;

  @IsOptional()
  @IsEnum(PropertyOperationType)
  operationType?: PropertyOperationType;

  @IsOptional()
  @ValidateNested()
  @Type(() => RegionCommune)
  regionCommune?: RegionCommune;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MultimediaItem)
  multimedia?: MultimediaItem[];

  @IsOptional()
  @ValidateNested()
  @Type(() => PostRequest)
  postRequest?: PostRequest;
}