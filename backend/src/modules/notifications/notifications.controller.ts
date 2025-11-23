import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JweAuthGuard } from '../../auth/jwe/jwe-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Audit } from '../../common/interceptors/audit.interceptor';
import { AuditAction, AuditEntityType } from '../../common/enums/audit.enums';
import { NotificationsService } from './notifications.service';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
  UpdateNotificationStatusDto,
} from './dto/notification.dto';

@Controller('notifications')
@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class NotificationsController {
    /**
     * Notifica interés en propiedad a administradores y agente asignado
     * Puede ser llamado por usuario autenticado o anónimo
     */
    @Post('property-interest')
    @ApiOperation({ summary: 'Enviar notificación de interés en propiedad a administradores y agente asignado' })
    @ApiBody({ schema: {
      type: 'object',
      properties: {
        propertyId: { type: 'string' },
        assignedAgentId: { type: 'string', nullable: true },
        interestedUserId: { type: 'string', nullable: true },
      },
      required: ['propertyId'],
    }})
    async notifyInterestOnProperty(@Body() body: { propertyId: string; assignedAgentId?: string; interestedUserId?: string }) {
      // El servicio ya construye el DTO completo y usa el método único
      return this.notificationsService.notifyInterestOnProperty(
        body.propertyId,
        body.interestedUserId || '',
        body.assignedAgentId
      );
    }
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * Create a new notification
   */
  @Post()
  @ApiOperation({ summary: 'Create new notification' })
  @ApiResponse({
    status: 201,
    description: 'Notification created successfully',
  })
  @ApiBody({ type: CreateNotificationDto })
  @Audit(AuditAction.CREATE, AuditEntityType.NOTIFICATION, 'Crear nueva notificación')
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  /**
   * Get all notifications with pagination
   */
  @Get()
  @ApiOperation({ summary: 'Get all notifications' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of notifications',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @Audit(AuditAction.READ, AuditEntityType.NOTIFICATION, 'Listar notificaciones')
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.notificationsService.findAll(page, limit);
  }

  /**
   * Get notification by ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get notification by ID' })
  @ApiResponse({
    status: 200,
    description: 'Notification details with user information',
  })
  @ApiResponse({
    status: 404,
    description: 'Notification not found',
  })
  @ApiParam({ name: 'id', type: String })
  @Audit(AuditAction.READ, AuditEntityType.NOTIFICATION, 'Obtener notificación por ID')
  findOne(@Param('id') id: string) {
    return this.notificationsService.getNotificationById(id);
  }

  /**
   * Update notification
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update notification' })
  @ApiResponse({
    status: 200,
    description: 'Notification updated successfully',
  })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateNotificationDto })
  @Audit(AuditAction.UPDATE, AuditEntityType.NOTIFICATION, 'Actualizar notificación')
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationsService.update(id, updateNotificationDto);
  }

  /**
   * Delete notification (soft delete)
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete notification' })
  @ApiResponse({
    status: 200,
    description: 'Notification deleted successfully',
  })
  @ApiParam({ name: 'id', type: String })
  @Audit(AuditAction.DELETE, AuditEntityType.NOTIFICATION, 'Eliminar notificación')
  softDelete(@Param('id') id: string) {
    return this.notificationsService.softDelete(id);
  }

  /**
   * Mark notification as opened
   */
  @Post(':id/open')
  @ApiOperation({ summary: 'Mark notification as opened' })
  @ApiResponse({
    status: 200,
    description: 'Notification marked as opened',
  })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({
    schema: {
      example: { viewerId: 'user-uuid' },
    },
  })
  @Audit(AuditAction.UPDATE, AuditEntityType.NOTIFICATION, 'Marcar notificación como abierta')
  markAsOpened(@Param('id') id: string, @Body('viewerId') viewerId: string) {
    return this.notificationsService.markAsOpened(id, viewerId);
  }

  /**
   * Get notifications for a specific user
   */
  @Get('user/:userId')
  @ApiOperation({ summary: 'Get notifications for user' })
  @ApiResponse({
    status: 200,
    description: 'User notifications list',
  })
  @ApiParam({ name: 'userId', type: String })
  @Audit(AuditAction.READ, AuditEntityType.NOTIFICATION, 'Obtener notificaciones de usuario')
  getNotificationsForUser(@Param('userId') userId: string) {
    return this.notificationsService.getNotificationsForUser(userId);
  }

  /**
   * Mark all unread notifications as read for a user
   */
  @Patch('user/:userId/read-all')
  @ApiOperation({ summary: 'Mark all unread notifications as read for user' })
  @ApiResponse({
    status: 200,
    description: 'Number of notifications marked as read',
  })
  @ApiParam({ name: 'userId', type: String })
  @Audit(AuditAction.UPDATE, AuditEntityType.NOTIFICATION, 'Marcar todas las notificaciones como leídas')
  markAllAsRead(@Param('userId') userId: string) {
    return this.notificationsService.markAllAsRead(userId);
  }

  /**
   * Update notification status
   */
  @Patch(':id/status')
  @ApiOperation({ summary: 'Update notification status' })
  @ApiResponse({
    status: 200,
    description: 'Notification status updated',
  })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateNotificationStatusDto })
  @Audit(AuditAction.UPDATE, AuditEntityType.NOTIFICATION, 'Actualizar status de notificación')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateNotificationStatusDto,
  ) {
    return this.notificationsService.updateStatus(id, updateStatusDto.status);
  }

  /**
   * Get user notifications grid with filtering, sorting, and pagination
   */
  @Get('user/:userId/grid')
  @ApiOperation({ summary: 'Get user notifications grid' })
  @ApiResponse({
    status: 200,
    description: 'Paginated grid of user notifications',
  })
  @ApiParam({ name: 'userId', type: String })
  @ApiQuery({ name: 'fields', required: false, type: String, description: 'Comma-separated list of fields' })
  @ApiQuery({ name: 'sort', required: false, enum: ['asc', 'desc'], example: 'desc' })
  @ApiQuery({ name: 'sortField', required: false, type: String, example: 'createdAt' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'filtration', required: false, type: Boolean })
  @ApiQuery({ name: 'filters', required: false, type: String, description: 'Comma-separated filters like "type-INTEREST,status-SEND"' })
  @ApiQuery({ name: 'pagination', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 25 })
  @Audit(AuditAction.READ, AuditEntityType.NOTIFICATION, 'Obtener grid de notificaciones de usuario')
  getUserGridNotifications(
    @Param('userId') userId: string,
    @Query('fields') fields?: string,
    @Query('sort') sort?: 'asc' | 'desc',
    @Query('sortField') sortField?: string,
    @Query('search') search?: string,
    @Query('filtration') filtration?: string,
    @Query('filters') filters?: string,
    @Query('pagination') pagination?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(25), ParseIntPipe) limit?: number,
  ) {
    const filtrationBool = filtration === 'true';
    const paginationBool = pagination !== 'false'; // Default to true

    return this.notificationsService.userGridNotifications(userId, {
      fields,
      sort,
      sortField,
      search,
      filtration: filtrationBool,
      filters,
      pagination: paginationBool,
      page,
      limit,
    });
  }
}
