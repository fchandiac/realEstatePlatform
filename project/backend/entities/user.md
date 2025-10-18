# 🧑‍💼 User Entity

Entidad que representa los usuarios del sistema, incluyendo agentes, administradores y miembros de la comunidad. Permite gestionar credenciales, permisos, información personal y relaciones con otras entidades como propiedades, contratos, documentos, notificaciones, artículos y testimonios.

---

## 📘 Tabla: `users`

| **Campo** | **Tipo** | **Nulable** | **Descripción** |
|-----------|----------|-------------|----------------|
| `id` | `uuid` (PK) | ❌ | Identificador único del usuario |
| `username` | `string` | ❌ | Nombre de usuario único (requerido) |
| `email` | `string` | ❌ | Correo electrónico único del usuario |
| `password` | `string` | ❌ | Contraseña del usuario (hashed) (requerida) |
| `role` | `enum('ADMIN', 'AGENT', 'COMMUNITY')` | ❌ (default `COMMUNITY`) | Rol principal del usuario |
| `status` | `enum('ACTIVE', 'INACTIVE', 'VACATION', 'LEAVE')` | ✅ (default `ACTIVE`) | Estado actual del usuario |
| `permissions` | `json` | ✅ | Lista de permisos asignados al usuario |
| `personalInfo` | `json` | ✅ | Información personal del usuario 
| `lastLogin` | `date` | ✅ | Fecha del último inicio de sesión |
| `createdAt` | `timestamp` | — | Fecha de creación del usuario |
| `updatedAt` | `timestamp` | — | Fecha de la última modificación |
| `deletedAt` | `timestamp` | ✅ | Fecha de eliminación lógica (soft delete) |

---

## 🧾 Interfaz: `PersonalInfo`

La siguiente interfaz TypeScript representa la forma esperada del campo `personalInfo` almacenado como JSON en la tabla `users`. Se utiliza como referencia de tipo en la capa de código (DTOs / entidades).

```ts
export interface PersonalInfo {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  avatarUrl?: string;
}
```

## 🔗 Relaciones

| **Relación** | **Tipo** | **Entidad destino** | **Descripción** |
|--------------|----------|-------------------|----------------|
| `createdProperties` | `OneToMany` | `Property` | Propiedades creadas por el usuario |
| `assignedProperties` | `OneToMany` | `Property` | Propiedades asignadas al usuario (agente) |
| `buyerContracts` | `OneToMany` | `Contract` | Contratos donde el usuario es comprador |
| `sellerContracts` | `OneToMany` | `Contract` | Contratos donde el usuario es vendedor |
| `agentContracts` | `OneToMany` | `Contract` | Contratos donde el usuario es agente |
| `uploadedDocuments` | `OneToMany` | `Document` | Documentos subidos por el usuario |
| `notifications` | `OneToMany` | `Notification` | Notificaciones asociadas al usuario |
| `articles` | `OneToMany` | `Article` | Artículos creados por el usuario |
| `testimonials` | `OneToMany` | `Testimonial` | Testimonios asociados al usuario |


---

## 🧱 Enums

### `UserRole`
```ts
ADMIN       // Administrador del sistema
AGENT       // Agente inmobiliario
COMMUNITY   // Usuario de la comunidad
```

### `UserStatus`
```ts
ACTIVE      // Activo
INACTIVE    // Inactivo
VACATION    // De vacaciones
LEAVE       // Licencia / permiso
```

### `Permission`
```ts
MANAGE_USERS               // Gestionar usuarios
MANAGE_AGENTS              // Gestionar agentes
MANAGE_ADMINS              // Gestionar administradores
MANAGE_PROPERTIES          // Gestionar propiedades
ASSIGN_PROPERTY_AGENT      // Asignar propiedad a agente
MANAGE_CONTRACTS           // Gestionar contratos
MANAGE_NOTIFICATIONS       // Gestionar notificaciones
MANAGE_MULTIMEDIA          // Gestionar multimedia
MANAGE_DOCUMENT_TYPES      // Gestionar tipos de documento
MANAGE_PROPERTY_TYPES      // Gestionar tipos de propiedad
MANAGE_ARTICLES            // Gestionar artículos
MANAGE_TESTIMONIALS        // Gestionar testimonios
VIEW_REPORTS               // Ver reportes
SUPER_ADMIN                // Puede eliminar otros superAdmin y añadir permisos de superAdmin
```

---

## 🕓 Auditoría y soft delete

- **`createdAt`** → Fecha de creación automática.  
- **`updatedAt`** → Última actualización del usuario.  
- **`deletedAt`** → Fecha de eliminación lógica (soft delete).

---

## 🧩 Ejemplo de uso

```ts
const user = new User();
user.username = 'johndoe';
user.email = 'johndoe@example.com';
user.password = 'hashedpassword';
user.role = UserRole.AGENT;
user.status = UserStatus.ACTIVE;
user.permissions = [Permission.MANAGE_CONTRACTS, Permission.VIEW_REPORTS];
user.personalInfo = {
  firstName: 'John',
  lastName: 'Doe',
  phone: '+56912345678',
  address: 'Calle Falsa 123',
  city: 'Santiago',
  state: 'Chile',
  avatarUrl: 'https://example.com/avatar.jpg'
};
 
```

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
