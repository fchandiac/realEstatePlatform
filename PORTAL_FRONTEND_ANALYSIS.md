# Análisis Detallado - Portal Frontend (`/frontend/app/portal`)

**Fecha:** 26 de Noviembre, 2025  
**Versión:** 1.0

---

## 📋 Estructura General del Portal

```
/frontend/app/portal/
├── page.tsx                    (Server Component - Página Principal)
├── PortalClient.tsx           (Client Component - Filtros y Búsqueda)
├── layout.tsx                 (Layout compartido)
├── aboutUs/                   (Nosotros - ¿Quiénes somos?)
├── blog/                      (Blog - Artículos)
├── ourTeam/                   (Nuestro equipo)
├── properties/                (Propiedades en venta/arriendo)
├── publish/                   (Publicar propiedad)
├── services/                  (Servicio de administración)
├── testimonials/              (Testimonios)
├── verify-email/              (Verificación de email)
└── ui/                        (Componentes compartidos)
    ├── NavBar.tsx             (Barra de navegación con dropdowns)
    ├── PortalTopBar.tsx       (Barra superior con login/register)
    ├── PropertyCard.tsx       (Card individual de propiedad)
    ├── PropertyFilter.tsx     (Filtros de búsqueda)
    ├── ListProperties.tsx     (Grid de propiedades normales)
    ├── FeaturedPropertiesList.tsx (Grid de propiedades destacadas)
    ├── Slider.tsx             (Slider hero)
    ├── CookieConsent.tsx      (Consentimiento de cookies)
    ├── Wsp.tsx                (Botón WhatsApp)
    ├── LoginForm.tsx          (Formulario login)
    ├── RegisterForm.tsx       (Formulario registro)
    ├── PortalFooter.tsx       (Footer)
    ├── PortalContent.tsx      (Contenido portal)
    └── Slider.tsx             (Hero slider)
```

---

## 🎨 Componentes Principales

### 1. **NavBar.tsx** - Navegación Principal
**Ubicación:** `/portal/ui/NavBar.tsx`  
**Tipo:** Client Component  
**Estado:** Stateful (maneja dropdowns)

#### Estructura:
```
<nav> [z-50]
  ├── <li> Home link
  ├── <li> Dropdown "Nosotros" [relative]
  │   └── <ul> [z-20] - Menú desplegable
  │       ├── Quiénes somos
  │       ├── Nuestro Equipo
  │       └── Testimonios
  ├── <li> Dropdown "Propiedades" [relative]
  │   └── <ul> [z-20] - Menú desplegable
  │       ├── En Arriendo
  │       ├── En Venta
  │       └── Servicio de Administración
  ├── <li> Publica tu propiedad
  └── <li> Blog (hidden en xs/sm)
```

#### Características:
- **Estado:** Un solo `openMenu` para controlar qué dropdown está abierto
- **Dropdowns:** 2 menús anidados (Nosotros, Propiedades)
- **Navegación:** Cierra menú al navegar
- **Aria Labels:** Accesibilidad con `aria-haspopup`, `aria-expanded`
- **Blur Handling:** Cierra menú si pierde el foco

#### Z-Index Usado:
- `z-50` - Nav principal
- `z-20` - Dropdowns

---

### 2. **PortalTopBar.tsx** - Barra Superior con Auth
**Ubicación:** `/portal/ui/PortalTopBar.tsx`  
**Tipo:** Server + Client Components (híbrido)  
**Estado:** Muy stateful (múltiples dialogs, sidebars, menús)

#### Estructura Jerárquica:

