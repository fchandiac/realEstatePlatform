# Sistema de Notificaciones

## Descripción General

El sistema de notificaciones permite enviar alertas automáticas a los usuarios del sistema basadas en eventos específicos relacionados con propiedades y contratos. Las notificaciones se almacenan en la base de datos y pueden ser consultadas por los usuarios a través de la API.

## Arquitectura

### Entidades

#### Notification
- **Campos principales**:
  - `id`: UUID único de la notificación
  - `targetUserIds`: Array de IDs de usuarios destinatarios
  - `type`: Tipo de notificación (enum `NotificationType`)
  - `status`: Estado de la notificación (enum `NotificationStatus`)
  - `targetMails`: Array opcional de correos electrónicos adicionales
  - `multimediaId`: ID opcional de archivo multimedia adjunto
  - `createdAt`, `updatedAt`, `deletedAt`: Timestamps

#### NotificationType
Los tipos de notificación disponibles son:
- `INTERES`: Interés en una propiedad
- `CONTACTO`: Contacto desde el portal
- `COMPROBANTE_DE_PAGO`: Comprobante de pago
- `AVISO_PAGO_VENCIDO`: Aviso de pago vencido
- `CAMBIO_ESTADO_PUBLICACION`: Cambio en el estado de una propiedad
- `CAMBIO_ESTADO_CONTRATO`: Cambio en el estado de un contrato
- `NUEVA_ASIGNACION_PROPIEDAD_AGENTE`: Nueva asignación de agente a propiedad

#### NotificationStatus
- `SEND`: Notificación enviada
- `OPEN`: Notificación abierta por el usuario

### Servicios

#### NotificationsService
Gestiona la creación y consulta de notificaciones:

- `create(createNotificationDto)`: Crea una nueva notificación
- `findAll()`: Obtiene todas las notificaciones
- `findOne(id)`: Obtiene una notificación por ID
- `update(id, updateNotificationDto)`: Actualiza una notificación
- `softDelete(id)`: Elimina suavemente una notificación
- `markAsOpened(id, viewerId)`: Marca una notificación como abierta
- `getNotificationsForUser(userId)`: Obtiene notificaciones para un usuario específico

#### Métodos específicos para propiedades
- `notifyPropertyStatusChange(property, oldStatus, newStatus)`: Notifica cambio de estado de propiedad
- `notifyAgentAssigned(property, agent)`: Notifica asignación de agente a propiedad

### Controladores

#### NotificationsController
Expone endpoints REST para interactuar con notificaciones:

- `POST /notifications`: Crear notificación
- `GET /notifications`: Listar todas las notificaciones
- `GET /notifications/:id`: Obtener notificación por ID
- `PATCH /notifications/:id`: Actualizar notificación
- `DELETE /notifications/:id`: Eliminar notificación
- `POST /notifications/:id/open`: Marcar como abierta
- `GET /notifications/user/:userId`: Obtener notificaciones de un usuario

## Eventos y Lógica de Negocio

### Notificaciones de Propiedades

#### Cambio de Estado de Propiedad
- **Evento**: Cuando se cambia el estado de una propiedad usando `PropertyService.updateStatus()`
- **Destinatarios**:
  - Creador de la propiedad (`property.creatorUserId`)
  - Agente asignado (`property.assignedAgentId`), si existe
- **Tipo**: `CAMBIO_ESTADO_PUBLICACION`
- **Implementación**: Se ejecuta automáticamente después de guardar el cambio en la base de datos

#### Asignación de Agente
- **Evento**: Cuando se asigna un agente a una propiedad usando `PropertyService.update()`
- **Destinatarios**: El agente asignado (`updatePropertyDto.assignedAgentId`)
- **Tipo**: `NUEVA_ASIGNACION_PROPIEDAD_AGENTE`
- **Implementación**: Se ejecuta automáticamente cuando se detecta un cambio en `assignedAgentId`

### Estados de Propiedad
Los estados disponibles para propiedades son:
- `REQUEST`: Solicitud inicial
- `PRE-APPROVED`: Pre-aprobada
- `PUBLISHED`: Publicada
- `INACTIVE`: Inactiva
- `SOLD`: Vendida
- `RENTED`: Alquilada

## Integración con Servicios

### PropertyService
El servicio de propiedades está integrado con el sistema de notificaciones:

- Inyecta `NotificationsService` en el constructor
- Llama a métodos de notificación en `updateStatus()` y `update()`
- Maneja errores de notificación sin fallar la operación principal

### Módulos
- `NotificationsModule`: Define el módulo de notificaciones
- `PropertyModule`: Importa `NotificationsModule` para acceder al servicio

## API de Consulta

### Obtener Notificaciones de un Usuario
```http
GET /notifications/user/{userId}
```

Respuesta:
```json
[
  {
    "id": "uuid",
    "targetUserIds": ["user-uuid"],
    "type": "CAMBIO_ESTADO_PUBLICACION",
    "status": "SEND",
    "createdAt": "2023-...",
    "multimedia": null,
    "viewer": null
  }
]
```

### Marcar Notificación como Leída
```http
POST /notifications/{id}/open
Content-Type: application/json

{
  "viewerId": "user-uuid"
}
```

## Consideraciones Técnicas

### Auditoría
Todas las operaciones de notificación se registran en el sistema de auditoría global usando el decorador `@Audit`.

### Manejo de Errores
Los errores en el envío de notificaciones se registran en consola pero no interrumpen las operaciones principales de negocio.

### Soft Delete
Las notificaciones soportan eliminación suave (`deletedAt`) para mantener historial.

### Relaciones
- Una notificación puede tener múltiples destinatarios (`targetUserIds`)
- Una notificación puede estar asociada a un archivo multimedia opcional
- Una notificación puede ser marcada como vista por un usuario (`viewer`)

## Próximas Implementaciones

### Notificaciones de Contratos
- Cambio de estado de contratos
- Recordatorios de pagos
- Vencimientos de contratos

### Sistema de Email
- Envío automático de correos electrónicos para notificaciones críticas
- Templates personalizables

### Notificaciones en Tiempo Real
- WebSockets para notificaciones instantáneas
- Push notifications móviles