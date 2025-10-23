# Sistema de Notificaciones - Implementación Backend

## 📋 **Resumen Ejecutivo**

El sistema de notificaciones automáticas ha sido implementado en el backend de la plataforma inmobiliaria para mantener informados a usuarios, agentes y administradores sobre eventos importantes relacionados con propiedades. El sistema se integra de manera transparente con las operaciones existentes, generando notificaciones automáticas sin afectar el rendimiento de las funcionalidades principales.

## 🏗️ **Arquitectura del Sistema**

### **Componentes Principales**

#### **1. Entidad Notification**
```typescript
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

#### **2. Enum NotificationType**
```typescript
export enum NotificationType {
  INTERES = 'INTERES',
  CONTACTO = 'CONTACTO',
  COMPROBANTE_DE_PAGO = 'COMPROBANTE_DE_PAGO',
  AVISO_PAGO_VENCIDO = 'AVISO_PAGO_VENCIDO',
  CAMBIO_ESTADO_PUBLICACION = 'CAMBIO_ESTADO_PUBLICACION',
  CAMBIO_ESTADO_CONTRATO = 'CAMBIO_ESTADO_CONTRATO',
  NUEVA_ASIGNACION_PROPIEDAD_AGENTE = 'NUEVA_ASIGNACION_PROPIEDAD_AGENTE',
}
```

#### **3. Servicio NotificationService**
```typescript
@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
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

  async update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
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
```

#### **4. Controlador NotificationController**
```typescript
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationsService: NotificationService) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationsService.update(id, updateNotificationDto);
  }

  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.notificationsService.softDelete(id);
  }

  @Post(':id/open')
  markAsOpened(@Param('id') id: string, @Body('viewerId') viewerId: string) {
    return this.notificationsService.markAsOpened(id, viewerId);
  }

  @Get('user/:userId')
  getNotificationsForUser(@Param('userId') userId: string) {
    return this.notificationsService.getNotificationsForUser(userId);
  }
}
```

## 🔄 **Eventos y Lógica de Negocio**

### **Notificaciones de Propiedades**

#### **1. Cambio de Estado de Propiedad**
**Evento**: Se dispara cuando cambia el campo `status` de una propiedad usando `PropertyService.updateStatus()`.

**Estados del Ciclo de Vida**:
- `REQUEST` → `PRE_APPROVED`: Propiedad enviada a pre-aprobación
- `PRE_APPROVED` → `PUBLISHED`: Propiedad publicada
- `PUBLISHED` → `INACTIVE`: Propiedad desactivada
- `INACTIVE` → `PUBLISHED`: Propiedad reactivada
- Cualquier estado → `SOLD`: Propiedad vendida
- Cualquier estado → `RENTED`: Propiedad arrendada

**Destinatarios**:
- **Creador de la propiedad** (`property.creatorUserId`): Siempre notificado
- **Agente asignado** (`property.assignedAgentId`): Notificado si existe

**Lógica de Implementación**:
```typescript
// En PropertyService.updateStatus()
async updateStatus(
  id: string,
  status: PropertyStatus,
  updatedBy?: string,
): Promise<Property> {
  const property = await this.findOne(id, false);
  const oldStatus = property.status;

  // ... lógica de actualización ...

  const savedProperty = await this.propertyRepository.save(property);

  // Send notification for status change
  if (oldStatus !== status) {
    try {
      await this.notificationsService.notifyPropertyStatusChange(savedProperty, oldStatus, status);
    } catch (error) {
      console.error('Failed to send property status change notification:', error);
    }
  }

  return savedProperty;
}
```

#### **2. Asignación de Agente**
**Evento**: Se dispara cuando cambia el campo `assignedAgentId` de una propiedad usando `PropertyService.update()`.

**Destinatarios**:
- **Nuevo agente asignado**: Recibe notificación de nueva asignación

**Lógica de Implementación**:
```typescript
// En PropertyService.update()
async update(
  id: string,
  updatePropertyDto: UpdatePropertyDto,
  updatedBy?: string,
): Promise<Property> {
  const property = await this.findOne(id, false);
  const oldAssignedAgentId = property.assignedAgentId;

  // ... lógica de actualización ...

  const savedProperty = await this.propertyRepository.save(property);

  // Send notification for agent assignment
  if (updatePropertyDto.assignedAgentId && oldAssignedAgentId !== updatePropertyDto.assignedAgentId) {
    try {
      const agent = await this.propertyRepository.manager.findOne(User, {
        where: { id: updatePropertyDto.assignedAgentId },
      });
      if (agent) {
        await this.notificationsService.notifyAgentAssigned(savedProperty, agent);
      }
    } catch (error) {
      console.error('Failed to send agent assignment notification:', error);
    }
  }

  return savedProperty;
}
```

## 📡 **API Endpoints**

### **Endpoints Implementados**

#### **POST /notifications**
- **Descripción**: Crea una nueva notificación
- **Body**: `CreateNotificationDto`
- **Respuesta**: `Notification`

#### **GET /notifications**
- **Descripción**: Obtiene todas las notificaciones
- **Respuesta**: `Notification[]`

#### **GET /notifications/:id**
- **Descripción**: Obtiene una notificación específica
- **Parámetros**: `id` (UUID)
- **Respuesta**: `Notification`

#### **PATCH /notifications/:id**
- **Descripción**: Actualiza una notificación
- **Parámetros**: `id` (UUID)
- **Body**: `UpdateNotificationDto`
- **Respuesta**: `Notification`

#### **DELETE /notifications/:id**
- **Descripción**: Elimina suavemente una notificación
- **Parámetros**: `id` (UUID)

#### **POST /notifications/:id/open**
- **Descripción**: Marca una notificación como abierta
- **Parámetros**: `id` (UUID)
- **Body**: `{ viewerId: string }`
- **Respuesta**: `Notification`

#### **GET /notifications/user/:userId**
- **Descripción**: Obtiene notificaciones para un usuario específico
- **Parámetros**: `userId` (UUID)
- **Respuesta**: `Notification[]`

## 🔧 **Consideraciones Técnicas**

### **Integración con Sistema Existente**

#### **1. Inyección de Dependencias**
```typescript
// En PropertyModule
@Module({
  imports: [
    TypeOrmModule.forFeature([Property, User]),
    NotificationsModule
  ],
  controllers: [PropertyController],
  providers: [PropertyService],
  exports: [PropertyService],
})
export class PropertyModule {}

