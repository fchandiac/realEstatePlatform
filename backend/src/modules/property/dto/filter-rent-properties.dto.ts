import { IsOptional, IsString, IsNumber, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterRentPropertiesDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsObject()
  filters?: Record<string, any>; // e.g., { priceMin: number, bedrooms: number }

  @IsOptional()
  @IsString()
  sort?: string; // e.g., 'price_asc'

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;
}