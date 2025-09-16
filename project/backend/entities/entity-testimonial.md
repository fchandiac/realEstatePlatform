# Entity Testimonial

La entidad Testimonial permite almacenar testimonios de usuarios, clientes o personas relevantes para la plataforma. Cada testimonio incluye el texto, el nombre de quien lo emite y una URL a un archivo multimedia asociado (por ejemplo, imagen o video).

## Estructura de datos de la entidad

| Campo         | Tipo de Dato | NULL | Descripción                                      |
|---------------|--------------|------|--------------------------------------------------|
| id            | UUID (PK)    | No   | Identificador único del testimonio.              |
| text          | TEXT         | No   | Texto completo del testimonio.                   |
| name          | VARCHAR      | No   | Nombre de la persona que emite el testimonio.    |
| multimediaUrl | VARCHAR      | Sí   | URL a un archivo multimedia asociado (opcional). |

## Reglas y validaciones

- El campo `text` es obligatorio y debe contener el testimonio completo.
- El campo `name` es obligatorio y debe identificar a la persona que emite el testimonio.
- El campo `multimediaUrl` es opcional, pero si se provee debe ser una URL válida (imagen, video, etc.).
- El campo `id` debe ser un UUID único generado automáticamente.

## Ejemplo de objeto Testimonial

```
{
	"id": "b1a2c3d4-e5f6-7890-1234-56789abcdef0",
	"text": "La experiencia con la plataforma fue excelente, vendí mi propiedad en menos de un mes.",
	"name": "María González",
	"multimediaUrl": "https://cdn.plataforma.com/testimonios/maria-gonzalez.jpg"
}
```

## Métodos asociados a la entidad Testimonial

| Método      | Parámetros                | Descripción                                 | Validaciones / Mensajes de error |
|-------------|--------------------------|---------------------------------------------|-------------------------------|
| create      | text, name, multimediaUrl| Crea un nuevo testimonio.                   | Validar que text y name no sean vacíos. |
| findAll     | -                        | Obtiene la lista de todos los testimonios.  | - |
| findOne     | id                       | Obtiene un testimonio por su identificador. | Si no existe: "Testimonio no encontrado." |
| update      | id, datos a modificar    | Actualiza los datos de un testimonio.       | Validar existencia de testimonio. |
| softDelete  | id                       | Realiza un borrado lógico del testimonio.   | Si no existe: "Testimonio no encontrado." |