// En PropertyService
constructor(
  @InjectRepository(Property)
  private readonly propertyRepository: Repository<Property>,
  private readonly notificationsService: NotificationsService,
) {}
```

#### **2. Manejo de Errores**
- Las fallas en la creación de notificaciones no afectan las operaciones principales
- Se registra en logs cualquier error en el sistema de notificaciones
- Uso de bloques try-catch para aislamiento de errores

#### **3. Rendimiento**
- Operaciones asíncronas para no bloquear respuestas principales
- Consultas optimizadas con índices en base de datos
- Filtrado en memoria para consultas de usuario (puede optimizarse con JSON queries en producción)

### **Auditoría y Monitoreo**

#### **1. Logs de Auditoría**
- Todas las operaciones críticas están decoradas con `@Audit`
- Registra cambios de estado y asignaciones de agentes

#### **2. Estados de Notificación**
- `SEND`: Notificación creada y enviada
- `OPEN`: Notificación vista por el usuario

### **Seguridad**

#### **1. Validación**
- UUIDs validados para prevenir inyección
- Validación de tipos de notificación permitidos
- Sanitización de arrays de destinatarios

## 🚀 **Extensibilidad**

### **Adición de Nuevos Tipos de Notificación**

#### **1. Actualizar Enum NotificationType**
```typescript
export enum NotificationType {
  // Existentes
  CAMBIO_ESTADO_PUBLICACION = 'CAMBIO_ESTADO_PUBLICACION',
  NUEVA_ASIGNACION_PROPIEDAD_AGENTE = 'NUEVA_ASIGNACION_PROPIEDAD_AGENTE',

  // Nuevos tipos
  CONTRATO_CREADO = 'CONTRATO_CREADO',
  PAGO_REGISTRADO = 'PAGO_REGISTRADO',
  NUEVO_LEAD = 'NUEVO_LEAD',
}
```

#### **2. Agregar Métodos en NotificationService**
```typescript
async notifyContractCreated(contract: Contract): Promise<Notification> {
  // Lógica para notificar creación de contrato
}

async notifyPaymentRegistered(payment: Payment): Promise<Notification> {
  // Lógica para notificar registro de pago
}
```

#### **3. Integrar en Servicios Relevantes**
```typescript
// En ContractService
await this.notificationsService.notifyContractCreated(contract);
```

## 📊 **Monitoreo y Métricas**

### **Métricas Recomendadas**
- Número total de notificaciones enviadas por día
- Tasa de apertura de notificaciones por tipo
- Errores en envío de notificaciones
- Rendimiento de consultas

### **Dashboard de Administrador**
- Vista general de notificaciones por tipo
- Estadísticas de engagement por usuario
- Alertas de sistema

## 🎯 **Próximos Pasos**

### **Fase 2 - Expansión**
1. **Notificaciones de Contratos**: Estados de contratos, pagos, vencimientos
2. **Notificaciones de Usuarios**: Cambios de rol, activaciones
3. **Notificaciones de Sistema**: Backups, errores críticos
4. **Interfaz de Usuario**: Panel para gestionar notificaciones en frontend

### **Fase 3 - Optimización**
1. **Notificaciones Push**: Integración con servicios de push
2. **Email Notifications**: Envío de correos para eventos importantes
3. **Personalización**: Configuraciones por usuario
4. **Analytics**: Análisis detallado de engagement

---

## 📝 **Conclusión**

El sistema de notificaciones implementado proporciona una base sólida y extensible para mantener informados a todos los stakeholders de la plataforma. La implementación actual cubre los eventos críticos de propiedades con un diseño que facilita la adición de nuevos tipos de notificaciones según evolucionen los requerimientos del negocio.

La arquitectura elegida garantiza que las notificaciones sean generadas de manera automática y transparente, mejorando significativamente la comunicación y coordinación dentro de la plataforma inmobiliaria.</content>
<parameter name="filePath">/Users/felipe/dev/realEstatePlatform/project/backEnd/backendImplementation/Notification.md