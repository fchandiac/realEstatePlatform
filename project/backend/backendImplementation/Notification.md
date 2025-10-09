# Notification Entity - Backend Implementation

## Entity Structure

### Notification Entity (`notification.entity.ts`)

```typescript
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
```

### Enums

#### NotificationType
- `INTERES`: Interest notification
- `CONTACTO`: Contact notification
- `COMPROBANTE_DE_PAGO`: Payment proof
- `AVISO_PAGO_VENCIDO`: Overdue payment notice
- `CAMBIO_ESTADO_PUBLICACION`: Publication status change
- `CAMBIO_ESTADO_CONTRATO`: Contract status change
- `NUEVA_ASIGNACION_PROPIEDAD_AGENTE`: New property assignment to agent

#### NotificationStatus
- `SEND`: Notification sent (default)
- `OPEN`: Notification opened/viewed

### Relationships

- **Multimedia** (Many-to-One, optional): Associated multimedia file
- **User** (Many-to-One, optional): User who viewed the notification

### Database Table: `notifications`

## Service Characteristics

### NotificationService (`notification.service.ts`)

**Dependencies:**
- `Notification` repository (TypeORM)

**Methods:**

#### `create(createNotificationDto: CreateNotificationDto): Promise<Notification>`
Creates a new notification.

#### `findAll(): Promise<Notification[]>`
Retrieves all notifications.

#### `findOne(id: string): Promise<Notification>`
Retrieves a specific notification by ID. Throws NotFoundException if not found.

#### `update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<Notification>`
Updates notification information.

#### `softDelete(id: string): Promise<void>`
Soft deletes a notification.

#### `findByUser(userId: string): Promise<Notification[]>`
Retrieves notifications for a specific user.

#### `markAsRead(id: string, userId: string): Promise<Notification>`
Marks a notification as read by a user.

#### `sendBulk(notifications: CreateNotificationDto[]): Promise<Notification[]>`
Sends multiple notifications at once.

## Controller Characteristics

### NotificationController (`notification.controller.ts`)

**API Endpoints:**

#### `POST /notification`
Creates a new notification.
- **Body:** `CreateNotificationDto`

#### `GET /notification`
Retrieves all notifications.

#### `GET /notification/:id`
Retrieves a specific notification by ID.

#### `PATCH /notification/:id`
Updates a notification.
- **Body:** `UpdateNotificationDto`

#### `DELETE /notification/:id`
Soft deletes a notification.

#### `GET /notification/user/:userId`
Retrieves notifications for a user.

#### `POST /notification/:id/read`
Marks notification as read.
- **Body:** `{ userId: string }`

#### `POST /notification/bulk`
Sends bulk notifications.
- **Body:** `CreateNotificationDto[]`

## DTOs

### CreateNotificationDto
```typescript
{
  targetUserIds: string[];
  type: NotificationType;
  targetMails?: string[];
  multimediaId?: string;
  viewerId?: string;
}
```

### UpdateNotificationDto
```typescript
{
  targetUserIds?: string[];
  type?: NotificationType;
  targetMails?: string[];
  status?: NotificationStatus;
  multimediaId?: string;
  viewerId?: string;
}
```

## Business Logic

### Notification Targeting
- Notifications can target multiple users via `targetUserIds`
- Optional email targets via `targetMails`
- Supports both user-based and email-based notifications

### Status Tracking
- Tracks whether notifications have been sent or opened
- Supports read/unread status for user engagement

### Multimedia Integration
- Can include multimedia attachments (images, documents)
- Useful for payment proofs, property images, etc.

### Bulk Operations
- Supports sending multiple notifications efficiently
- Useful for system-wide announcements or batch communications

## Error Handling
- **NotFoundException**: Notification not found

## Module Configuration

### NotificationModule (`notification.module.ts`)
```typescript
@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
```

**Dependencies:**
- TypeOrmModule for Notification entity</content>
<parameter name="filePath">/Users/felipe/dev/realEstatePlatform/project/backEnd/backendImplementation/Notification.md