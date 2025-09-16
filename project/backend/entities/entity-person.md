# Entity Person

La entidad Person representa a una persona real, independiente de su relación con la plataforma. Puede corresponder a un usuario registrado o a una persona que solo forma parte de un contrato (por ejemplo, como comprador, vendedor, arrendador o arrendatario), sin necesidad de tener cuenta propia en el sistema. Permite almacenar y gestionar la información básica de identificación y contacto de personas físicas vinculadas a operaciones o contratos.

## Estructura de datos de la entidad

| Campo                | Tipo de Dato                | NULL | Por Defecto | Descripción                                         |
|----------------------|-----------------------------|------|-------------|-----------------------------------------------------|
| id                   | UUID (PK)                   | No   | -           | Identificador único de la persona.                  |
| name                 | STRING                      | Sí   | -           | Nombre completo.                                    |
| dni                  | STRING (UNIQUE)             | Sí   | -           | Documento nacional de identidad (RUT en Chile).      |
| address              | STRING                      | Sí   | -           | Dirección de residencia.                            |
| phone                | STRING                      | Sí   | -           | Número telefónico.                                  |
| email                | STRING                      | Sí   | -           | Correo electrónico personal.                        |
| verified             | BOOLEAN                     | No   | FALSE       | Estado de verificación manual.                      |
| verificationRequest  | DATE                        | Sí   | -           | Fecha en que se solicitó la verificación.           |
| dniCardFrontId        | UUID (FK → MULTIMEDIA.id)   | Sí   | -           | Imagen frontal de la cédula.                        |
| dniCardRearId         | UUID (FK → MULTIMEDIA.id)   | Sí   | -           | Imagen trasera de la cédula.                        |
| userId               | UUID (FK → USER.id)         | Sí   | -           | Relación con un usuario si tiene cuenta.            |

## Métodos asociados a la entidad Person

| Método           | Descripción                                              | Validaciones / Mensajes de error |
|------------------|----------------------------------------------------------|-------------------------------|
| create           | Crea una nueva persona.                                  | Validar que dni (si se provee) no exista previamente. Si existe: "El DNI ya está registrado." |
| findAll          | Obtiene la lista de todas las personas (no incluye las eliminadas lógicamente). | - |
| findOne          | Obtiene una persona por su identificador único.          | Si no existe: "Persona no encontrada." |
| update           | Actualiza los datos de una persona existente. Este método permite actualizar todos los datos o solo algunos campos (actualización parcial). | Validar unicidad de dni si se modifica. Si existe: "El DNI ya está registrado." |
| softDelete       | Realiza un borrado lógico (soft delete) de la persona, marcándola como inactiva o eliminada sin quitarla físicamente de la base de datos. | Si no existe: "Persona no encontrada." |
| verify           | Marca a la persona como verificada.                      | Si ya está verificada: "La persona ya está verificada." |
| unverify         | Revierte el estado de verificación de la persona.        | Si no está verificada: "La persona no está verificada." |
| requestVerification | Solicita la verificación de la persona. Este método enviará una notificación a los administradores. | Si ya hay una solicitud pendiente: "Ya existe una solicitud de verificación pendiente." |
| linkUser         | Relaciona una persona con un usuario del sistema.        | Validar que el usuario exista y no esté ya vinculado. |
| unlinkUser       | Elimina la relación con un usuario.                      | Si no hay usuario vinculado: "No existe usuario vinculado a esta persona." |
