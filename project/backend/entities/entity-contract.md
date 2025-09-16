
# Entity Contract

La entidad Contract representa los acuerdos legales y comerciales entre partes para la compraventa o arriendo de un inmueble en el contexto de la plataforma. Permite gestionar toda la información relevante del contrato, incluyendo las partes involucradas, el tipo de operación, los documentos asociados, pagos, estado y roles mínimos requeridos según la operación.

## Estructura de datos de la entidad

| Campo       | Tipo de Dato                        | NULL | Descripción                                                        |
|-------------|-------------------------------------|------|--------------------------------------------------------------------|
| id          | UUID (PK)                           | No   | Identificador único.                                               |
| userId      | UUID (FK → USER.id)                 | No   | Usuario que creó el contrato.                                      |
| propertyId  | UUID (FK → PROPERTY.id)             | No   | Propiedad vinculada.                                               |
| operation   | ENUM(contractOperationType)          | No   | Tipo de operación.                                                 |
| status      | ENUM(contractStatus)                 | No   | Estado actual.                                                     |
| endDate     | DATE                                | Sí   | Fecha de cierre/fallo.                                             |
| amount      | INT                                 | No   | Monto total.                                                       |
| commissionPercent  | FLOAT                        | No   | Porcentaje de comisión.                                            |
| commissionAmount   | FLOAT                        | No   | Monto de la comisión calculada para el contrato.                   |
| payments    | JSON                                | Sí   | Pagos de arriendo (registro manual).                               |
| documents   | JSON                                | Sí   | Documentos requeridos (obligatorios para cerrar).                  |
| people      | JSON                                | No   | Personas asociadas al contrato, cada una con su rol (ver ENUM ContractRole). Ejemplo: [{ "personId": "uuid", "role": "TENANT" }]. |
| description | TEXT                                | Sí   | Descripción del contrato.                                          |



### ENUM contractOperationType

| Valor ENUM    | Nombre en español | Descripción                                                        |
|---------------|-------------------|--------------------------------------------------------------------|
| COMPRAVENTA   | Compraventa       | Contrato de compraventa de un inmueble.                            |
| ARRIENDO      | Arriendo          | Contrato de arriendo de un inmueble.                               |

### ENUM contractStatus

| Valor ENUM   | Nombre en español | Descripción                                                        |
|-------------|-------------------|--------------------------------------------------------------------|
| IN_PROCESS  | En proceso        | El contrato está en proceso, aún no se ha cerrado ni fallado.       |
| CLOSED      | Cerrado           | El contrato ha sido cerrado exitosamente.                          |
| FAILED      | Fallido           | El contrato ha fallado o no se concretó.                           |
| ON_HOLD     | En espera         | El contrato está en pausa o pendiente de alguna acción.             |


## Métodos asociados a la entidad Contract

