# PERSON

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

| Método           | Descripción                                              |
|------------------|----------------------------------------------------------|
| create           | Crea una nueva persona.                                  |
| findAll          | Obtiene la lista de todas las personas.                  |
| findOne          | Obtiene una persona por su identificador único.          |
| update           | Actualiza los datos de una persona existente. Este método permite actualizar todos los datos o solo algunos campos (actualización parcial). |
| delete           | Elimina una persona del sistema.                         |
| verify           | Marca a la persona como verificada.                      |
| requestVerification | Solicita la verificación de la persona. Este método enviará una notificación a los administradores. |
| linkUser         | Relaciona una persona con un usuario del sistema.        |
| unlinkUser       | Elimina la relación con un usuario.                      |