```
TopBar Component
├── <header> [z-30] sticky top-0
│   ├── Logo section
│   ├── UF display
│   ├── Menu buttons
│   └── User info (si está logueado)
│
├── Sidebar [z-40] fixed left-0 top-0
│   ├── Overlay [z-35] bg-transparent
│   └── Panel [z-40] bg-white/60 backdrop-blur
│       ├── Header (Logo + Nombre usuario)
│       └── Navegación (mismo que NavBar)
│
├── Dialog: Login [z-50]
│   └── LoginForm
│       ├── Logo empresa
│       ├── Email field
│       ├── Password field
│       ├── Login button
│       └── Register link
│
└── Dialog: Register [z-50]
    └── RegisterForm
        ├── Nombre field
        ├── Apellido field
        ├── Email field
        ├── Password field
        ├── Confirm password field
        ├── Register button
        └── Login link
```

#### Características del TopBar:
- **Sticky:** `sticky top-0 z-30`
- **Menú dinámico:** Visible xs/sm o solo cuando logueado en md+
- **Sidebar dinámico:** Overlay transparente + panel con blur
- **UF Display:** Muestra UF actualizado
- **Dialogs Modulares:** Login y Register en dialogs separados

#### Características del Sidebar:
- **Fixed positioning:** `fixed left-0 top-0 h-full w-64`
- **Glass morphism:** `bg-white/60 backdrop-blur backdrop-saturate-150`
- **Animaciones:** `transform transition-transform duration-300`
- **Border styling:** `border border-white/20`
- **Overlay:** Fondo transparente que cierra sidebar

#### Z-Index Hierarchy:
```
Dialog (z-50) - Modales de login/registro
  ↑
Sidebar Panel (z-40) - Menú lateral
  ↑
Overlay Sidebar (z-35) - Fondo transparente del sidebar
  ↑
TopBar Header (z-30) - Barra superior sticky
  ↓
NavBar Dropdowns (z-20) - Si aparecen
  ↓
Content (z-0)
```

---

### 3. **PropertyCard.tsx** - Card Individual
**Ubicación:** `/portal/ui/PropertyCard.tsx`  
**Tipo:** Client Component (maneja favoritos, navegación de imágenes)  
**Complejidad:** Alta (lógica multimedia, favoritos, cookies)

#### Estructura Visual:

```
┌─────────────────────────────────────────┐
│ 🎯 DESTACADA (si es featured)           │ [z-10 ribbon]
│ ┌───────────────────────────────────────┤
│ │  EN VENTA / EN ARRIENDO (badge) [z-10]│
│ │  ┌─────────────────────────────────┐ │
│ │  │   [Imagen Principal]            │ │
│ │  │ ◀ [chevron_left] [chevron_right] ▶│ [buttons z-10]
│ │  │   (si hay múltiples imágenes)    │ │
│ │  └─────────────────────────────────┘ │
│ ├─────────────────────────────────────────┤ [bg-gray-100]
│ │ 🛏️ 3   🚿 2   🏠 80m²   🅿️ 1      │ [icons row]
│ ├─────────────────────────────────────────┤
│ │         Tipo Propiedad                  │
│ │                                         │
│ │   Título de la Propiedad                │ [line-clamp-2]
│ │                                         │
│ │   $ 450.000.000                         │ [precio]
│ │                                         │
│ │    Región • Comuna                      │ [ubicación]
│ ├─────────────────────────────────────────┤ [border-t]
│ │  [Ver propiedad] [❤️ favorito]        │ [actions]
│ └─────────────────────────────────────────┘
```

#### Características Clave:

**Manejo de Imágenes:**
- Normaliza URLs relativas/absolutas
- Detecta videos automáticamente
- Fallback a placeholder si no hay imagen
- Navegación con chevrons si hay múltiples imágenes
- Carga lazy ("lazy")

**Estilos Especiales:**
- **Featured ribbon:** Posicionado absolutely con rotate(-45deg), `z-10`
- **Operation badge:** `top-2 right-2 z-10`
- **Navegación chevrons:** `absolute left-2/right-2 bg-black/70`
- **Line clamp:** Título en `line-clamp-2`

