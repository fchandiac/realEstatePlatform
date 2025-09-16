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


## Lista de permisos (Permission ENUM)

La siguiente lista define los permisos granulares que pueden asignarse a un usuario, permitiendo controlar el acceso a operaciones específicas sobre las entidades del sistema. Cada permiso tiene un nombre en inglés (clave), su traducción al español y una breve descripción.

| Permission (clave)         | Traducción (español)         | Descripción                                                                 |
|---------------------------|------------------------------|-----------------------------------------------------------------------------|
| MANAGE_USERS              | Gestionar usuarios           | Permite crear, editar, eliminar y ver usuarios en la plataforma.            |
| MANAGE_AGENTS             | Gestionar agentes            | Permite crear, editar, eliminar y ver agentes inmobiliarios.                |
| MANAGE_ADMINS             | Gestionar administradores    | Permite crear, editar, eliminar y ver administradores.                      |
| MANAGE_PROPERTIES         | Gestionar propiedades        | Permite crear, editar, eliminar y ver propiedades.                          |
| ASSIGN_PROPERTY_AGENT     | Asignar propiedad a agente   | Permite asignar propiedades a agentes específicos.                          |
| MANAGE_CONTRACTS          | Gestionar contratos          | Permite crear, editar, eliminar y ver contratos.                            |
| MANAGE_NOTIFICATIONS      | Gestionar notificaciones     | Permite crear, enviar y ver notificaciones del sistema.                     |
| MANAGE_MULTIMEDIA         | Gestionar multimedia         | Permite subir, editar y eliminar archivos multimedia.                       |
| MANAGE_DOCUMENT_TYPES     | Gestionar tipos de documento | Permite crear, editar y eliminar tipos de documento.                        |
| MANAGE_PROPERTY_TYPES     | Gestionar tipos de propiedad | Permite crear, editar y eliminar tipos de propiedad.                        |
| MANAGE_ARTICLES           | Gestionar artículos          | Permite crear, editar y eliminar artículos del blog.                        |
| MANAGE_TESTIMONIALS       | Gestionar testimonios        | Permite crear, editar y eliminar testimonios de usuarios/clientes.          |
| VIEW_REPORTS              | Ver reportes                 | Permite acceder a reportes y estadísticas del sistema.                      |
| SUPER_ADMIN               | Permiso total (superadmin)   | Permiso total sobre todas las operaciones y entidades del sistema.          |

> Nota: Los permisos pueden combinarse según el rol y las necesidades de cada usuario. El campo `permissions` en la entidad User almacena un array de estos valores.

---

## Métodos asociados a la entidad User

| Método      | Parámetros                                              | Descripción                                              | Validaciones / Mensajes de error |
|-------------|---------------------------------------------------------|----------------------------------------------------------|-------------------------------|
| create      | username, mail, pass, role (opcional), personalInfo (opcional) | Crea un nuevo usuario. Automáticamente se creará una persona vacía asociada llamando al método create de Person. | Validar que username y mail no existan previamente. Si existen: "El nombre de usuario o correo ya está registrado." |
| findAll     | -                                                       | Obtiene la lista de todos los usuarios (no incluye los eliminados lógicamente). | - |
| findOne     | id                                                      | Obtiene un usuario por su identificador único.           | Si no existe: "Usuario no encontrado." |
| update      | id, datos a modificar                                   | Actualiza los datos de un usuario existente. Este método permite actualizar todos los datos o solo algunos campos (actualización parcial). | Validar unicidad de username/mail si se modifican. Si existen: "El nombre de usuario o correo ya está registrado." |
| softDelete  | id                                                      | Realiza un borrado lógico (soft delete) del usuario, marcándolo como inactivo o eliminado sin quitarlo físicamente de la base de datos. | Si no existe: "Usuario no encontrado." |
| login       | mail, pass                                              | Autentica a un usuario y genera un token de acceso.      | Si mail o pass incorrectos: "Credenciales inválidas." |
| changePass  | id, passActual, passNueva                               | Permite al usuario cambiar su contraseña.                | Validar passActual. Si incorrecta: "Contraseña actual incorrecta." |
| setStatus   | id, status                                              | Cambia el estado del usuario (activo, inactivo, etc).    | Validar que el status sea válido. |
| assignRole  | id, role                                                | Asigna o cambia el rol de un usuario.                    | Validar que el rol sea válido. |
| setPermissions | id, permissions                                      | Modifica los permisos adicionales del usuario.           | Validar formato de permissions. |
| getProfile  | id                                                      | Obtiene la información de perfil extendido del usuario.  | Si no existe: "Usuario no encontrado." |
