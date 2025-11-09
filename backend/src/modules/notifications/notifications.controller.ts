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
import { JweAuthGuard } from '../../auth/jwe/jwe-auth.guard';
import { Audit } from '../../common/interceptors/audit.interceptor';
import { AuditAction, AuditEntityType } from '../../common/enums/audit.enums';
import { NotificationsService } from './notifications.service';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
} from './dto/notification.dto';

@Controller('notifications')
@UseGuards(JweAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @Audit(AuditAction.CREATE, AuditEntityType.NOTIFICATION, 'Crear nueva notificación')
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @Audit(AuditAction.READ, AuditEntityType.NOTIFICATION, 'Listar notificaciones')
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.notificationsService.findAll(page, limit);
  }

  @Get(':id')
  @Audit(AuditAction.READ, AuditEntityType.NOTIFICATION, 'Obtener notificación por ID')
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id')
  @Audit(AuditAction.UPDATE, AuditEntityType.NOTIFICATION, 'Actualizar notificación')
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationsService.update(id, updateNotificationDto);
  }

  @Delete(':id')
  @Audit(AuditAction.DELETE, AuditEntityType.NOTIFICATION, 'Eliminar notificación')
  softDelete(@Param('id') id: string) {
    return this.notificationsService.softDelete(id);
  }

  @Post(':id/open')
  @Audit(AuditAction.UPDATE, AuditEntityType.NOTIFICATION, 'Marcar notificación como abierta')
  markAsOpened(@Param('id') id: string, @Body('viewerId') viewerId: string) {
    return this.notificationsService.markAsOpened(id, viewerId);
  }

  @Get('user/:userId')
  @Audit(AuditAction.READ, AuditEntityType.NOTIFICATION, 'Obtener notificaciones de usuario')
  getNotificationsForUser(@Param('userId') userId: string) {
    return this.notificationsService.getNotificationsForUser(userId);
  }
}
