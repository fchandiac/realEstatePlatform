import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

export enum MultimediaFormat {
  IMG = 'IMG',
  VIDEO = 'VIDEO'
}

export enum MultimediaType {
  DNI_FRONT = 'DNI_FRONT',
  DNI_REAR = 'DNI_REAR',
  SLIDE = 'SLIDE',
  LOGO = 'LOGO',
  STAFF = 'STAFF',
  PROPERTY_IMG = 'PROPERTY_IMG',
  PROPERTY_VIDEO = 'PROPERTY_VIDEO',
  PARTNERSHIP = 'PARTNERSHIP',
  DOCUMENT = 'DOCUMENT'
}

@Entity('multimedia')
export class Multimedia {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: MultimediaFormat
  })
  format: MultimediaFormat;

  @Column({
    type: 'enum',
    enum: MultimediaType
  })
  type: MultimediaType;

  @Column()
  url: string;

  @Column({ nullable: true })
  seoTitle?: string;

  @Column()
  filename: string;

  @Column('int')
  fileSize: number;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  userId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}