# 🏠 Property Entity

Entidad que representa una propiedad dentro del sistema inmobiliario.  
Contiene toda la información de descripción, ubicación, características físicas, estado, relación con usuarios, multimedia y metadatos de publicación.

---

## 📘 Tabla: `properties`

| Campo | Tipo | Nulable | Descripción |
|--------|------|----------|--------------|
| `id` | `uuid (PK)` | ❌ | Identificador único de la propiedad |
| `title` | `varchar(255)` | ❌ | Título principal de la propiedad |
| `description` | `text` | ❌ | Descripción detallada de la propiedad |
| `status` | `enum(PropertyStatus)` | ❌ (por defecto `REQUEST`) | Estado de la propiedad |
| `operationType` | `enum(PropertyOperationType)` | ❌ | Tipo de operación (venta, arriendo, permuta, etc.) |
| `creatorUserId` | `uuid (FK)` | ✅ | Usuario que creó el registro |
| `assignedAgentId` | `uuid (FK)` | ✅ | Agente o corredor asignado |
| `price` | `float` | ❌ | Precio de venta o arriendo |
| `currencyPrice` | `enum('CLP', 'UF')` | ❌ | Unidad monetaria del precio |
| `seoTitle` | `varchar(255)` | ✅ | Título SEO para motores de búsqueda |
| `seoDescription` | `varchar(500)` | ✅ | Descripción SEO |
| `seoKeywords` | `text` | ✅ | Palabras clave SEO |
| `publicationDate` | `datetime` | ✅ | Fecha de publicación |
| `isFeatured` | `boolean` | ✅ (default: false) | Indica si es una propiedad destacada |
| `propertyTypeId` | `uuid (FK)` | ✅ | Tipo de propiedad (relación con `PropertyType`) |
| `builtSquareMeters` | `decimal(8,2)` | ✅ | Metros cuadrados construidos |
| `landSquareMeters` | `decimal(8,2)` | ✅ | Metros cuadrados de terreno |
| `bedrooms` | `int` | ✅ | Cantidad de dormitorios |
| `bathrooms` | `int` | ✅ | Cantidad de baños |
| `parkingSpaces` | `int` | ✅ | Número de estacionamientos |
| `floors` | `int` | ✅ | Número de pisos |
| `constructionYear` | `int` | ✅ | Año de construcción |
| `region` | `enum(RegionEnum)` | ✅ | Región donde se ubica la propiedad |
| `commune` | `enum(ComunaEnum)` | ✅ | Comuna donde se ubica la propiedad |
| `latitude` | `decimal(10,8)` | ✅ | Coordenada geográfica (latitud) |
| `longitude` | `decimal(11,8)` | ✅ | Coordenada geográfica (longitud) |
| `postRequest` | `json` | ✅ | Solicitud de publicación asociada |
| `changeHistory` | `json` | ✅ | Historial de cambios realizados |
| `views` | `json` | ✅ | Registro de vistas e interacciones |
| `leads` | `json` | ✅ | Información de contactos o interesados |
| `viewCount` | `int` | ✅ (default: 0) | Total de visualizaciones |
| `favoriteCount` | `int` | ✅ (default: 0) | Total de favoritos |
| `contactCount` | `int` | ✅ (default: 0) | Total de contactos recibidos |
| `internalNotes` | `text` | ✅ | Notas internas de administración |
| `rejectionReason` | `text` | ✅ | Motivo de rechazo o baja |
| `createdAt` | `timestamp` | ❌ | Fecha de creación |
| `updatedAt` | `timestamp` | ❌ | Última modificación |
| `deletedAt` | `timestamp` | ✅ | Fecha de eliminación lógica |
| `publishedAt` | `datetime` | ✅ | Fecha de publicación efectiva |
| `lastModifiedAt` | `datetime` | ✅ | Fecha de última modificación relevante |

---

## 🔗 Relaciones

| Relación | Tipo | Entidad Destino | Descripción |
|-----------|------|----------------|--------------|
| `creatorUser` | ManyToOne | `User` | Usuario que creó la propiedad |
| `assignedAgent` | ManyToOne | `User` | Agente o corredor asignado |
| `propertyType` | ManyToOne | `PropertyType` | Tipo o categoría de la propiedad |
| `multimedia` | OneToMany | `Multimedia` | Archivos multimedia asociados |

---

## 🧱 Enums

### `CurrencyPriceEnum`
- `CLP` → Peso chileno  
- `UF` → Unidad de Fomento

### `PropertyStatus`
- `REQUEST` → Solicitud recibida  
- `PRE-APPROVED` → Preaprobada  
- `PUBLISHED` → Publicada  
- `INACTIVE` → Inactiva  
- `SOLD` → Vendida  
- `RENTED` → Arrendada  

### `PropertyOperationType`
- `SALE` → Venta  
- `RENTAL` → Arriendo  

---

## 📦 Interfaces Asociadas

### `PostRequest` (PostRequestStatus)
```ts
{
  requestedAt: Date;
  requestedBy: string;
  platform?: string;
  specifications?: string;
  budget?: number;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected'; // use PostRequestStatus enum
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
}
```

### `ChangeHistoryEntry`
```ts
{
  timestamp: Date;
  changedBy: string;
  field: string;
  previousValue: any;
  newValue: any;
  reason?: string;
  ip?: string;
  userAgent?: string;
}
```

### `ViewEntry`
```ts
{
  timestamp: Date;
  userId?: string;
  sessionId: string;
  ip?: string;
  userAgent?: string;
  platform?: string;
  source?: string;
  timeSpent?: number;
}
```

### `LeadEntry`
```ts
{
  timestamp: Date;
  contactInfo: {
    name?: string;
    email?: string;
    phone?: string;
  };
  source?: string;
  message?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed';
  assignedTo?: string;
  followUpDate?: Date;
  notes?: string;
}
```

---

## 🕓 Auditoría

- **createdAt** → Creación del registro.  
- **updatedAt** → Última actualización.  
- **deletedAt** → Soft delete.  
- **publishedAt** → Fecha de publicación.  
- **lastModifiedAt** → Última modificación relevante.

---

## 🧩 Ejemplo de uso

```ts
const property = new Property();
property.title = 'Departamento en Las Condes';
property.description = 'Amplio y luminoso, cerca del metro.';
property.status = PropertyStatus.PUBLISHED;
property.operationType = PropertyOperationType.SALE;
property.price = 9500;
property.currencyPrice = CurrencyPriceEnum.UF;
property.region = RegionEnum.METROPOLITANA;
property.commune = ComunaEnum.LAS_CONDES;
property.propertyTypeId = 'uuid-property-type';
property.creatorUserId = 'uuid-user';
property.isFeatured = true;
```
