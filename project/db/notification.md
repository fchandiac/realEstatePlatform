## Tipos de notificación (ENUM type)

| Valor ENUM                        | Descripción                                      |
|-----------------------------------|--------------------------------------------------|
| INTERES                           | En la página de la propiedad, el usuario del portal puede mostrar interés sobre la propiedad. Esta notificación llega al usuario que tiene asignada la propiedad. |
| CONTACTO                          | Un usuario ha solicitado contacto desde el portal de la plataforma. Se solicita el nombre, teléfono y mail de la persona interesada. El mensaje llega a todos los administradores. |
| RECORDATORIO_DE_PAGO              | Recordatorio de pago pendiente.                   |
| COMPROBANTE_DE_PAGO               | Se ha recibido un comprobante de pago.            |
| AVISO_PAGO_VENCIDO                | Aviso de que un pago está vencido.                |
| CAMBIO_ESTADO_PUBLICACION         | Cambio en el estado de una publicación.           |
| CAMBIO_ESTADO_CONTRATO            | Cambio en el estado de un contrato.               |
| NUEVA_ASIGNACION_PROPIEDAD_AGENTE | Nueva asignación de propiedad a un agente.        |
# Notification

| Campo         | Tipo de Dato                                                                 | NULL | Descripción                                                                 |
|---------------|------------------------------------------------------------------------------|------|-----------------------------------------------------------------------------|
| id            | UUID (PK)                                                                   | No   | Identificador único de la notificación.                                     |
| senderUserId  | UUID (FK → USER.id)                                                         | No   | Usuario que envía la notificación.                                          |
| targetUserId  | UUID (FK → USER.id)                                                         | No   | Usuario que recibe la notificación.                                         |
| type          | ENUM('INTERES', 'CONTACTO', 'RECORDATORIO_DE_PAGO', 'COMPROBANTE_DE_PAGO', 'AVISO_PAGO_VENCIDO', 'CAMBIO_ESTADO_PUBLICACION', 'CAMBIO_ESTADO_CONTRATO', 'NUEVA_ASIGNACION_PROPIEDAD_AGENTE') | No   | Tipo de notificación.                                                       |
| multimediaId  | UUID (FK → MULTIMEDIA.id)                                                   | Sí   | Imagen asociada (solo una imagen).                                          |
