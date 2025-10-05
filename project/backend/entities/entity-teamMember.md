# TeamMember

| Campo         | Tipo de Dato          | NULL | Por Defecto | Descripción                                                |
|---------------|-----------------------|------|-------------|------------------------------------------------------------|
| id            | UUID (PK)             | No   | -           | Identificador único del miembro del equipo.                |
| name          | STRING                | No   | -           | Nombre completo del miembro del equipo.                    |
| position      | STRING                | No   | -           | Cargo o posición del miembro en la empresa.                |
| bio           | TEXT                  | Sí   | -           | Biografía o descripción del miembro del equipo.            |
| phone         | STRING                | Sí   | -           | Número de teléfono de contacto.                            |
| mail          | STRING (UNIQUE)       | Sí   | -           | Correo electrónico único del miembro.                      |
| multimediaUrl | STRING                | Sí   | -           | URL de la imagen o avatar del miembro del equipo.          |

---

## Métodos asociados a la entidad TeamMember

| Método      | Parámetros                                              | Descripción                                              | Validaciones / Mensajes de error |
|-------------|---------------------------------------------------------|----------------------------------------------------------|-------------------------------|
| create      | name, position, bio (opcional), phone (opcional), mail (opcional), multimediaUrl (opcional) | Crea un nuevo miembro del equipo. | Validar que mail no exista previamente si se proporciona. Si existe: "El correo ya está registrado." |
| findAll     | -                                                       | Obtiene la lista de todos los miembros del equipo (no incluye los eliminados lógicamente). | - |
| findOne     | id                                                      | Obtiene un miembro del equipo por su identificador único. | Si no existe: "Miembro del equipo no encontrado." |
| update      | id, datos a modificar                                   | Actualiza los datos de un miembro del equipo existente. Este método permite actualizar todos los datos o solo algunos campos (actualización parcial). | Validar unicidad de mail si se modifica. Si existe: "El correo ya está registrado." |
| softDelete  | id                                                      | Realiza un borrado lógico (soft delete) del miembro del equipo, marcándolo como inactivo o eliminado sin quitarlo físicamente de la base de datos. | Si no existe: "Miembro del equipo no encontrado." |