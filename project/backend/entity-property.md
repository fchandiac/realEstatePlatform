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
| multimedia        | JSON                                | Sí   | Colección mínima de 3 archivos multimedia.                                  |
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
