import { IsNotEmpty, IsString, IsOptional, IsEnum, IsNumber, IsUUID, ValidateNested, IsArray, IsDateString } from 'class-validator';
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
  @IsUUID()
  creatorUserId: string;

  @IsOptional()
  @IsUUID()
  assignedAgentId?: string;

  @IsOptional()
  @IsNumber()
  priceCLP?: number;

  @IsOptional()
  @IsNumber()
  priceUF?: number;

  @IsOptional()
  @IsString()
  seoTitle?: string;

  @IsOptional()
  @IsString()
  seoDescription?: string;

  @IsOptional()
  @IsDateString()
  publicationDate?: string;

  @IsOptional()
  @IsNumber()
  bathrooms?: number;

  @IsOptional()
  @IsNumber()
  builtSquareMeters?: number;

  @IsOptional()
  @IsNumber()
  landSquareMeters?: number;

  @IsOptional()
  @IsNumber()
  bedrooms?: number;

  @IsOptional()
  @IsNumber()
  parkingSpaces?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => RegionCommune)
  regionCommune?: RegionCommune;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MultimediaItem)
  multimedia?: MultimediaItem[];

  @IsOptional()
  @IsString()
  propertyRole?: string;

  @IsOptional()
  @IsEnum(PropertyOperationType)
  operation?: PropertyOperationType;

  @IsOptional()
  @ValidateNested()
  @Type(() => PostRequest)
  postRequest?: PostRequest;
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
  @IsUUID()
  assignedAgentId?: string;

  @IsOptional()
  @IsNumber()
  priceCLP?: number;

  @IsOptional()
  @IsNumber()
  priceUF?: number;

  @IsOptional()
  @IsString()
  seoTitle?: string;

  @IsOptional()
  @IsString()
  seoDescription?: string;

  @IsOptional()
  @IsDateString()
  publicationDate?: string;

  @IsOptional()
  @IsNumber()
  bathrooms?: number;

  @IsOptional()
  @IsNumber()
  builtSquareMeters?: number;

  @IsOptional()
  @IsNumber()
  landSquareMeters?: number;

  @IsOptional()
  @IsNumber()
  bedrooms?: number;

  @IsOptional()
  @IsNumber()
  parkingSpaces?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => RegionCommune)
  regionCommune?: RegionCommune;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MultimediaItem)
  multimedia?: MultimediaItem[];

  @IsOptional()
  @IsString()
  propertyRole?: string;

  @IsOptional()
  @IsEnum(PropertyOperationType)
  operation?: PropertyOperationType;

  @IsOptional()
  @ValidateNested()
  @Type(() => PostRequest)
  postRequest?: PostRequest;
}