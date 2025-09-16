# Entity DocumentType

La entidad DocumentType existe exclusivamente para ser utilizada por la entidad Contract, en el campo `documents`. Su único propósito es definir y tipificar los documentos que pueden ser requeridos o adjuntados a un contrato dentro de la plataforma. No tiene otra función ni relación directa con otras entidades o procesos fuera del ciclo de vida de los contratos.


## Estructura de datos de la entidad

| Campo       | Tipo de Dato | NULL | Descripción                                      |
|-------------|--------------|------|--------------------------------------------------|
| id          | UUID (PK)    | No   | Identificador único del tipo de documento.        |
| name        | VARCHAR (UNIQUE) | No   | Nombre del documento (ej. “Cédula”, “Escritura”).|
| description | VARCHAR      | Sí   | Descripción detallada.                            |
| available   | BOOLEAN      | No   | Indica si está habilitado en el sistema.          |

## Métodos asociados a la entidad DocumentType

| Método      | Parámetros                        | Descripción                                                        | Validaciones / Mensajes de error |
|-------------|-----------------------------------|--------------------------------------------------------------------|-------------------------------|
| create      | name, description (opcional), available | Crea un nuevo tipo de documento.                                   | Validar que name no exista previamente. Si existe: "El nombre del tipo de documento ya está registrado." |
| findAll     | -                                 | Obtiene la lista de todos los tipos de documento (no incluye los eliminados lógicamente). | - |
| findOne     | id                                | Obtiene un tipo de documento por su identificador único.           | Si no existe: "Tipo de documento no encontrado." |
| update      | id, datos a modificar             | Actualiza los datos de un tipo de documento existente. Este método permite actualizar todos los datos o solo algunos campos (actualización parcial). | Validar unicidad de name si se modifica. Si existe: "El nombre del tipo de documento ya está registrado." |
| softDelete  | id                                | Realiza un borrado lógico (soft delete) del tipo de documento, marcándolo como inactivo o eliminado sin quitarlo físicamente de la base de datos. | Si no existe: "Tipo de documento no encontrado." |
| setAvailable| id, available                     | Cambia el estado de disponibilidad del tipo de documento.          | Validar que el valor de available sea booleano. |


## Documentos requeridos según tipo de operación

| Documento                                              | Operación      | Descripción                                                                                   |
|--------------------------------------------------------|----------------|-----------------------------------------------------------------------------------------------|
| Escritura de compraventa                               | COMPRAVENTA    | Escritura pública que formaliza la transferencia de dominio.                                  |
| Borrador de inscripción Conservador Bienes Raíces      | COMPRAVENTA    | Documento para inscribir la propiedad a nombre del comprador en el Conservador.               |
| Certificado de no expropiación/antecedentes municipales| COMPRAVENTA    | Certifica que la propiedad no está afecta a expropiación o tiene antecedentes municipales.     |
| Plano o croquis del inmueble                           | COMPRAVENTA    | Plano o croquis requerido para subdivisiones o especificaciones del inmueble.                 |
| Tasación o informe de avalúo comercial                 | COMPRAVENTA    | Informe opcional que respalda el precio de compraventa.                                       |
| Mandatos o poderes                                     | COMPRAVENTA    | Documento que acredita representación de vendedor o comprador.                                |
| Comprobante de pago/carta de resguardo notarial        | COMPRAVENTA    | Respaldo de pagos, especialmente si hay créditos hipotecarios o pagos en cuotas.              |
| Certificado de deuda hipotecaria y autorización banco  | COMPRAVENTA    | Certifica deuda y autorización para levantar hipoteca si aplica.                              |
| Contrato de arriendo                                   | ARRIENDO       | Contrato privado o electrónico que regula la relación de arriendo.                            |
| Inventario detallado del inmueble y bienes muebles     | ARRIENDO       | Listado firmado por ambas partes con el estado de conservación del inmueble y bienes.         |
| Recibo de garantía/boleta bancaria                     | ARRIENDO       | Respaldo de la garantía entregada por el arrendatario.                                       |
| Comprobante de último pago de gastos comunes/servicios | ARRIENDO       | Acredita que no existen deudas previas de gastos comunes o servicios básicos.                 |
| Certificado de copropiedad/reglamento de condominio    | ARRIENDO       | Documento requerido si el inmueble está en edificio o condominio.                             |
| Datos de contacto para notificaciones                  | ARRIENDO       | Información de contacto de las partes para notificaciones legales.                            |
| Autorizaciones o poderes especiales                    | AMBAS          | Documento que acredita representación especial para firmar o actuar en nombre de otro.        |
| Certificado de habitabilidad/recepción final           | AMBAS          | Certifica que el inmueble es habitable o cuenta con recepción final municipal.                |
| Seguros asociados (incendio, hogar, etc.)              | AMBAS          | Pólizas de seguro exigidas por hipotecas o para respaldo de las partes.                       |
| Boletas/facturas de pagos a corredores/plataformas     | AMBAS          | Respaldo de pagos realizados a intermediarios o plataformas.                                  |
| Cláusulas adicionales anexas                           | AMBAS          | Anexos con acuerdos de mantenimiento, condiciones especiales, etc.                            |

