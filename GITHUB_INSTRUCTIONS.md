# Real Estate Platform — GitHub Instructions

Bienvenido/a. Esta guía explica cómo clonar, configurar y ejecutar el proyecto (backend + frontend), incluyendo seed de datos, variables de entorno y endpoints clave como GridSaleProperties para DataGrid.

## Requisitos
- Node.js 18+
- npm 9+
- MySQL 8+ (o compatible con mysql2)

## Clonar el repositorio

```bash
git clone <REPO_URL> realEstatePlatform
cd realEstatePlatform
```

## Variables de entorno

### Backend (`backend/.env`)
Crea un archivo `.env` con las credenciales de tu base de datos MySQL:

```
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=real_estate
JWT_PRIVATE_KEY_PATH=keys/private.pem
JWT_PUBLIC_KEY_PATH=keys/public.pem
```

Notas:
- El backend usa TypeORM con configuración en `backend/data-source.js`.
- Las entidades se cargan desde `dist/**/*.entity.js` (compiladas), por lo que debes ejecutar `npm run build` antes de correr migraciones/seed si lo requieres.

### Frontend (`frontend/.env.local`)
Configura la URL del backend para consumo desde Next.js:

```
NEXT_PUBLIC_AUTH_API_URL=http://localhost:3000
```

> Si uses otra variable, el código también revisa `AUTH_API_URL`.

## Instalar dependencias

Backend:
```bash
cd backend
npm install
```

Frontend:
```bash
cd ../frontend
npm install
```

## Ejecutar el backend

En una terminal:
```bash
cd backend
npm run build
npm run start:dev
```
El backend NestJS levantará la API en `http://localhost:3000` por defecto.

## Ejecutar el frontend

En otra terminal:
```bash
cd frontend
npm run dev
```
Next.js quedará en `http://localhost:3000` (o el que indique). Si choca el puerto, usa `PORT=3001` al lanzar.

## Seed de datos (opcional pero recomendado)

Para limpiar y sembrar datos de ejemplo:
```bash
cd backend
npm run db:seed:fresh
```
Esto resetea y carga datos en múltiples tablas (propiedades, usuarios, etc.).

## Endpoint clave: GridSaleProperties

- Ruta: `GET /properties/grid-sale`
- Propósito: Listar propiedades en venta para DataGrid (paginación, filtros, búsqueda, orden y campos derivados)
- Campos derivados:
  - `characteristics`: Ej. `3D/2B/250m²T/180m²C/2E/2P` (omite partes sin valor)
  - `typeName`: nombre del tipo de propiedad
  - `assignedAgentName`: nombre del agente (derivado de personalInfo o username)
  - `priceDisplay`: "UF" o "$" con formato local

Parámetros soportados (query):
- `fields`: coma separada (ej: `id,title,typeName,characteristics,assignedAgentName,city,priceDisplay,status`)
- `sort`: `asc|desc`
- `sortField`: campo permitido (ej: `price`)
- `search`: búsqueda global
- `filtration`: `true|false` para activar filtros por columna
- `filters`: `col-valor,col2-valor` (LIKE normalizados)
- `pagination`: `true|false`
- `page`, `limit` (limit máx 100)

Ejemplo:
```
/properties/grid-sale?fields=id,title,typeName,characteristics,assignedAgentName,city,priceDisplay,status&pagination=true&page=1&limit=20&sort=asc&sortField=price&search=Las%20Condes
```

## Server Action de frontend

Archivo: `frontend/app/actions/properties.ts`
- `getSalePropertiesGrid(params)` consume el endpoint con todos los parámetros compatibles con DataGrid.
- Requiere sesión (NextAuth) para enviar `Authorization` con `accessToken`.

Uso (ejemplo):
```ts
import { getSalePropertiesGrid } from '@/app/actions';

const result = await getSalePropertiesGrid({
  fields: 'id,title,typeName,characteristics,assignedAgentName,city,priceDisplay,status',
  pagination: true,
  page: 1,
  limit: 20,
  sort: 'asc',
  sortField: 'price',
  search: 'Las Condes',
});
```

## Pruebas

- Backend: `npm run test` (recomendado `npm run test:property` para casos de propiedades). Algunos scripts ejecutan seed antes de test.

## Problemas comunes
- `ENOENT package.json` al iniciar: Asegúrate de estar en el directorio correcto (`backend` o `frontend`) cuando ejecutes npm.
- Conexión a MySQL: Verifica credenciales y que el servidor está corriendo.
- CORS/URL backend: Ajusta `NEXT_PUBLIC_AUTH_API_URL`.

## Estructura relevante
- Backend: `backend/src/modules/property/` (controller, service, dto)
- Frontend: `frontend/app/actions/` (actions de servidor) y `frontend/components/DataGrid/`

---

¿Dudas o mejoras? Abre un issue o PR con propuestas. ¡Gracias! ✨