| Método        | Parámetros                                              | Descripción                                                                 | Validaciones / Mensajes de error |
|---------------|---------------------------------------------------------|-----------------------------------------------------------------------------|-------------------------------|
| create        | userId, propertyId, operation, amount, commissionPercent, commissionAmount, people, (opcional: endDate, payments, documents, description) | Crea un nuevo contrato.                                                      | Validar existencia de userId y propertyId. Si no existen: "Usuario o propiedad no encontrada." |
| findAll       | -                                                       | Obtiene la lista de todos los contratos (no incluye los eliminados lógicamente). | - |
| findOne       | id                                                      | Obtiene un contrato por su identificador único.                             | Si no existe: "Contrato no encontrado." |
| update        | id, datos a modificar (incluye commissionPercent y commissionAmount) | Actualiza los datos de un contrato existente. Este método permite actualizar todos los datos o solo algunos campos (actualización parcial). | Validar existencia de contrato. |
| softDelete    | id                                                      | Realiza un borrado lógico (soft delete) del contrato, marcándolo como inactivo o eliminado sin quitarlo físicamente de la base de datos. | Si no existe: "Contrato no encontrado." |
| close         | id, endDate, documents                                  | Cierra el contrato.                                                         | Validar que todos los documentos requeridos estén presentes y que el contrato tenga los roles mínimos según la operación (COMPRAVENTA: SELLER y BUYER, ARRIENDO: LANDLORD y TENANT). Si faltan: "Faltan documentos obligatorios o roles mínimos para cerrar el contrato." |
| fail          | id, endDate                                             | Marca el contrato como fallido.                                             | Si ya está cerrado o fallido: "El contrato ya está cerrado o fallido." |
| addPayment    | id, payment                                             | Agrega un pago al contrato.                                                  | Validar formato de payment. |
| addPerson     | id, personId, role                                      | Agrega una persona asociada al contrato con un rol específico.              | Validar formato de personId y que el rol sea válido según ENUM ContractRole. |
| getPeopleByRole | id, role                                              | Obtiene las personas asociadas a un contrato con un rol específico.         | Validar existencia de contrato y rol. |
| validateRequiredRoles | id                                              | Valida que el contrato tenga los roles requeridos según el tipo de operación. <br>**Para VENTA:** SELLER y BUYER. <br>**Para ARRIENDO:** LANDLORD y TENANT. | Si faltan roles: "Faltan roles obligatorios para este tipo de contrato." |
| addDocument   | id, document                                            | Agrega un documento al contrato.                                            | Validar formato de document. |


## ENUM: ContractRole

Define los roles posibles de una persona dentro de un contrato. Todos los valores son en inglés.

| Valor        | Descripción                |
|--------------|---------------------------|
| SELLER       | Vendedor                  |
| BUYER        | Comprador                 |
| LANDLORD     | Arrendador                |
| TENANT       | Arrendatario              |
| GUARANTOR    | Avalista/Garante          |
| AGENT        | Corredor/Agente           |

La justificación legal de los roles principales es la siguiente:

- **SELLER** y **BUYER**: Según el artículo 1793 del Código Civil de Chile, las partes en la compraventa son el vendedor (quien se obliga a dar una cosa) y el comprador (quien se obliga a pagar el precio en dinero).
- **LANDLORD** y **TENANT**: Según el artículo 1916 del Código Civil de Chile, las partes en el arriendo son el arrendador (LANDLORD) y el arrendatario (TENANT).

Se pueden agregar más roles según necesidades del negocio.

## Referencia legal sobre los roles SELLER y BUYER

El Código Civil de Chile menciona por primera vez a las partes de la compraventa en el artículo 1793:

**Artículo 1793 del Código Civil de Chile:**

"La compraventa es un contrato en que una de las partes se obliga a dar una cosa y la otra a pagarla en dinero. Aquélla se dice vender y ésta comprar. El dinero que el comprador da por la cosa vendida, se llama precio."

Este artículo define las partes del contrato de compraventa como:
- Vendedor: Quien se obliga a dar una cosa.
- Comprador: Quien se obliga a pagar el precio en dinero.

Por lo tanto, el artículo 1793 es la base legal para los roles SELLER y BUYER en este modelo.


## Referencia legal sobre los roles LANDLORD, TENANT, SELLER y BUYER

**LANDLORD y TENANT:**

El uso de los términos LANDLORD (arrendador) y TENANT (arrendatario) en este modelo se fundamenta en la legislación chilena:

**Artículo 1916 del Código Civil de Chile:**

"Artículo 1916. Son susceptibles de arrendamiento todas las cosas corporales o incorporales que pueden usarse sin consumirse; excepto aquellas que la ley prohíbe arrendar, y los derechos estrictamente personales, como los de habitación y uso.

Puede arrendarse aun la cosa ajena, y el arrendatario de buena fe tendrá acción de saneamiento contra el arrendador, en caso de evicción."

Esta fuente respalda la definición y denominación de los roles LANDLORD (arrendador) y TENANT (arrendatario) en los contratos de arriendo.

**SELLER y BUYER:**

