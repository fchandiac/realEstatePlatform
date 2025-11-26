# Rent Properties Grid - Quick Reference

## 🎯 What Was Implemented

A complete rental properties management grid at `/backOffice/properties/rent` that mirrors the existing `/sales` grid functionality.

## 📍 Key Locations

### Backend
- **DTO**: `backend/src/modules/property/dto/grid-rent.dto.ts`
- **Controller**: `backend/src/modules/property/property.controller.ts` (endpoints: `@Get('grid-rent')`, `@Get('grid-rent/excel')`)
- **Service**: `backend/src/modules/property/property.service.ts` (methods: `gridRentProperties`, `exportRentPropertiesExcel`)

### Frontend
- **Server Action**: `frontend/app/actions/properties.ts` (function: `getRentPropertiesGrid`)
- **Page**: `frontend/app/backOffice/properties/rent/page.tsx`
- **Grid Component**: `frontend/app/backOffice/properties/rent/ui/RentGrid.tsx`
- **More Button**: `frontend/app/backOffice/properties/rent/ui/RentMoreButton.tsx`
- **Navigation**: Already configured in `frontend/app/backOffice/layout.tsx` (label: "Arriendo")

## 🔌 API Endpoints

```
GET /properties/grid-rent
GET /properties/grid-rent/excel
```

## 📊 DataGrid Columns

1. **Title** - Property title
2. **Status** - Current status (Published, Inactive, etc.)
3. **Type** - Property type (Apartment, House, etc.)
4. **Agent** - Assigned agent name
5. **City** - Property location city
6. **Price** - Monthly rent with currency formatting
7. **Created** - Property creation date
8. **Actions** - Delete and View More buttons

Hidden columns: Operation Type, Region

## 🎬 How It Works

1. User clicks "Arriendo" in sidebar
2. Server component fetches rent properties via `getRentPropertiesGrid` action
3. Data passed to `RentGrid` client component
4. DataGrid displays with sorting/filtering/pagination
5. User can search, filter, sort, export to Excel
6. Click "more" to view full property details
7. Click delete to remove property

## 🔄 Architecture Pattern

```
User (Browser)
    ↓
Server Component (rent/page.tsx)
    ↓ searchParams
Server Action (getRentPropertiesGrid)
    ↓ JWT token
Backend Endpoint (GET /properties/grid-rent)
    ↓ validate DTO
Service Method (gridRentProperties)
    ↓ QueryBuilder with PropertyOperationType.RENT
Database
    ↓
Response (paginated, filtered, sorted data)
    ↓
Client Component (RentGrid)
    ↓
DataGrid Component
    ↓
User sees grid with all features
```

## ✨ Features Included

- ✅ Pagination (configurable page size, default 25)
- ✅ Sorting (click headers to sort ascending/descending)
- ✅ Filtering (by city, type, agent, status)
- ✅ Global Search (searches title, agent, city, type)
- ✅ Excel Export (downloads as .xlsx file)
- ✅ Create Property (modal form)
- ✅ Delete Property (with confirmation)
- ✅ View Details (opens full property dialog)
- ✅ Currency Formatting (CLP or UF)
- ✅ Responsive Layout (fits various screen sizes)

## 🧪 How to Test

1. **Start Backend**: `cd backend && npm run start:dev`
2. **Start Frontend**: `cd frontend && npm run dev`
3. **Navigate**: Go to `http://localhost:3000/backOffice/properties/rent`
4. **Verify**:
   - Grid displays rental properties (PropertyOperationType.RENT)
   - Sorting works by clicking column headers
   - Filters work by entering values
   - Search finds properties by title/agent
   - Pagination controls work
   - Excel export downloads file
   - Delete button shows confirmation
   - More button opens property details

## 📌 Database Requirement

Must have properties in database with:
- `operationType = 'RENT'`
- `status = 'PUBLISHED'` (for visibility)
- Optional: assigned agent, city, property type

## 🔐 Access Control

- **Requires Authentication**: Yes (JWT token from NextAuth)
- **Allowed Roles**: ADMIN, AGENT (middleware already configured)
- **Community Users**: Automatically redirected to portal

## 📊 Response Example

```json
{
  "data": [
    {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "title": "Hermoso Departamento 3D Ñuñoa",
      "status": "Publicada",
      "operationType": "RENT",
      "typeName": "Departamento",
      "assignedAgentName": "Juan García López",
      "city": "Santiago",
      "state": "Región Metropolitana",
      "price": 1500000,
      "currencyPrice": "CLP",
      "createdAt": "2025-11-20T14:30:00.000Z"
    }
  ],
  "total": 127,
  "page": 1,
  "limit": 25,
  "totalPages": 6
}
```

## 🐛 Debug Logs

Check browser console for:
- `[DEBUG] getRentPropertiesGrid - params.filters received:`
- `[DEBUG] getRentPropertiesGrid - Final URL sent to backend:`
- `[DEBUG] getRentPropertiesGrid - Response status:`

Check server console for:
- `gridRentProperties called with query:`
- `[DEBUG] gridRentProperties - filtration enabled:`
- `Total properties with operationType RENT:`

## 🎨 Styling

- Grid height: 70vh (flexible vertical space)
- Columns responsive with flex/minWidth
- Price formatted as currency (right-aligned)
- Dates formatted as locale-specific strings
- DataGrid component uses Tailwind CSS

## 📦 Dependencies Used

- Next.js 15.3.3 (Server Components & Actions)
- TypeORM (database queries)
- NestJS (backend framework)
- ExcelJS (Excel generation)
- NextAuth.js (authentication)
- Material-UI DataGrid (frontend grid)

## ⚙️ Configuration

No additional configuration needed. Uses existing:
- Environment variables from `.env`
- Database connection from backend config
- Authentication from NextAuth setup
- API URL from `frontend/lib/env.ts`

## 🚀 Ready for

- [x] Development
- [x] Testing
- [x] Production Deployment
- [x] Performance Optimization (if needed)

## 📞 Support

All patterns follow the existing `/sales` grid implementation, so refer to:
- `frontend/app/backOffice/properties/sales/` for component patterns
- `backend/src/modules/property/property.service.ts` for query patterns
- `backend/src/modules/property/property.controller.ts` for endpoint patterns
