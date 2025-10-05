# Entity Identity

La entidad Identity permite almacenar información de identidad corporativa de la empresa, incluyendo datos de contacto, horarios de atención, redes sociales y alianzas estratégicas.

## Estructura de datos de la entidad

| Campo         | Tipo de Dato | NULL | Descripción                                      |
|---------------|--------------|------|--------------------------------------------------|
| id            | UUID (PK)    | No   | Identificador único de la identidad corporativa. |
| name          | VARCHAR      | No   | Nombre de la empresa.                            |
| address       | TEXT         | No   | Dirección completa de la empresa.                |
| phone         | VARCHAR      | No   | Número de teléfono principal de contacto.        |
| mail          | VARCHAR      | No   | Correo electrónico principal de la empresa.      |
| businessHours | TEXT         | No   | Horario de atención en formato de texto.         |
| socialMedia   | JSON         | Sí   | Información de redes sociales (ver estructura abajo). |
| partnerships  | JSON         | Sí   | Lista de alianzas estratégicas (ver estructura abajo). |

## Estructura del campo socialMedia (JSON)

El campo `socialMedia` contiene información sobre las redes sociales de la empresa:

```json
{
  "instagram": {
    "url": "https://instagram.com/empresa",
    "available": true
  },
  "facebook": {
    "url": "https://facebook.com/empresa",
    "available": true
  },
  "linkedin": {
    "url": "https://linkedin.com/company/empresa",
    "available": true
  },
  "youtube": {
    "url": "https://youtube.com/channel/empresa",
    "available": false
  }
}
```

## Estructura del campo partnerships (JSON)

El campo `partnerships` contiene un array de alianzas estratégicas:

```json
[
  {
    "name": "Alianza Estratégica 1",
    "description": "Descripción detallada de la alianza estratégica",
    "multimediaUrl": "https://cdn.empresa.com/partners/alianza1.jpg"
  },
  {
    "name": "Alianza Estratégica 2",
    "description": "Otra descripción de alianza",
    "multimediaUrl": "https://cdn.empresa.com/partners/alianza2.jpg"
  }
]
```

## Reglas y validaciones

- Los campos `name`, `address`, `phone`, `mail`, y `businessHours` son obligatorios.
- El campo `mail` debe ser una dirección de correo electrónico válida.
- El campo `phone` debe contener un número de teléfono válido.
- Los campos `socialMedia` y `partnerships` son opcionales pero deben seguir la estructura JSON definida si se proporcionan.
- Esta entidad probablemente tendrá solo un registro activo, representando la identidad corporativa actual.

## Ejemplo de objeto Identity

```json
{
  "id": "c1d2e3f4-g5h6-7890-1234-56789abcdef0",
  "name": "Plataforma Inmobiliaria S.A.",
  "address": "Av. Principal 123, Ciudad, País",
  "phone": "+1234567890",
  "mail": "contacto@plataformainmobiliaria.com",
  "businessHours": "Lunes a Viernes: 9:00 AM - 6:00 PM, Sábados: 9:00 AM - 1:00 PM",
  "socialMedia": {
    "instagram": {
      "url": "https://instagram.com/plataformainmobiliaria",
      "available": true
    },
    "facebook": {
      "url": "https://facebook.com/plataformainmobiliaria",
      "available": true
    },
    "linkedin": {
      "url": "https://linkedin.com/company/plataformainmobiliaria",
      "available": true
    },
    "youtube": {
      "url": "https://youtube.com/channel/plataformainmobiliaria",
      "available": false
    }
  },
  "partnerships": [
    {
      "name": "Banco Nacional",
      "description": "Alianza estratégica para financiamiento hipotecario",
      "multimediaUrl": "https://cdn.plataforma.com/partners/banco-nacional.jpg"
    }
  ]
}
```

## Métodos asociados a la entidad Identity

| Método      | Parámetros                | Descripción                                 | Validaciones / Mensajes de error |
|-------------|--------------------------|---------------------------------------------|-------------------------------|
| create      | name, address, phone, mail, businessHours, socialMedia, partnerships | Crea una nueva entrada de identidad corporativa. | Validar formato de email y estructura JSON si se proporcionan. |
| findAll     | -                        | Obtiene la lista de todas las identidades corporativas. | - |
| findOne     | id                       | Obtiene una identidad corporativa por su identificador. | Si no existe: "Identidad corporativa no encontrada." |
| update      | id, datos a modificar    | Actualiza los datos de la identidad corporativa. | Validar existencia de la entrada y formatos. |
| softDelete  | id                       | Realiza un borrado lógico de la identidad corporativa. | Si no existe: "Identidad corporativa no encontrada." |