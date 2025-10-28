import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('sliders')
export class Slider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'json' })
  slide1: {
    title: string;
    description: string;
    multimediaUrl: string;
    url: string;
    duration: number;
    startDate: Date;
    endDate: Date;
  };

  @Column({ type: 'json' })
  slide2: {
    title: string;
    description: string;
    multimediaUrl: string;
    url: string;
    duration: number;
    startDate: Date;
    endDate: Date;
  };

  @Column({ type: 'json' })
  slide3: {
    title: string;
    description: string;
    multimediaUrl: string;
    url: string;
    duration: number;
    startDate: Date;
    endDate: Date;
  };

  @Column({ type: 'json' })
  slide4: {
    title: string;
    description: string;
    multimediaUrl: string;
    url: string;
    duration: number;
    startDate: Date;
    endDate: Date;
  };

  @Column({ type: 'json' })
  slide5: {
    title: string;
    description: string;
    multimediaUrl: string;
    url: string;
    duration: number;
    startDate: Date;
    endDate: Date;
  };

  @Column({ type: 'json' })
  slide6: {
    title: string;
    description: string;
    multimediaUrl: string;
    url: string;
    duration: number;
    startDate: Date;
    endDate: Date;
  };

  @Column({ type: 'json' })
  slide7: {
    title: string;
    description: string;
    multimediaUrl: string;
    url: string;
    duration: number;
    startDate: Date;
    endDate: Date;
  };

  @Column({ type: 'json' })
  slide8: {
    title: string;
    description: string;
    multimediaUrl: string;
    url: string;
    duration: number;
    startDate: Date;
    endDate: Date;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}