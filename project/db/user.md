# User

| Campo         | Tipo de Dato                                 | NULL | Por Defecto | Descripción                                                |
|---------------|----------------------------------------------|------|-------------|------------------------------------------------------------|
| id            | UUID (PK)                                    | No   | -           | Identificador único del usuario.                           |
| username      | STRING                                       | No   | -           | Nombre de usuario único.                                   |
| mail          | STRING (UNIQUE)                              | No   | -           | Correo electrónico único, usado para login.                |
| passHash      | VARCHAR                                      | No   | -           | Hash de la contraseña.                                     |
| passSalt      | VARCHAR                                      | No   | -           | Salt para reforzar seguridad del hash.                     |
| status        | ENUM('ACTIVE', 'INACTIVE', 'VACATION', 'LEAVE') | No   | ACTIVE      | Estado del usuario.                                        |
| role          | ENUM('SUPERADMIN', 'ADMIN', 'AGENT', 'COMMUNITY') | No   | COMMUNITY   | Rol único asignado al usuario.                             |
| permissions   | JSON                                         | Sí   | {}          | Lista de permisos adicionales definida por un administrador.|
| personalInfo  | JSON                                         | Sí   | {}           | Información adicional (ej. preferencias, perfil extendido). |

## Métodos asociados a la entidad User

| Método      | Parámetros                                              | Descripción                                              | Validaciones / Mensajes de error |
|-------------|---------------------------------------------------------|----------------------------------------------------------|-------------------------------|
| create      | username, mail, pass, role (opcional), personalInfo (opcional) | Crea un nuevo usuario. Automáticamente se creará una persona vacía asociada llamando al método create de Person. | Validar que username y mail no existan previamente. Si existen: "El nombre de usuario o correo ya está registrado." |
| findAll     | -                                                       | Obtiene la lista de todos los usuarios.                  | - |
| findOne     | id                                                      | Obtiene un usuario por su identificador único.           | Si no existe: "Usuario no encontrado." |
| update      | id, datos a modificar                                   | Actualiza los datos de un usuario existente. Este método permite actualizar todos los datos o solo algunos campos (actualización parcial). | Validar unicidad de username/mail si se modifican. Si existen: "El nombre de usuario o correo ya está registrado." |
| softDelete  | id                                                      | Realiza un borrado lógico (soft delete) del usuario, marcándolo como inactivo o eliminado sin quitarlo físicamente de la base de datos. | Si no existe: "Usuario no encontrado." |
| login       | mail, pass                                              | Autentica a un usuario y genera un token de acceso.      | Si mail o pass incorrectos: "Credenciales inválidas." |
| changePass  | id, passActual, passNueva                               | Permite al usuario cambiar su contraseña.                | Validar passActual. Si incorrecta: "Contraseña actual incorrecta." |
| setStatus   | id, status                                              | Cambia el estado del usuario (activo, inactivo, etc).    | Validar que el status sea válido. |
| assignRole  | id, role                                                | Asigna o cambia el rol de un usuario.                    | Validar que el rol sea válido. |
| setPermissions | id, permissions                                      | Modifica los permisos adicionales del usuario.           | Validar formato de permissions. |
| getProfile  | id                                                      | Obtiene la información de perfil extendido del usuario.  | Si no existe: "Usuario no encontrado." |
