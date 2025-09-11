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

## Métodos asociados a la entidad User

| Método      | Descripción                                              |
|-------------|----------------------------------------------------------|
| create      | Crea un nuevo usuario. Automáticamente se creará una persona vacía asociada llamando al método create de Person. |
| findAll     | Obtiene la lista de todos los usuarios.                  |
| findOne     | Obtiene un usuario por su identificador único.           |
| update      | Actualiza los datos de un usuario existente.             |
| delete      | Elimina un usuario del sistema.                          |
| login       | Autentica a un usuario y genera un token de acceso.      |
| changePassword | Permite al usuario cambiar su contraseña.             |
| setStatus   | Cambia el estado del usuario (activo, inactivo, etc).    |
| assignRole  | Asigna o cambia el rol de un usuario.                    |
| setPermissions | Modifica los permisos adicionales del usuario.        |
| getProfile  | Obtiene la información de perfil extendido del usuario.  |
