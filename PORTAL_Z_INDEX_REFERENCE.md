# Portal Z-Index Quick Reference

## 📊 Z-Index Stacking Context (Completo)

```
┌─────────────────────────────────────────────────────────────┐
│ z-50 ▲ MÁXIMO - DIALOGS & BANNERS                           │
├─────────────────────────────────────────────────────────────┤
│      • Dialog / Modal (Login, Register)                      │
│      • CookieConsent banner (fixed bottom-right)             │
└─────────────────────────────────────────────────────────────┘
                           ▲
┌─────────────────────────────────────────────────────────────┐
│ z-40 - SIDEBARS & FLOATING ELEMENTS                          │
├─────────────────────────────────────────────────────────────┤
│      • PortalTopBar Sidebar Panel (fixed left)               │
│      • Wsp WhatsApp Button (fixed bottom-right)              │
│      • SubPage NavBar sticky (z-40 en layouts)               │
└─────────────────────────────────────────────────────────────┘
                           ▲
┌─────────────────────────────────────────────────────────────┐
│ z-35 - OVERLAYS TRANSPARENTES                               │
├─────────────────────────────────────────────────────────────┤
│      • Sidebar Overlay (bg-transparent, clickable)           │
└─────────────────────────────────────────────────────────────┘
                           ▲
┌─────────────────────────────────────────────────────────────┐
│ z-30 - MAIN NAVIGATION BARS                                 │
├─────────────────────────────────────────────────────────────┤
│      • PortalTopBar <header> sticky top-0                    │
│        (Logo, UF display, user info, menu button)            │
└─────────────────────────────────────────────────────────────┘
                           ▲
┌─────────────────────────────────────────────────────────────┐
│ z-20 - DROPDOWNS & MENUS                                    │
├─────────────────────────────────────────────────────────────┤
│      • NavBar Dropdown "Nosotros" (absolute positioned)      │
│      • NavBar Dropdown "Propiedades" (absolute positioned)   │
└─────────────────────────────────────────────────────────────┘
                           ▲
┌─────────────────────────────────────────────────────────────┐
│ z-10 - INTERACTIVE OVERLAYS & BADGES                        │
├─────────────────────────────────────────────────────────────┤
│      • PropertyCard Featured Ribbon ("DESTACADA")            │
│      • PropertyCard Operation Badge ("EN VENTA"/"EN ARR.")   │
│      • PropertyCard Chevron Buttons (prev/next images)       │
│      • Slider Active/Inactive Images (in carousel)           │
│      • Slider Controls Overlay (buttons, indicators)         │
└─────────────────────────────────────────────────────────────┘
                           ▲
┌─────────────────────────────────────────────────────────────┐
│ z-0 (DEFAULT) - CONTENT & CARDS                             │
├─────────────────────────────────────────────────────────────┤
│      • PropertyCard backgrounds                              │
│      • ListProperties grid                                   │
│      • FeaturedPropertiesList grid                           │
│      • All page content                                      │
│      • Footer                                                │
└─────────────────────────────────────────────────────────────┘

```

---

## 🎯 Z-Index por Componente

### NavBar.tsx
| Elemento | Z-Index | Notas |
|----------|---------|-------|
| `<nav>` principal | `z-50` | Barra navegación principal, full-width |
| Dropdown "Nosotros" | `z-20` | `absolute left-0 top-full` |
| Dropdown "Propiedades" | `z-20` | `absolute left-0 top-full` |

### PortalTopBar.tsx
| Elemento | Z-Index | Notas |
|----------|---------|-------|
| `<header>` | `z-30` | `sticky top-0 left-0` |
| Sidebar Panel | `z-40` | `fixed left-0 top-0 h-full w-64` |
| Sidebar Overlay | `z-35` | `fixed inset-0 bg-transparent` |

### PropertyCard.tsx
| Elemento | Z-Index | Notas |
|----------|---------|-------|
| Featured Ribbon | `z-10` | `absolute top-0 left-0`, rotated -45deg |
| Operation Badge | `z-10` | `absolute top-2 right-2` |
| Chevron Buttons | `z-10` | `absolute left-2/right-2 top-1/2` |
| Card Background | `z-0` | Default stacking |

### Slider.tsx
| Elemento | Z-Index | Notas |
|----------|---------|-------|
| Active Image | `z-10` | `opacity-100` |
| Inactive Image | `z-0` | `opacity-0` |
| Controls | `z-10` | Overlay con buttons |

