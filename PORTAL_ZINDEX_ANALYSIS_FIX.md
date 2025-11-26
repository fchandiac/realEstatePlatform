# Portal Z-Index Analysis & Fix Report

## 🔍 Problem Identification

**Issue:** NavBar aparece detrás de las PropertyCards

**Root Cause:** Stacking context y overflow properties creando nuevos contextos

---

## 📊 Current Structure Analysis

### Page Layout Flow
```
page.tsx (Server Component)
├─ Slider (z-0, position: relative/static)
│
├─ NavBar Container (sticky top-16, bg-background, z-50 on nav element)
│  └─ NavBar nav element (z-50)
│     └─ Dropdowns (z-20) ← PROBLEMA: z-20 < z-50 pero contenedor sticky puede no funcionar bien
│
├─ Featured Section (z-0)
│  └─ FeaturedPropertiesList
│     ├─ Grid (grid-cols-3, z-0)
│     └─ PropertyCard (relative, z-0) ← AQUÍ EL PROBLEMA
│         ├─ Operation Badge (absolute, z-10)
│         └─ Chevrons (absolute, z-10)
│
└─ Regular Section (z-0)
   └─ ListProperties
      ├─ Grid (grid-cols-3, z-0)
      └─ PropertyCard (relative, z-0) ← AQUÍ EL PROBLEMA
          ├─ Operation Badge (absolute, z-10)
          └─ Chevrons (absolute, z-10)
```

### Current CSS Classes
```
// page.tsx
<div className="sticky top-16 bg-background shadow-[...]">
  <NavBar />
</div>

// NavBar.tsx
<nav className="w-full bg-background z-50" aria-label="Main navigation">

// ListProperties.tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ...">

// PropertyCard.tsx
<div className="relative bg-white rounded-lg w-full text-left property-card shadow-lg overflow-hidden">
```

---

## ❌ What's Wrong

### Issue 1: Sticky Positioning Context
```
NavBar Container:
  position: sticky
  top: 64px (top-16)
  z-index: INHERITED from parent (div, no z-index specified)
  └─ NavBar: z-50 (but parent has no z-index!)
```

**Problem:** El `<div>` wrapper con `sticky top-16` no tiene `z-index` explícito.
Cuando un elemento tiene `position: sticky/fixed/absolute`, necesita que su ancestro tenga `z-index` para participar correctamente en el stacking context.

### Issue 2: PropertyCard Overflow & Relative Positioning
```
PropertyCard:
  className="relative bg-white rounded-lg overflow-hidden"
  └─ Creates a NEW stacking context due to:
     - position: relative
     - overflow: hidden
```

**Problem:** `overflow: hidden` + `position: relative` = nueva stacking context
Esto hace que cualquier z-index dentro de PropertyCard sea relativo a la tarjeta, no a la página.

### Issue 3: Grid Parent Context
```
ListProperties Grid:
  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
  └─ No z-index, pero como padre de relative elements crea contexto visual
```

---

## ✅ Solution: Coordinated Z-Index Structure

### Fixed Z-Index Hierarchy

```
z-50: Top Layer (Modals, Dialogs, Sticky Headers)
├─── NavBar Container (sticky)
├─── Dialog/Modal
└─── CookieConsent

z-40: Sidebar Layer
├─── Sidebar Panel (fixed)
└─── Wsp Button (fixed)

z-35: Overlay Layer
└─── Sidebar Overlay

z-30: Main Header
└─── PortalTopBar (sticky)

z-20: Dropdown Layer
└─── NavBar Dropdowns

z-10: Content Enhancement Layer (ONLY for badges/overlays WITHIN cards)
├─── PropertyCard Badges (absolute inside relative card)
└─── PropertyCard Chevrons (absolute inside relative card)

z-0: Default Content Layer
├─── Slider
├─── PropertyCard (as whole unit)
├─── ListProperties Grid
└─── All main content
```

---

## 🔧 Implementation Changes

### Change 1: Add Z-Index to NavBar Container
**File:** `frontend/app/portal/page.tsx`

**Current:**
```tsx
<div className="sticky top-16 bg-background shadow-[0_4px_8px_-4px_rgba(0,0,0,0.12)]">
  <NavBar />
</div>
```

**Fixed:**
```tsx
<div className="sticky top-16 bg-background shadow-[0_4px_8px_-4px_rgba(0,0,0,0.12)] z-50">
  <NavBar />
</div>
```

**Why:** El contenedor sticky necesita z-index para que sea parte del stacking context global.

---

