import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsDate,
  IsUUID,
} from 'class-validator';

export enum BlogCategory {
  COMPRAR = 'Comprar',
  ARRENDAR = 'Arrendar',
  INVERSION = 'Inversión',
  DECORACION = 'Decoración',
  MERCADO = 'Mercado',
}

@Entity('blog_articles')
export class BlogArticle {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  title: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @Column({ type: 'text' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @Column({
    type: 'enum',
    enum: BlogCategory,
  })
  @IsNotEmpty()
  @IsEnum(BlogCategory)
  category: BlogCategory;

  @Column({ type: 'varchar', length: 500, nullable: true })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @Column({ type: 'datetime', nullable: true })
  @IsOptional()
  @IsDate()
  publishedAt?: Date;

  @Column({ type: 'boolean', default: true })
  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  // Timestamps
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}