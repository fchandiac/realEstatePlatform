# User Table Structure

| Campo         | Tipo de Dato                                 | NULL | Por Defecto | Descripción                                                |
|---------------|----------------------------------------------|------|-------------|------------------------------------------------------------|
| id            | UUID (PK)                                    | No   | -           | Identificador único del usuario.                           |
| username      | STRING                                       | No   | -           | Nombre de usuario único.                                   |
| mail          | STRING (UNIQUE)                              | No   | -           | Correo electrónico único, usado para login.                |
| passwordHash  | VARCHAR                                      | No   | -           | Hash de la contraseña.                                     |
| passwordSalt  | VARCHAR                                      | No   | -           | Salt para reforzar seguridad del hash.                     |
| status        | ENUM('ACTIVE', 'INACTIVE', 'VACATION', 'LEAVE') | No   | ACTIVE      | Estado del usuario.                                        |
| role          | ENUM('SUPERADMIN', 'ADMIN', 'AGENT', 'COMMUNITY') | No   | COMMUNITY   | Rol único asignado al usuario.                             |
| permissions   | JSON                                         | Sí   | {}          | Lista de permisos adicionales definida por un administrador.|
| personalInfo  | JSON                                         | Sí   | {}           | Información adicional (ej. preferencias, perfil extendido). |
