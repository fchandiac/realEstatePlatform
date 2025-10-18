import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Property } from './property.entity';
import { Document } from './document.entity';
import { Payment } from './payment.entity';
import { User } from './user.entity';

export enum ContractOperationType {
  COMPRAVENTA = 'COMPRAVENTA',
  ARRIENDO = 'ARRIENDO',
}

export enum ContractStatus {
  IN_PROCESS = 'IN_PROCESS',
  CLOSED = 'CLOSED',
  FAILED = 'FAILED',
  ON_HOLD = 'ON_HOLD',
}

export enum ContractRole {
  SELLER = 'SELLER',
  BUYER = 'BUYER',
  LANDLORD = 'LANDLORD',
  TENANT = 'TENANT',
  NOTARY = 'NOTARY',
  REGISTRAR = 'REGISTRAR',
  WITNESS = 'WITNESS',
  GUARANTOR = 'GUARANTOR',
  REPRESENTATIVE = 'REPRESENTATIVE',
  PROMISSOR = 'PROMISSOR',
  THIRD_PARTY = 'THIRD_PARTY',
  AGENT = 'AGENT',
}

export interface ContractPerson {
  personId: string;
  role: ContractRole;
}

export interface ContractPayment {
  amount: number;
  date: Date;
  description?: string;
}

export interface ContractDocument {
  documentTypeId: string;
  documentId?: string;
  required: boolean;
  uploaded: boolean;
}

@Entity('contracts')
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  propertyId: string;

  @Column({
    type: 'enum',
    enum: ContractOperationType,
  })
  operation: ContractOperationType;

  @Column({
    type: 'enum',
    enum: ContractStatus,
    default: ContractStatus.IN_PROCESS,
  })
  status: ContractStatus;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column('int')
  amount: number;

  @Column('float')
  commissionPercent: number;

  @Column('float')
  commissionAmount: number;

  @Column({ type: 'json', nullable: true })
  payments: ContractPayment[];

  @Column({ type: 'json', nullable: true })
  documents: ContractDocument[];

  @Column({ type: 'json' })
  people: ContractPerson[];

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Property)
  @JoinColumn({ name: 'propertyId' })
  property: Property;
}
