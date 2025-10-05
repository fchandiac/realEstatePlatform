import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { Multimedia } from './multimedia.entity';

@Entity('people')
export class Person {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ unique: true, nullable: true })
  dni: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ type: 'date', nullable: true })
  verificationRequest: Date;

  @Column('uuid', { nullable: true })
  dniCardFrontId: string;

  @Column('uuid', { nullable: true })
  dniCardRearId: string;

  @Column('uuid', { nullable: true })
  userId: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // Relations
  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Multimedia)
  @JoinColumn({ name: 'dniCardFrontId' })
  dniCardFront: Multimedia;

  @ManyToOne(() => Multimedia)
  @JoinColumn({ name: 'dniCardRearId' })
  dniCardRear: Multimedia;
}