### CookieConsent.tsx
| Elemento | Z-Index | Notas |
|----------|---------|-------|
| Banner Container | `z-50` | `fixed bottom-4 right-4` |

### Wsp.tsx (WhatsApp)
| Elemento | Z-Index | Notas |
|----------|---------|-------|
| Button Container | `z-40` | `fixed bottom-6 right-6 rounded-full` |

---

## 📱 Responsive Z-Index Changes

### Por Tamaño de Pantalla
```
xs/sm (< 640px)
└── Sidebar visible en menú hamburger
    └── z-40 panel, z-35 overlay

md+ (≥ 640px)
├── Sidebar content en TopBar
└── Menu items visible directamente (z-20)
```

### Layout Sidebars (subpáginas)
Archivos: `aboutUs/layout.tsx`, `blog/layout.tsx`, `ourTeam/layout.tsx`, etc.
```
NavBar sticky: z-40
└── Aparece bajo TopBar (z-30)
└── Encima de content (z-0)
```

---

## 🔄 Stacking Order (Superpuesto)

```
[Dialogs/Modals] (z-50)
        ↓
[Sidebar Panel] (z-40)
    [Wsp Button] (z-40)
        ↓
[Sidebar Overlay] (z-35)
        ↓
[TopBar Header] (z-30)
        ↓
[NavBar Dropdowns] (z-20)
        ↓
[Card Badges] (z-10)
[Chevron Buttons] (z-10)
        ↓
[Content] (z-0)
    [Grid Cards] (z-0)
    [Images] (z-0)
    [Footer] (z-0)
```

---

## ✅ Verificación de Z-Index

### En NavBar
```tsx
<nav className="w-full bg-background z-50" aria-label="Main navigation">
  {/* Dropdowns */}
  <ul className="absolute left-0 top-full mt-1 w-56 bg-white border border-neutral-200 rounded shadow-lg z-20">
```
✅ Correcto: dropdown (z-20) < nav (z-50)

### En PortalTopBar
```tsx
<header className="... sticky top-0 left-0 z-30">
  {/* Sidebar Overlay */}
  <div className="fixed inset-0 bg-transparent z-35 ...">
  {/* Sidebar Panel */}
  <div className="fixed left-0 top-0 ... z-40 ...">
```
✅ Correcto: overlay (z-35) > header (z-30), panel (z-40) > overlay (z-35)

### En PropertyCard
```tsx
<div className="relative bg-white rounded-lg ... property-card shadow-lg">
  {/* Featured Ribbon */}
  <div className="featured-ribbon" style={{... zIndex: 10 ...}}>
  
  {/* Operation Badge */}
  <div className="absolute top-2 right-2 ... z-10">
```
✅ Correcto: badges (z-10) visible sobre card (z-0)

---

## ⚠️ Problemas Potenciales

### No Resolver:
1. ✅ Dropdowns bajo header - ✓ z-20 < z-30 es correcto (dropdowns abren hacia abajo)
2. ✅ Sidebar panel sobre overlay - ✓ z-40 > z-35 es correcto
3. ✅ Badges sobre images - ✓ z-10 > z-0 es correcto

### Podría Mejorar:
1. Usar CSS variables para z-index en lugar de hardcoded
2. Documentar stacking context claramente en cada componente
3. Considerar mobile-first z-index strategy

---

## 🎨 Estructura CSS Recomendada

```css
/* Variables de Z-Index */
:root {
  --z-default: 0;
  --z-dropdown: 20;
  --z-topbar: 30;
  --z-overlay: 35;
  --z-sidebar: 40;
  --z-modal: 50;
  
  /* Interactive elements */
  --z-badge: 10;
  --z-button: 10;
}

/* Uso en componentes */
nav { z-index: var(--z-topbar); }
[role="dialog"] { z-index: var(--z-modal); }
.dropdown { z-index: var(--z-dropdown); }
```

---

## 📋 Checklist de Z-Index

- [x] Dropdowns aparecen sobre content
- [x] Sidebar panel está sobre overlay
- [x] Dialogs están sobre todo
- [x] Badges visibles en cards
- [x] NavBar no cubre propiedades
- [x] Responsivo funciona en xs/sm/md/lg
- [x] Overflow hidden no interfiere
- [x] Position relative/fixed/sticky coherentes
- [x] Box shadow visible apropiadamente

---

**Última actualización:** 26 de Noviembre, 2025
