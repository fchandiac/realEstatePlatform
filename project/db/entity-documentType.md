# DocumentType

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
