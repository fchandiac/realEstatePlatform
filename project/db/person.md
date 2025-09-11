# PERSON Table Structure

| Campo                | Tipo de Dato                | NULL | Por Defecto | Descripción                                         |
|----------------------|-----------------------------|------|-------------|-----------------------------------------------------|
| id                   | UUID (PK)                   | No   | -           | Identificador único de la persona.                  |
| name                 | STRING                      | No   | -           | Nombre completo.                                    |
| dni                  | STRING (UNIQUE)             | Sí   | -           | Documento nacional de identidad (RUT en Chile).      |
| address              | STRING                      | Sí   | -           | Dirección de residencia.                            |
| phone                | STRING                      | Sí   | -           | Número telefónico.                                  |
| email                | STRING                      | Sí   | -           | Correo electrónico personal.                        |
| verified             | BOOLEAN                     | No   | FALSE       | Estado de verificación manual.                      |
| verificationRequest  | DATE                        | Sí   | -           | Fecha en que se solicitó la verificación.           |
| dniCardFrontId        | UUID (FK → MULTIMEDIA.id)   | Sí   | -           | Imagen frontal de la cédula.                        |
| dniCardRearId         | UUID (FK → MULTIMEDIA.id)   | Sí   | -           | Imagen trasera de la cédula.                        |
| userId               | UUID (FK → USER.id)         | Sí   | -           | Relación con un usuario si tiene cuenta.            |
