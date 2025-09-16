# Entity PropertyType

La entidad PropertyType permite definir los diferentes tipos de propiedades que pueden ser gestionadas en la plataforma (por ejemplo: departamento, casa, oficina, parcela, etc.). Será utilizada por la entidad Property para asociar cada inmueble a un tipo específico y determinar qué atributos son relevantes para cada tipo.

## Estructura de datos de la entidad

| Campo             | Tipo de Dato | NULL | Descripción                                                                 |
|-------------------|--------------|------|-----------------------------------------------------------------------------|
| id                | UUID (PK)    | No   | Identificador único del tipo de propiedad.                                  |
| name              | VARCHAR      | No   | Nombre del tipo de propiedad (ej: "Casa", "Departamento").                |
| description       | TEXT         | Sí   | Descripción detallada del tipo de propiedad.                                |
| hasBedrooms       | BOOLEAN      | No   | Indica si el tipo de propiedad tiene habitaciones.                          |
| hasBathrooms      | BOOLEAN      | No   | Indica si el tipo de propiedad tiene baños.                                 |
| hasBuiltSquareMeters | BOOLEAN   | No   | Indica si el tipo de propiedad tiene metros cuadrados construidos.          |
| hasLandSquareMeters  | BOOLEAN   | No   | Indica si el tipo de propiedad tiene metros cuadrados de terreno.           |
| hasParkingSpaces  | BOOLEAN      | No   | Indica si el tipo de propiedad tiene estacionamientos.                      |
| createdAt         | DATE         | No   | Fecha de creación del registro.                                             |
| updatedAt         | DATE         | Sí   | Fecha de última actualización del registro.                                 |
| deletedAt         | DATE         | Sí   | Fecha de borrado lógico (soft delete) del registro.                         |

## Reglas y validaciones

- El campo `name` es obligatorio y debe ser único.
- Los campos booleanos determinan si la propiedad de ese tipo puede tener el atributo correspondiente.
- `createdAt` se asigna automáticamente al crear el registro.
- `updatedAt` se actualiza automáticamente al modificar el registro.
- `deletedAt` se asigna al realizar un borrado lógico.

## Ejemplo de objeto PropertyType

```
{
  "id": "e1f2a3b4-c5d6-7890-1234-56789abcdef0",
  "name": "Casa",
  "description": "Propiedad residencial unifamiliar con terreno propio.",
  "hasBedrooms": true,
  "hasBathrooms": true,
  "hasBuiltSquareMeters": true,
  "hasLandSquareMeters": true,
  "hasParkingSpaces": true,
  "createdAt": "2025-09-16T10:00:00Z",
  "updatedAt": null,
  "deletedAt": null
}
```

## Métodos asociados a la entidad PropertyType

| Método      | Parámetros                | Descripción                                 | Validaciones / Mensajes de error |
|-------------|--------------------------|---------------------------------------------|-------------------------------|
| create      | name, description, hasBedrooms, hasBathrooms, hasBuiltSquareMeters, hasLandSquareMeters, hasParkingSpaces | Crea un nuevo tipo de propiedad. | Validar que name no exista previamente. |
| findAll     | -                        | Obtiene la lista de todos los tipos de propiedad. | - |
| findOne     | id                       | Obtiene un tipo de propiedad por su identificador. | Si no existe: "Tipo de propiedad no encontrado." |
| update      | id, datos a modificar    | Actualiza los datos de un tipo de propiedad. | Validar existencia de tipo de propiedad. |
| softDelete  | id                       | Realiza un borrado lógico del tipo de propiedad. | Si no existe: "Tipo de propiedad no encontrado." |
