# Entity Article

La entidad Article permite almacenar y gestionar artículos para su publicación en el blog de la plataforma. Cada artículo incluye título, bajada (resumen o subtítulo), texto principal, una URL a un archivo multimedia asociado y una categoría.

## Estructura de datos de la entidad

| Campo         | Tipo de Dato | NULL | Descripción                                      |
|---------------|--------------|------|--------------------------------------------------|
| id            | UUID (PK)    | No   | Identificador único del artículo.                |
| title         | VARCHAR      | No   | Título del artículo.                             |
| subtitle      | VARCHAR      | Sí   | Bajada o resumen del artículo.                   |
| text          | TEXT         | No   | Texto principal del artículo.                    |
| multimediaUrl | VARCHAR      | Sí   | URL a un archivo multimedia asociado (opcional). |
| category      | VARCHAR      | No   | Categoría o temática del artículo.               |

## Reglas y validaciones

- El campo `title` es obligatorio y debe ser único.
- El campo `text` es obligatorio y debe contener el cuerpo principal del artículo.
- El campo `category` es obligatorio y debe corresponder a una categoría válida definida por la plataforma.
- El campo `subtitle` es opcional y sirve como bajada o resumen.
- El campo `multimediaUrl` es opcional, pero si se provee debe ser una URL válida (imagen, video, etc.).
- El campo `id` debe ser un UUID único generado automáticamente.

## Ejemplo de objeto Article

```
{
  "id": "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
  "title": "Tendencias del mercado inmobiliario 2025",
  "subtitle": "Lo que debes saber para invertir este año",
  "text": "El mercado inmobiliario en 2025 presenta nuevas oportunidades...",
  "multimediaUrl": "https://cdn.plataforma.com/articulos/mercado-2025.jpg",
  "category": "Tendencias"
}
```

## Métodos asociados a la entidad Article

| Método      | Parámetros                | Descripción                                 | Validaciones / Mensajes de error |
|-------------|--------------------------|---------------------------------------------|-------------------------------|
| create      | title, subtitle, text, multimediaUrl, category | Crea un nuevo artículo.                   | Validar que title no exista previamente. |
| findAll     | -                        | Obtiene la lista de todos los artículos.    | - |
| findOne     | id                       | Obtiene un artículo por su identificador.   | Si no existe: "Artículo no encontrado." |
| update      | id, datos a modificar    | Actualiza los datos de un artículo.         | Validar existencia de artículo. |
| softDelete  | id                       | Realiza un borrado lógico del artículo.     | Si no existe: "Artículo no encontrado." |