El Código Civil de Chile menciona por primera vez a las partes de la compraventa en el artículo 1793:

**Artículo 1793 del Código Civil de Chile:**

"La compraventa es un contrato en que una de las partes se obliga a dar una cosa y la otra a pagarla en dinero. Aquélla se dice vender y ésta comprar. El dinero que el comprador da por la cosa vendida, se llama precio."

Este artículo define las partes del contrato de compraventa como:
- Vendedor: Quien se obliga a dar una cosa.
- Comprador: Quien se obliga a pagar el precio en dinero.

Por lo tanto, el artículo 1793 es la base legal para los roles SELLER y BUYER en este modelo.

## Tabla de roles posibles en contratos de arriendo y compraventa en Chile

| Rol                        | Valor ENUM         | Descripción                                                                 | ¿Está regulado explícitamente? | Fuente         |
|----------------------------|--------------------|-----------------------------------------------------------------------------|-------------------------------|----------------|
| Vendedor                   | SELLER             | Parte que se obliga a transferir el dominio de un bien a cambio de un precio.| Sí, Código Civil art. 1793    | BCN Chile: http://www.bcn.cl/leychile/navegar?idNorma=172986 |
| Comprador                  | BUYER              | Parte que se obliga a pagar el precio en dinero por el bien adquirido.       | Sí, Código Civil art. 1793    | BCN Chile: http://www.bcn.cl/leychile/navegar?idNorma=172986 |
| Arrendador                 | LANDLORD           | Propietario o quien cede el uso y goce de un bien a cambio de una renta.     | Sí, Código Civil art. 1915    | BCN Chile: http://www.bcn.cl/leychile/navegar?idNorma=172986 |
| Arrendatario               | TENANT             | Quien recibe el uso o goce del bien y paga la renta.                         | Sí, Código Civil art. 1915    | BCN Chile: http://www.bcn.cl/leychile/navegar?idNorma=172986 |
| Notario / Ministro de Fe   | NOTARY             | Funcionario público que autoriza y da fe de la escritura pública requerida para la compraventa. | Sí, Ley de Notariado y práctica obligatoria para inmuebles. | Vlex Chile: https://vlex.cl     |
| Conservador de Bienes Raíces| REGISTRAR          | Encargado de inscribir la escritura en el registro para perfeccionar la tradición de dominio. | Sí, Código Civil art. 686 y Ley de Registro Conservatorio. | SII Chile: http://www.sii.cl      |
| Testigos                   | WITNESS            | Personas que firman para certificar las firmas o hechos, reforzando la prueba del contrato. | No en todos los casos, pero reconocidos en materia probatoria. | SII Chile: http://www.sii.cl      |
| Fiador o Aval              | GUARANTOR          | Persona que garantiza el cumplimiento de las obligaciones de una de las partes. | Regulación general de fianzas en Código Civil arts. 2335 y ss. | BCN Chile: http://www.bcn.cl/leychile/navegar?idNorma=172986      |
| Apoderado o Representante  | REPRESENTATIVE     | Persona autorizada para actuar en nombre de una de las partes.               | Sí, regulado por normas sobre mandato. | Portal Ijurídica: http://www.portal.ijuridica.cl |
| Promitente comprador/vendedor | PROMISSOR         | Parte de un contrato de promesa que se obliga a celebrar en el futuro una compraventa. | Sí, regulado en Código Civil arts. 1554 y siguientes. | BCN Chile: http://www.bcn.cl/leychile/navegar?idNorma=172986      |
| Terceros interesados (ej. acreedor hipotecario) | THIRD_PARTY        | Persona con derechos reales o gravámenes que pueden afectar la operación. | Sí, regulado por normas sobre hipoteca y gravámenes. | Vlex Chile: https://vlex.cl     |
| Corredor de propiedades    | AGENT              | Intermediario que facilita la operación, aunque no es parte contractual.     | No regulado en Código Civil, pero sí en normativa comercial y costumbre. | Vlex Chile: https://vlex.cl     |