### Change 2: Remove Conflicting Z-Index from NavBar
**File:** `frontend/app/portal/ui/NavBar.tsx`

**Current:**
```tsx
<nav className="w-full bg-background z-50" aria-label="Main navigation">
```

**Fixed:**
```tsx
<nav className="w-full bg-background" aria-label="Main navigation">
```

**Why:** El z-index debe estar en el padre sticky, no en el nav. Evita redundancia y contexto conflictivo.

---

### Change 3: Keep Dropdown Z-Index at z-20
**File:** `frontend/app/portal/ui/NavBar.tsx`

**Keep As Is:**
```tsx
<ul className="absolute left-0 top-full mt-1 w-56 bg-white border border-neutral-200 rounded shadow-lg z-20">
```

**Why:** Esto es correcto. z-20 < z-50 permite que los dropdowns aparezcan debajo de modales pero arriba del contenido.

---

### Change 4: Ensure PropertyCard Stacking Context is Clean
**File:** `frontend/app/portal/ui/PropertyCard.tsx`

**Keep As Is:** (ya está correcto)
```tsx
<div className="relative bg-white rounded-lg w-full text-left property-card shadow-lg overflow-hidden">
```

**Why:** 
- `relative` = permite absolute positioning interno
- `overflow: hidden` = clips content, necesario para rounded borders y image display
- Sin z-index = mantiene z-0 por defecto
- Interno z-10 para badges/chevrons es CORRECTO

---

### Change 5: Verify Grid Parent Has Proper Context
**File:** `frontend/app/portal/ui/ListProperties.tsx`

**Add z-index context for better clarity:**
```tsx
<div className="w-full relative z-0">
  <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-200 ${isLoading ? 'opacity-70' : 'opacity-100'}`}>
```

**Why:** Explícitamente establece que el grid está en z-0, separado del NavBar (z-50).

---

## 📋 Complete Corrected Files

### 1. page.tsx (Portal Home)
```tsx
import FeaturedPropertiesList from './ui/FeaturedPropertiesList';
import { getPublishedFeaturedProperties } from '@/app/actions/properties';
import { getPublishedPropertiesFiltered } from '@/app/actions/portalProperties';
import Slider from './ui/Slider';
import NavBar from './ui/NavBar';
import PortalClient from './PortalClient';

interface PortalPageProps {
  searchParams: Promise<{
    operation?: string;
    typeProperty?: string;
    state?: string;
    city?: string;
    currency?: string;
    page?: string;
    featured_page?: string;
  }>;
}

