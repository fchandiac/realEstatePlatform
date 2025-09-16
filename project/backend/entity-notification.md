

# Entity Notification

La entidad Notification representa los mensajes generados automáticamente por el sistema para alertar a los usuarios sobre eventos importantes dentro del flujo de la aplicación. Estas notificaciones permiten mantener informados a los usuarios sobre acciones relevantes, cambios de estado, recordatorios y asignaciones, facilitando la gestión y seguimiento de las operaciones en la plataforma.

## Estructura de datos de la entidad

| Campo         | Tipo de Dato                                                                 | NULL | Descripción                                                                 |
|---------------|------------------------------------------------------------------------------|------|-----------------------------------------------------------------------------|
| id            | UUID (PK)                                                                   | No   | Identificador único de la notificación.                                     |
| targetUserIds | JSON (array de UUID, FK → USER.id)                                          | No   | Colección (array JSON) de IDs de usuarios que reciben la notificación. Permite notificar a uno o varios usuarios simultáneamente. Cada elemento debe ser un UUID válido de usuario registrado. |
| type          | ENUM('INTERES', 'CONTACTO', 'RECORDATORIO_DE_PAGO', 'COMPROBANTE_DE_PAGO', 'AVISO_PAGO_VENCIDO', 'CAMBIO_ESTADO_PUBLICACION', 'CAMBIO_ESTADO_CONTRATO', 'NUEVA_ASIGNACION_PROPIEDAD_AGENTE') | No   | Tipo de notificación.                                                       |
| multimediaId  | UUID (FK → MULTIMEDIA.id)                                                   | Sí   | Imagen asociada (solo una imagen).                                          |
| viewerId      | UUID (FK → USER.id)                                                         | Sí   | Usuario que abrió primero la notificación. Si es null, la notificación no ha sido abierta por ningún usuario. |
| targetMails   | JSON (array de string)                                                      | Sí   | Colección (array JSON) de correos electrónicos destinatarios de la notificación. Puede incluir correos de usuarios registrados o externos. |
| status        | ENUM('SEND', 'OPEN')                                                        | No   | Estado de la notificación: 'SEND' (enviada, no abierta), 'OPEN' (abierta por al menos un usuario). |

## ENUM status

| Valor ENUM | Descripción |
|------------|-------------|
| SEND       | Notificación enviada, aún no abierta por ningún usuario. |
| OPEN       | Notificación abierta por al menos un usuario (el usuario registrado en viewerId). |

## Tipos de notificación (ENUM type)

| Valor ENUM                        | Descripción                                      |
|-----------------------------------|--------------------------------------------------|
| INTERES                           | En la página de la propiedad, el usuario del portal puede mostrar interés sobre la propiedad. Esta notificación llega al usuario que tiene asignada la propiedad. |
| CONTACTO                          | Un usuario ha solicitado contacto desde el portal de la plataforma. Se solicita el nombre, teléfono y mail de la persona interesada. El mensaje llega a todos los administradores. |
| COMPROBANTE_DE_PAGO               | Se ha recibido un comprobante de pago.            |
| AVISO_PAGO_VENCIDO                | Aviso de que un pago está vencido.                |
| CAMBIO_ESTADO_PUBLICACION         | Cambio en el estado de una publicación. Notifica al usuario que solicitó la publicación: si no está registrado, solo por correo electrónico; si está registrado, por notificación y correo. Además, notifica al usuario que tiene asignada la propiedad. |
| CAMBIO_ESTADO_CONTRATO            | Cambio en el estado de un contrato. Notifica a los usuarios de la comunidad registrados y verificados como personas que pertenecen al contrato. |
| NUEVA_ASIGNACION_PROPIEDAD_AGENTE | Notificación enviada cuando un administrador asigna una propiedad a un agente. |