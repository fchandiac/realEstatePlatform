import { IsUUID, IsString, IsEnum, IsBoolean, IsDate, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BlogCategory } from '../../../entities/blog-article.entity';

export class BlogArticleDto {
  @IsUUID()
  id: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsString()
  content: string;

  @IsEnum(BlogCategory)
  category: BlogCategory;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsDate()
  publishedAt?: Date;

  @IsBoolean()
  isActive: boolean;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BlogArticleDto)
  relatedArticles?: BlogArticleDto[];
}