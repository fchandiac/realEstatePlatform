# Entity AboutUs

La entidad AboutUs permite almacenar información corporativa de la empresa, incluyendo biografía, misión, visión y elementos multimedia asociados.

## Estructura de datos de la entidad

| Campo         | Tipo de Dato | NULL | Descripción                                      |
|---------------|--------------|------|--------------------------------------------------|
| id            | UUID (PK)    | No   | Identificador único de la información corporativa.|
| bio           | TEXT         | No   | Biografía o descripción de la empresa.           |
| mision        | TEXT         | No   | Misión de la empresa.                            |
| vision        | TEXT         | No   | Visión de la empresa.                            |
| multimediaUrl | VARCHAR      | Sí   | URL a un archivo multimedia asociado (logo, imagen corporativa). |

## Reglas y validaciones

- El campo `bio` es obligatorio y debe contener la descripción completa de la empresa.
- El campo `mision` es obligatorio y debe contener la declaración de misión de la empresa.
- El campo `vision` es obligatorio y debe contener la declaración de visión de la empresa.
- El campo `multimediaUrl` es opcional, pero si se provee debe ser una URL válida (imagen, logo, etc.).
- El campo `id` debe ser un UUID único generado automáticamente.
- Esta entidad probablemente tendrá solo un registro activo, representando la información corporativa actual.

## Ejemplo de objeto About

```
{
	"id": "b1a2c3d4-e5f6-7890-1234-56789abcdef0",
	"bio": "Somos una empresa inmobiliaria líder con más de 10 años de experiencia en el mercado...",
	"mision": "Brindar soluciones inmobiliarias integrales que satisfagan las necesidades de nuestros clientes.",
	"vision": "Ser la plataforma inmobiliaria de referencia en el país, reconocida por nuestra innovación y servicio excepcional.",
	"multimediaUrl": "https://cdn.plataforma.com/about/logo-empresa.jpg"
}
```

## Métodos asociados a la entidad About

| Método      | Parámetros                | Descripción                                 | Validaciones / Mensajes de error |
|-------------|--------------------------|---------------------------------------------|-------------------------------|
| create      | bio, mision, vision, multimediaUrl | Crea una nueva entrada de información corporativa. | - |
| findAll     | -                        | Obtiene la lista de todas las entradas corporativas. | - |
| findOne     | id                       | Obtiene una entrada corporativa por su identificador. | Si no existe: "Información corporativa no encontrada." |
| update      | id, datos a modificar    | Actualiza los datos de la información corporativa. | Validar existencia de la entrada. |
| softDelete  | id                       | Realiza un borrado lógico de la información corporativa. | Si no existe: "Información corporativa no encontrada." |