**Funcionalidades:**
- Toggle favoritos con cookies
- Abre propiedad en nueva ventana
- Muestra precio en CLP o UF con formato localizado
- Muestra solo características relevantes según `propertyType`
- Manejo de errores de carga de imágenes

#### Z-Index Interno:
- `z-10` - Operation badge, featured ribbon, navigation buttons
- `z-0` - Card background

---

### 4. **ListProperties.tsx** - Grid de Propiedades
**Ubicación:** `/portal/ui/ListProperties.tsx`  
**Tipo:** Client Component  
**Propósito:** Mostrar grid de propiedades con paginación

#### Estructura:

```
<div> Container
├── <div> Grid de PropertyCards [grid-cols-1 sm:grid-cols-2 lg:grid-cols-3]
│   └── PropertyCard × N
│
└── <div> PaginationControls
    ├── [← Anterior] button
    ├── [1] [2] [3] [4] [5] buttons (máximo 5)
    └── [Siguiente →] button
```

#### Características:
- **Responsive grid:** 1 columna (xs), 2 (sm), 3 (lg)
- **Gap:** 6 (24px entre cards)
- **Paginación:** Inteligente, muestra máximo 5 números de página
- **Estados de carga:** Opacity 70% mientras carga

#### Paginación:
- Centrada en la página actual
- Muestra 5 números máximo
- Ajusta automáticamente si está cerca del final
- Deshabilita botones si está cargando

---

### 5. **FeaturedPropertiesList.tsx** - Grid de Destacadas
**Ubicación:** `/portal/ui/FeaturedPropertiesList.tsx`  
**Tipo:** Client Component  
**Diferencia con ListProperties:** Usa parámetro `featured_page` en URL

#### Estructura:
Similar a `ListProperties` pero con:
- Parámetro URL: `featured_page=X`
- Endpoint diferente en backend
- Mismo componente PropertyCard

---

## 📊 Lista Completa de Z-Index por Componente

| Componente | Elemento | Z-Index | Propósito |
|-----------|----------|---------|-----------|
| **NavBar.tsx** | `<nav>` principal | `z-50` | Barra navegación principal |
| **NavBar.tsx** | Dropdowns (Nosotros, Propiedades) | `z-20` | Menús desplegables |
| **PortalTopBar.tsx** | `<header>` sticky | `z-30` | Barra superior |
| **PortalTopBar.tsx** | Sidebar panel | `z-40` | Panel lateral deslizable |
| **PortalTopBar.tsx** | Sidebar overlay | `z-35` | Fondo transparente del sidebar |
| **Dialog** (componente base) | Dialog modal | `z-50` | Diálogos de login/registro |
| **PropertyCard.tsx** | Featured ribbon | `z-10` | Cinta "DESTACADA" |
| **PropertyCard.tsx** | Operation badge | `z-10` | Badge "EN VENTA"/"EN ARRIENDO" |
| **PropertyCard.tsx** | Chevron buttons | `z-10` | Botones navegación imágenes |
| **PropertyCard.tsx** | Card background | `z-0` | Fondo card (default) |
| **Slider.tsx** | Imágenes activas/inactivas | `z-10` / `z-0` | Control de opacidad en rotación |
| **Slider.tsx** | Controles overlay | `z-10` | Botones/controles sobre slider |
| **CookieConsent.tsx** | Banner cookie | `z-50` | Permanece arriba de todo |
| **Wsp.tsx** | Botón WhatsApp | `z-40` | Fixed bottom-right |
| **Layout files** | NavBar sticky | `z-40` | En subpáginas (aboutUs, etc) |

---

## 🎯 Jerarquía de Z-Index General (Portal)

```
z-50 (Máximo)
├── Dialog/Modales (Login, Register)
└── CookieConsent banner

z-40
├── PortalTopBar Sidebar panel
├── Wsp (WhatsApp button)
└── SubPage NavBar sticky

z-35
└── PortalTopBar Sidebar overlay (transparente)

z-30
└── PortalTopBar header sticky

z-20
└── NavBar dropdowns

z-10
├── PropertyCard featured ribbon
├── PropertyCard operation badge
├── PropertyCard chevron buttons
└── Slider images/controls

z-0 (Default)
└── Content, cards, etc
```

