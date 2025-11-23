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
  NotificationSenderType,
} from '../../entities/notification.entity';
import { User } from '../../entities/user.entity';
import { Property } from '../../entities/property.entity';
import { PropertyStatus } from '../../common/enums/property-status.enum';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
} from './dto/notification.dto';
import { EmailService } from './email.service';

@Injectable()
export class NotificationsService {
    /**
     * Envía notificación de interés en propiedad a todos los administradores y al agente asignado
     */
    async notifyInterestOnProperty(propertyId: string, interestedUserId: string, assignedAgentId?: string): Promise<Notification[]> {
      // Obtener todos los administradores
      const admins = await this.getAdminUserIds();
      // Construir lista de destinatarios
      const targetUserIds = [...admins];
      if (assignedAgentId) {
        targetUserIds.push(assignedAgentId);
      }
      // Datos del sender
      const senderType = interestedUserId ? NotificationSenderType.USER : NotificationSenderType.ANONYMOUS;
      const senderId = interestedUserId || undefined;
      const senderName = interestedUserId ? await this.getUserName(interestedUserId) : 'Anónimo';
      // Crear notificación para cada destinatario
      const notifications: Notification[] = [];
      for (const userId of targetUserIds) {
        const dto: CreateNotificationDto = {
          senderType,
          senderId,
          senderName,
          isSystem: false,
          message: `El usuario ${senderName} está interesado en la propiedad ${propertyId}.`,
          targetUserIds: [userId],
          type: NotificationType.INTEREST,
        };
        const notification = await this.create(dto);
        notifications.push(notification);
      }
      return notifications;
    }

    /**
     * Obtiene los IDs de todos los usuarios administradores
     */
    private async getAdminUserIds(): Promise<string[]> {
      // Requiere UsersService, puede inyectarse o importarse
      // Aquí se asume que existe un método findAdminUsers() en UsersService
      // y que NotificationsService tiene acceso a él
      if (!('usersService' in this)) throw new Error('UsersService no disponible');
      const admins = await (this as any).usersService.findAdminUsers({});
      return admins.map((admin: any) => admin.id);
    }
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly emailService: EmailService,
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      ...createNotificationDto,
      status: createNotificationDto.status ?? NotificationStatus.SEND,
      firstViewerId: createNotificationDto.firstViewerId ?? null,
      firstViewedAt: createNotificationDto.firstViewedAt ?? null,
    });
    const savedNotification = await this.notificationRepository.save(notification);

    // Send emails if targetMails are specified
    if (createNotificationDto.targetMails && createNotificationDto.targetMails.length > 0) {
      try {
        const emailPromises = createNotificationDto.targetMails.map(email =>
          this.emailService.sendMail({
            to: email,
            subject: `Nueva notificación: ${createNotificationDto.type}`,
            text: createNotificationDto.message || `Has recibido una nueva notificación del tipo: ${createNotificationDto.type}`,
            templateVariables: {
              notificationType: createNotificationDto.type,
              notificationId: savedNotification.id,
            },
          })
        );
        await Promise.all(emailPromises);
      } catch (error) {
        // Log email sending error but don't fail the notification creation
        console.error('Error sending notification emails:', error);
      }
    }

    return savedNotification;
  }

  // Helper para obtener nombre de usuario
  private async getUserName(userId: string): Promise<string> {
    if (!('usersService' in this)) return 'Usuario';
    try {
      const user = await (this as any).usersService.findOne(userId);
      return user?.name || user?.email || 'Usuario';
    } catch {
      return 'Usuario';
    }
  }

  async findAll(page: number = 1, limit: number = 20): Promise<{ data: Notification[], total: number }> {
    const [data, total] = await this.notificationRepository.findAndCount({
      where: { deletedAt: IsNull() },
      relations: ['multimedia', 'viewer'],
      take: limit,
      skip: (page - 1) * limit,
      order: { createdAt: 'DESC' },
    });
    return { data, total };
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
    return await this.notificationRepository
      .createQueryBuilder('notification')
      .where(`JSON_CONTAINS(notification.targetUserIds, JSON_ARRAY(:userId))`, {
        userId,
      })
      .andWhere('notification.deletedAt IS NULL')
      .leftJoinAndSelect('notification.multimedia', 'multimedia')
      .leftJoinAndSelect('notification.viewer', 'viewer')
      .orderBy('notification.createdAt', 'DESC')
      .getMany();
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
      senderType: NotificationSenderType.SYSTEM,
      senderId: undefined,
      senderName: 'Sistema',
      isSystem: true,
      message: `El estado de publicación de la propiedad ${property.id} ha cambiado.`,
      targetUserIds,
      type: NotificationType.PUBLICATION_STATUS_CHANGE,
    };

    return await this.create(createDto);
  }

  async notifyAgentAssigned(property: Property, agent: User): Promise<Notification> {
    const createDto: CreateNotificationDto = {
      senderType: NotificationSenderType.SYSTEM,
      senderId: undefined,
      senderName: 'Sistema',
      isSystem: true,
      message: `Se te ha asignado la propiedad ${property.id}.`,
      targetUserIds: [agent.id],
      type: NotificationType.PROPERTY_AGENT_ASSIGNMENT,
    };

    return await this.create(createDto);
  }
}