export default async function PortalPage({ searchParams }: PortalPageProps) {
  const params = await searchParams;

  const operation = params.operation || '';
  const typeProperty = params.typeProperty || '';
  const state = params.state || '';
  const city = params.city || '';
  const currency = params.currency || '';
  const page = params.page || '';
  const featuredPage = params.featured_page || '1';

  // Fetch featured properties with pagination
  const featuredResult = await getPublishedFeaturedProperties(
    parseInt(featuredPage) || 1
  );

  const featuredProperties = featuredResult?.data ?? [];
  const featuredPagination = featuredResult?.pagination;

  // Fetch regular properties (filtered)
  const result = await getPublishedPropertiesFiltered({
    currency: currency,
    state: state,
    city: city,
    typeProperty: typeProperty,
    operation: operation,
    page: page ? parseInt(page) : 1,
  });

  const properties = result?.data ?? [];
  const pagination = result?.pagination;

  return (
    <>
      {/* Hero Slider */}
      <Slider />

      {/* NavBar - Sticky with proper z-index */}
      <div className="sticky top-16 bg-background shadow-[0_4px_8px_-4px_rgba(0,0,0,0.12)] z-50">
        <NavBar />
      </div>

      {/* Featured Properties Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 relative z-0">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Propiedades destacadas
          </h1>
          <p className="mt-4 text-gray-600">
            Explora nuestras propiedades más destacadas seleccionadas especialmente para ti.
          </p>
        </div>

        {/* Featured Properties List */}
        <FeaturedPropertiesList
          properties={featuredProperties}
          pagination={featuredPagination}
          isLoading={false}
        />
      </div>

      {/* Regular Portal Properties Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 relative z-0">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Busca tu propiedad ideal
          </h2>
          <p className="mt-4 text-gray-600">
            Filtra y explora todas nuestras propiedades disponibles.
          </p>
        </div>
        <PortalClient initialProperties={properties} initialPagination={pagination} />
      </div>
    </>
  );
}
```

### 2. NavBar.tsx (Remove z-50 from nav)
```tsx
'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';

export default function NavBar() {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const handleNavigation = (path: string) => {
    router.push(path);
    setOpenMenu(null);
  };

  const toggleMenu = (menuName: string) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const handleBlur = (e: React.FocusEvent<HTMLLIElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setOpenMenu(null);
    }
  };

  return (
    <nav className="w-full bg-background" aria-label="Main navigation">
      {/* Rest remains the same */}
      <ul className="flex items-center justify-center gap-3 px-4 py-3">
        {/* ... existing code ... */}
      </ul>
    </nav>
  )
}
```

### 3. ListProperties.tsx (Add z-0 context)
```tsx
export default function ListProperties({ properties, pagination, onPageChange, isLoading = false }: ListPropertiesProps) {
  return (
    <div className="w-full relative z-0">
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-200 ${isLoading ? 'opacity-70' : 'opacity-100'}`}>
        {properties.map((property) => {
          const mappedProperty: PortalProperty = {
            id: property.id,
            title: property.title,
            description: property.description || null,
            operationType: (property.operationType === 'SALE' ? 'SALE' : 'RENT') as any,
            price: property.price,
            currencyPrice: (property.currency as 'CLP' | 'UF') || 'CLP',
            state: property.state,
            city: property.city,
            propertyType: property.propertyType,
            mainImageUrl: property.mainImageUrl || null,
            multimedia: property.multimedia || [],
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            builtSquareMeters: property.totalArea,
            landSquareMeters: null,
            parkingSpaces: null,
            isFeatured: property.isFeatured || false,
          };

          return <PropertyCard key={property.id} property={mappedProperty} />;
        })}
      </div>

      {pagination && <PaginationControls pagination={pagination} onPageChange={onPageChange} />}
    </div>
  );
}
```

---

## 🎯 Visual Result After Fix

```
┌─────────────────────────────────────────────────────┐
│ Slider (z-0)                                        │
│ Background images, text                             │
└─────────────────────────────────────────────────────┘
            ▲ (above)
┌─────────────────────────────────────────────────────┐
│ NavBar (z-50) ← STICKY, ALWAYS ON TOP              │
│ [Home] [Nosotros ▼] [Propiedades ▼]               │
│ └─ Dropdowns (z-20) appear below nav               │
└─────────────────────────────────────────────────────┘
            ▼ (below)
┌─────────────────────────────────────────────────────┐
│ Featured Section (z-0)                              │
│ ┌─────┐ ┌─────┐ ┌─────┐                            │
│ │Card │ │Card │ │Card │  PropertyCard (z-0)       │
│ │ [🏷] │ │ [🏷] │ │ [🏷] │  With badges (z-10 internal) │
│ └─────┘ └─────┘ └─────┘                            │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Regular Section (z-0)                               │
│ ┌─────┐ ┌─────┐ ┌─────┐                            │
│ │Card │ │Card │ │Card │  PropertyCard (z-0)       │
│ │ [🏷] │ │ [🏷] │ │ [🏷] │  With badges (z-10 internal) │
│ └─────┘ └─────┘ └─────┘                            │
└─────────────────────────────────────────────────────┘

NavBar SIEMPRE VISIBLE Y ENCIMA DE CARDS ✅
```

---

## 📝 Summary of Changes

| File | Change | Line | Current | New | Reason |
|------|--------|------|---------|-----|--------|
| page.tsx | Add z-50 to NavBar container | 52 | `sticky top-16 bg-background` | `sticky top-16 bg-background z-50` | Establece z-index global para sticky |
| NavBar.tsx | Remove z-50 from nav | 31 | `<nav className="... z-50">` | `<nav className="...">` | Evita conflicto, z-index en padre |
| ListProperties.tsx | Add z-0 context | 109 | `<div className="w-full">` | `<div className="w-full relative z-0">` | Claridad de contexto |
| page.tsx | Add z-0 context sections | 49, 65 | `<div className="mx-auto...">` | `<div className="mx-auto... relative z-0">` | Separación visual clara |

---

## ✅ Verification Checklist

After applying fixes:
- [ ] NavBar appears above PropertyCards when scrolling
- [ ] Dropdowns appear correctly below NavBar
- [ ] PropertyCards display badges and chevrons properly
- [ ] Sticky positioning works smoothly
- [ ] No console warnings about z-index
- [ ] Responsive (xs/sm/md/lg) works correctly
- [ ] Modal/Dialog still appears above everything (z-50)
- [ ] Sidebar still works correctly (z-40)

---

**Análisis completado:** 26 Noviembre 2025
**Status:** Ready for implementation
