import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Multimedia } from './multimedia.entity';

export enum NotificationType {
  INTERES = 'INTERES',
  CONTACTO = 'CONTACTO',
  COMPROBANTE_DE_PAGO = 'COMPROBANTE_DE_PAGO',
  AVISO_PAGO_VENCIDO = 'AVISO_PAGO_VENCIDO',
  CAMBIO_ESTADO_PUBLICACION = 'CAMBIO_ESTADO_PUBLICACION',
  CAMBIO_ESTADO_CONTRATO = 'CAMBIO_ESTADO_CONTRATO',
  NUEVA_ASIGNACION_PROPIEDAD_AGENTE = 'NUEVA_ASIGNACION_PROPIEDAD_AGENTE',
}

export enum NotificationStatus {
  SEND = 'SEND',
  OPEN = 'OPEN',
}

export interface NotificationTarget {
  targetUserIds: string[];
  targetMails?: string[];
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'json' })
  targetUserIds: string[];

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column({ type: 'json', nullable: true })
  targetMails: string[];

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.SEND,
  })
  status: NotificationStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // Relations
  @ManyToOne(() => Multimedia)
  @JoinColumn({ name: 'multimediaId' })
  multimedia: Multimedia;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'viewerId' })
  viewer: User;
}
