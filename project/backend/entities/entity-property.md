# Entity Property

La entidad Property representa un inmueble publicado o gestionado en la plataforma inmobiliaria. Permite almacenar toda la información relevante para la administración, publicación, búsqueda y seguimiento de propiedades, incluyendo datos de ubicación, características, estado, precios, historial y asignaciones.

## Estructura de datos de la entidad

| Campo             | Tipo de Dato                        | NULL | Descripción                                                                 |
|-------------------|-------------------------------------|------|-----------------------------------------------------------------------------|
| id                | UUID (PK)                           | No   | Identificador de la propiedad.                                              |
| title             | STRING                              | No   | Título de la propiedad.                                                     |
| description       | STRING                              | No   | Descripción detallada.                                                      |
| status            | ENUM(PropertyStatus)                | No   | Estado de la publicación.                                                   |
| creatorUserId     | UUID (FK → USER.id)                 | No   | Usuario que creó la publicación.                                            |
| assignedAgentId   | UUID (FK → USER.id)                 | Sí   | Agente asignado.                                                            |
| priceCLP          | INT                                 | No   | Precio en pesos chilenos. Solo uno de los campos priceCLP o priceUF debe tener valor, nunca ambos a la vez. No puede ser null, valor por defecto: 0. |
| priceUF           | FLOAT                               | No   | Precio en UF. Solo uno de los campos priceCLP o priceUF debe tener valor, nunca ambos a la vez. No puede ser null, valor por defecto: 0.             |
| seoTitle          | STRING                              | Sí   | Título SEO.                                                                 |
| seoDescription    | STRING                              | Sí   | Descripción SEO.                                                            |
| publicationDate   | DATE                                | Sí   | Fecha de publicación aprobada.                                              |
| bathrooms         | INT                                 | Sí   | Número de baños.                                                            |
| builtSquareMeters | FLOAT                               | Sí   | Metros cuadrados construidos.                                               |
| landSquareMeters  | FLOAT                               | Sí   | Metros cuadrados de terreno.                                                |
| bedrooms          | INT                                 | Sí   | Habitaciones.                                                               |
| parkingSpaces     | INT                                 | Sí   | Estacionamientos.                                                           |
| region_commune    | JSON                                | Sí   | Objeto JSON con {region, comunas[]}.                                        |
| latitude          | FLOAT                               | Sí   | Coordenada latitud.                                                         |
| longitude         | FLOAT                               | Sí   | Coordenada longitud.                                                        |
| multimedia        | JSON                                | Sí   | Colección mínima de 3 archivos multimedia. Es una colección (array) de objetos que referencian a la entidad Multimedia. Cada objeto debe cumplir la estructura definida para la entidad multimedia. |
| changeHistory     | JSON                                | Sí   | Historial de cambios.                                                       |
| views             | JSON                                | Sí   | Información sobre visitas.                                                  |
| leads             | JSON                                | Sí   | Información sobre interesados.                                              |
| propertyRole      | STRING                              | Sí   | Rol de la propiedad.                                                        |
| operation         | ENUM(PropertyOperationType)         | Sí   | Tipo de operación.                                                          |
| postRequest       | JSON                                | Sí   | Información del solicitante (origin, phone, email, name, userType, valuationAmount). |

### ENUM PropertyStatus

| Valor ENUM     | Descripción                |
|---------------|----------------------------|
| REQUEST       | Solicitud de publicación   |
| PRE-APPROVED  | Preaprobada                |
| PUBLISHED     | Publicada                  |
| INACTIVE      | Inactiva                   |
| SOLD          | Vendida                    |
| RENTED        | Arrendada                  |


### Estructura del campo multimedia

El campo `multimedia` es una colección (array) de objetos que referencian a la entidad Multimedia. Debe contener al menos 3 elementos. Cada objeto de la colección debe tener la siguiente estructura mínima:

```
[
	{
		id: string,           // Identificador único del archivo multimedia (UUID)
		url: string,          // URL de acceso al archivo
		type: string,         // Tipo de archivo: 'image', 'video', 'document', etc.
		description?: string  // Descripción opcional del archivo
	},
	...
]
```

Pueden agregarse otros campos según la definición de la entidad multimedia (por ejemplo, fecha de carga, tamaño, metadatos, etc.).

### Estructura del campo postRequest

El campo `postRequest` es un objeto que almacena la información del solicitante de la publicación o valoración de la propiedad. Su estructura es la siguiente:

```
{
	origin: string,           // Origen de la solicitud: 'publication' o 'valuation'
	phone: string,            // Teléfono de contacto
	email: string,            // Correo electrónico
	name: string,             // Nombre del solicitante
	userType: string,         // 'anonymous' o 'community' (usuario registrado)
	valuationAmount?: number  // Monto de valoración (solo presente si origin = 'valuation')
}
```

**Reglas y validaciones:**
- `userType` debe ser 'anonymous' (usuario externo/no registrado) o 'community' (usuario registrado en la plataforma).
- `origin` debe ser 'publication' (solicitud de publicación) o 'valuation' (solicitud de valoración).
- El campo `valuationAmount` es obligatorio y válido solo cuando `origin` es 'valuation'. Si `origin` es 'publication', este campo debe omitirse o ser null.

Ejemplo para solicitud de publicación:
```
{
	"origin": "publication",
	"phone": "+56912345678",
	"email": "anonimo@email.com",
	"name": "Usuario Anónimo",
	"userType": "anonymous"
}
```

Ejemplo para solicitud de valoración:
```
{
	"origin": "valuation",
	"phone": "+56987654321",
	"email": "miembro@comunidad.com",
	"name": "Miembro Comunidad",
	"userType": "community",
	"valuationAmount": 120000000
}
```

### Estructura del campo changeHistory

El campo `changeHistory` es una colección (array) de objetos que registran cada modificación relevante en la propiedad. Estructura sugerida:

```
[
	{
		changedByUserId: string,      // ID del usuario que realizó el cambio
		changedByUserName: string,    // Nombre del usuario (opcional)
		changeType: string,           // Tipo de cambio (ej: 'CREATE', 'UPDATE', 'DELETE', 'STATUS_CHANGE', etc.)
		changedFields: string[],      // Lista de campos modificados
		previousValues: object,       // Valores anteriores de los campos modificados
		newValues: object,            // Nuevos valores de los campos modificados
		changeDate: string (ISO 8601) // Fecha y hora del cambio
	},
	...
]
```

Esto permite auditar quién, cuándo y qué modificó en la propiedad, facilitando la trazabilidad y el control de cambios.

### Estructura del campo views

El campo `views` es una colección (array) de objetos con la siguiente estructura:

```
[
	{
		userName: string | null,   // Nombre del usuario si está disponible
		userId: string | null,     // ID del usuario si está disponible
		userType: 'COMUNITY' | 'ANONYMOUS', // Tipo de usuario que visualizó la propiedad
		name: string,              // Nombre ingresado en el formulario de contacto
		email: string,             // Correo electrónico ingresado
		phone: string              // Teléfono ingresado
	},
	...
]
```

Esto permite registrar tanto visitas de usuarios registrados como de visitantes anónimos, junto con los datos de contacto proporcionados.

### ENUM PropertyOperationType

| Valor ENUM | Descripción |
|------------|-------------|
| SALE       | Venta       |
| RENTAL     | Arriendo    |
