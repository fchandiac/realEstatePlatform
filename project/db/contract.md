# Contract

| Campo       | Tipo de Dato                        | NULL | Descripción                                                        |
|-------------|-------------------------------------|------|--------------------------------------------------------------------|
| id          | UUID (PK)                           | No   | Identificador único.                                               |
| userId      | UUID (FK → USER.id)                 | No   | Usuario que creó el contrato.                                      |
| propertyId  | UUID (FK → PROPERTY.id)             | No   | Propiedad vinculada.                                               |
| operation   | ENUM('VENTA', 'ARRIENDO')           | No   | Tipo de operación.                                                 |
| status      | ENUM('IN_PROCESS', 'CLOSED', 'FAILED', 'ON_HOLD') | No   | Estado actual.                                                     |
| endDate     | DATE                                | Sí   | Fecha de cierre/fallo.                                             |
| amount      | INT                                 | No   | Monto total.                                                       |
| commission  | FLOAT                               | No   | Porcentaje de comisión.                                            |
| payments    | JSON                                | Sí   | Pagos de arriendo (registro manual).                               |
| documents   | JSON                                | Sí   | Documentos requeridos (obligatorios para cerrar).                  |
| people      | JSON                                | No   | Personas asociadas (Vendedor, Comprador, etc.).                    |
| description | TEXT                                | Sí   | Descripción del contrato.                                          |

## Métodos asociados a la entidad Contract

| Método        | Parámetros                                              | Descripción                                                                 | Validaciones / Mensajes de error |
|---------------|---------------------------------------------------------|-----------------------------------------------------------------------------|-------------------------------|
| create        | userId, propertyId, operation, amount, commission, people, (opcional: endDate, payments, documents, description) | Crea un nuevo contrato.                                                      | Validar existencia de userId y propertyId. Si no existen: "Usuario o propiedad no encontrada." |
| findAll       | -                                                       | Obtiene la lista de todos los contratos (no incluye los eliminados lógicamente). | - |
| findOne       | id                                                      | Obtiene un contrato por su identificador único.                             | Si no existe: "Contrato no encontrado." |
| update        | id, datos a modificar                                   | Actualiza los datos de un contrato existente. Este método permite actualizar todos los datos o solo algunos campos (actualización parcial). | Validar existencia de contrato. |
| softDelete    | id                                                      | Realiza un borrado lógico (soft delete) del contrato, marcándolo como inactivo o eliminado sin quitarlo físicamente de la base de datos. | Si no existe: "Contrato no encontrado." |
| close         | id, endDate, documents                                  | Cierra el contrato.                                                         | Validar que todos los documentos requeridos estén presentes. Si faltan: "Faltan documentos obligatorios para cerrar el contrato." |
| fail          | id, endDate                                             | Marca el contrato como fallido.                                             | Si ya está cerrado o fallido: "El contrato ya está cerrado o fallido." |
| addPayment    | id, payment                                             | Agrega un pago al contrato.                                                  | Validar formato de payment. |
| addPerson     | id, person                                              | Agrega una persona asociada al contrato.                                    | Validar formato de person. |
| addDocument   | id, document                                            | Agrega un documento al contrato.                                            | Validar formato de document. |