---

## 🔄 Flujo de Navegación

### Página Principal (`/portal`)
```
1. Server: page.tsx
   ├── Fetch featured properties
   ├── Fetch filtered properties
   └── Render:
       ├── Slider (hero)
       ├── NavBar (sticky)
       ├── FeaturedPropertiesList
       └── PortalClient (client component)
           ├── PropertyFilter (búsqueda)
           └── ListProperties (grid)

2. Client: PortalClient
   ├── Maneja cambios de filtros
   ├── Actualiza URL sin reload
   └── Recarga propiedades vía server action
```

### Con PortalTopBar
```
PortalTopBar (siempre en todas las páginas vía layout)
├── Si NOT logueado:
│   ├── Logo + Empresa info
│   ├── Menú (xs/sm visible, md+ hidden)
│   └── Auth buttons (Login, Register)
│
└── Si logueado:
    ├── Logo + User info (first name + avatar)
    ├── Menú (xs/sm visible, md+ visible)
    ├── UF display
    └── Logout button en sidebar
```

---

## 📱 Responsividad

### NavBar
- **xs/sm:** Items solo texto, home sin icono
- **md+:** Full layout con iconos
- **Dropdowns:** Aparecen igual en todos los tamaños

### PropertyCard
- **xs:** Card ancho completo
- **sm:** 2 columnas
- **md/lg:** 3 columnas
- **Imagen:** Siempre aspect-video (16:9)

### PortalTopBar
- **xs/sm:** Menú en hamburger/sidebar
- **md+:** Logo + company info + UF + user info

### PortalTopBar Sidebar
- **xs/sm:** `w-64` (256px) ancho fijo
- **md+:** Contenido similar pero en topbar

---

## 🎨 Colores y Estilos

### Paleta Principal
```
Primary: var(--primary)          [Azul, usado en badges, links]
Accent: var(--accent)            [Verde, usado en favoritos]
Background: var(--background)    [Blanco/gris claro]
Foreground: var(--foreground)    [Negro/gris oscuro]
Muted: var(--muted-foreground)   [Gris medio para texto secundario]
```

### Componentes Específicos
- **Operation badge:** `bg-blue-600`
- **Featured ribbon:** `bg-green-500`
- **Sidebar:** `bg-white/60 backdrop-blur`
- **Dropdown hover:** `hover:bg-primary/10`
- **Price:** `text-gray-800` + bold

---

## 🔐 Estados de Autenticación

### No Logueado
- Botones: "Iniciar Sesión" y "Registrarse"
- Dialog login/register disponibles
- Sidebar muestra opciones públicas
- Favoritos deshabilitados (solo si cookies aceptadas)

### Logueado
- Muestra nombre del usuario
- Avatar/person icon
- Menú + logout button
- Favoritos habilitados
- Middleware redirige a backOffice si es ADMIN/AGENT

---

## 🎯 Elementos Interactivos

### Buttons
- **Primary:** Background sólido, usado en "Ver propiedad"
- **Text:** Sin background, usado en links internos
- **Outlined:** Border solo, usado en paginación

### Inputs
- **TextField:** Email, password en formularios
- **Select/Dropdown:** Filtros de propiedad

### Cards
- **PropertyCard:** Clicable, abre propiedad en nueva ventana
- **Favorito toggle:** ❤️ icon que alterna estado

### Navegación
- **NavBar dropdowns:** Click/blur para abrir/cerrar
- **Sidebar:** Click overlay para cerrar
- **Paginación:** Click en números de página

---

## 📊 Datos y Props

