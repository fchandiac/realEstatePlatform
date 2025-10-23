import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import {
  Notification,
  NotificationStatus,
  NotificationType,
} from '../../entities/notification.entity';
import { User } from '../../entities/user.entity';
import { Property } from '../../entities/property.entity';
import { PropertyStatus } from '../../common/enums/property-status.enum';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
} from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      ...createNotificationDto,
      status: NotificationStatus.SEND,
    });
    return await this.notificationRepository.save(notification);
  }

  async findAll(): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { deletedAt: IsNull() },
      relations: ['multimedia', 'viewer'],
    });
  }

  async findOne(id: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['multimedia', 'viewer'],
    });

    if (!notification) {
      throw new NotFoundException('Notificación no encontrada');
    }

    return notification;
  }

  async update(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    const notification = await this.findOne(id);

    Object.assign(notification, updateNotificationDto);
    return await this.notificationRepository.save(notification);
  }

  async softDelete(id: string): Promise<void> {
    const notification = await this.findOne(id);
    await this.notificationRepository.softDelete(id);
  }

  async markAsOpened(id: string, viewerId: string): Promise<Notification> {
    const notification = await this.findOne(id);

    if (notification.status === NotificationStatus.OPEN) {
      throw new BadRequestException('La notificación ya ha sido abierta');
    }

    notification.status = NotificationStatus.OPEN;
    notification.viewer = { id: viewerId } as User;

    return await this.notificationRepository.save(notification);
  }

  async getNotificationsForUser(userId: string): Promise<Notification[]> {
    // TODO: Implement proper JSON array querying
    // For now, get all notifications and filter in memory
    const allNotifications = await this.findAll();
    return allNotifications.filter((notification) =>
      notification.targetUserIds.includes(userId),
    );
  }

  // Property-related notification methods
  async notifyPropertyStatusChange(
    property: Property,
    oldStatus: PropertyStatus,
    newStatus: PropertyStatus,
  ): Promise<Notification> {
    const targetUserIds: string[] = [];
    if (property.creatorUserId) {
      targetUserIds.push(property.creatorUserId);
    }
    if (property.assignedAgentId) {
      targetUserIds.push(property.assignedAgentId);
    }

    const createDto: CreateNotificationDto = {
      targetUserIds,
      type: NotificationType.CAMBIO_ESTADO_PUBLICACION,
    };

    return await this.create(createDto);
  }

  async notifyAgentAssigned(property: Property, agent: User): Promise<Notification> {
    const createDto: CreateNotificationDto = {
      targetUserIds: [agent.id],
      type: NotificationType.NUEVA_ASIGNACION_PROPIEDAD_AGENTE,
    };

    return await this.create(createDto);
  }
}