### PropertyCard
```typescript
interface PortalProperty {
  id: string;
  title: string;
  description?: string | null;
  status?: string;
  operationType: 'SALE' | 'RENT';
  price: number;
  currencyPrice: 'CLP' | 'UF';
  state?: string | null;      // Región
  city?: string | null;        // Comuna
  propertyType?: PropertyTypeLite;
  mainImageUrl?: string | null;
  multimedia?: MediaItem[];
  bedrooms?: number | null;
  bathrooms?: number | null;
  builtSquareMeters?: number | null;
  landSquareMeters?: number | null;
  parkingSpaces?: number | null;
  isFeatured?: boolean;
}
```

### Pagination
```typescript
interface PaginationData {
  total: number;           // Total de propiedades
  page: number;            // Página actual
  limit: number;           // Items por página
  totalPages: number;      // Total de páginas
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
```

---

## ⚡ Performance Optimizaciones

### PropertyCard
- `loading="lazy"` en imágenes
- Normalización de URLs en memoria
- Evita duplicados de imágenes
- Fallback graceful en errores de carga

### ListProperties
- Opacity transition en loading
- Paginación limitada a 5 números máximo
- Grid lazy rendering (React)

### NavBar
- Single state para múltiples dropdowns
- Blur event para cerrar automáticamente
- Navegación cierra menú instantáneamente

---

## 🐛 Manejo de Errores

### PropertyCard
- Imagen no carga → Intenta siguiente
- Video no carga → Muestra placeholder
- Multimedia URL inválida → Usa fallback

### Favoritos
- Error en toggle → Muestra alert
- Problema con cookies → Log en consola
- Sin permisos → Disable button

### Filtros
- Error en load properties → Log en consola, mantiene estado previo
- Timeout → Timeout estándar del fetch

---

## 📝 Notas de Desarrollo

### Para Mejorar:
1. **Z-Index:** Usar constantes CSS variables en lugar de hardcoded
2. **Responsive:** Consider grid colums en tablets (4 columnas?)
3. **Accesibilidad:** Mejorar ARIA labels en PropertyCard
4. **Performance:** Virtualization si hay muchas cards
5. **SEO:** Meta tags en subpáginas

### Archivos Relacionados:
- `/portal/layout.tsx` - Layout root
- `/portal/page.tsx` - Página principal
- `/components/Dialog/Dialog.tsx` - Dialog base component
- `/components/Button/Button.tsx` - Button variants
- `/components/TextField/TextField.tsx` - Input fields
- `/app/actions/properties.ts` - Server actions para propiedades
- `/app/actions/portalProperties.ts` - Server actions portal
- `/app/hooks/useAlert.ts` - Alert context hook

---

## 🎬 Flujo Completo de Interacción

```
Usuario entra en /portal
  ↓
1. Carga page.tsx (server)
   - Fetch featured properties
   - Fetch regular properties (sin filtros)
   ↓
2. Renderiza layout + PortalTopBar
   - PortalTopBar muestra auth buttons o user info
   ↓
3. Usuario ve:
   - Slider (hero)
   - NavBar (navegación)
   - FeaturedPropertiesList (grid 3 columnas)
   - PropertyFilter (filtros)
   - ListProperties (grid 3 columnas)
   ↓
4. Interacciones posibles:
   
   a) Click en NavBar → Navega a subpágina
   b) Click en PropertyCard → Abre propiedad en nueva ventana
   c) Click favorito → Toggle favorito (si cookies aceptadas)
   d) Cambio de filtro → Actualiza URL + recarga propiedades
   e) Click pagination → Carga siguiente página
   f) Click Login → Abre Dialog con LoginForm
   g) Click Register → Abre Dialog con RegisterForm
   h) Logout (si logueado) → Cierra sesión + redirect

5. Si es ADMIN/AGENT logueado:
   - Middleware redirige a /backOffice automáticamente
   - No ve portal (excepto si accede URL directa sin sesión)
```

---

**Análisis completo realizado.**
