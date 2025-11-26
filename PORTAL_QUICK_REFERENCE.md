# Portal Frontend - Quick Reference & Development Guide

## 📚 Documentation Set Overview

This folder now contains a complete portal frontend reference suite:

1. **PORTAL_FRONTEND_ANALYSIS.md** (567 lines)
   - Comprehensive component breakdown
   - All 13 portal UI components analyzed
   - Data structures and interfaces
   - Performance optimizations
   - Error handling strategies

2. **PORTAL_Z_INDEX_REFERENCE.md** (242 lines)
   - Visual stacking context diagrams
   - Z-index lookup tables
   - Responsive z-index behavior
   - Verification checklist
   - CSS variables recommendations

3. **PORTAL_COMPONENTS_VISUAL_ELEMENTS.md** (655 lines)
   - Complete HTML/JSX structures
   - Dimension and spacing specifications
   - Responsive behavior details
   - Styling specifications with Tailwind classes
   - Visual layout diagrams

---

## 🚀 Quick Navigation

### Find Information About...

**Component Structure?**
→ PORTAL_COMPONENTS_VISUAL_ELEMENTS.md

**Z-index Conflicts?**
→ PORTAL_Z_INDEX_REFERENCE.md

**Data Flow & Props?**
→ PORTAL_FRONTEND_ANALYSIS.md

**Styling & Colors?**
→ PORTAL_FRONTEND_ANALYSIS.md (Color Palette section)

**Responsive Behavior?**
→ PORTAL_COMPONENTS_VISUAL_ELEMENTS.md (Responsive sections)

---

## 📋 Portal Components Inventory

### Core Layout Components
```
✅ NavBar.tsx (150 lines)
   - Location: app/portal/ui/
   - Role: Main navigation with dropdowns
   - State: Single openMenu
   - Z-index: z-50 nav, z-20 dropdowns

✅ PortalTopBar.tsx (459 lines)
   - Location: app/portal/ui/
   - Role: Header with auth, sidebar, UF display
   - State: 4+ useState for dialogs, sidebar
   - Z-index: z-30 header, z-35 overlay, z-40 sidebar

✅ PortalClient.tsx (113 lines)
   - Location: app/portal/
   - Role: Filter state management
   - State: operation, typeProperty, state, city, currency
   - URL Sync: Yes (URLSearchParams)
```

### Property Display Components
```
✅ PropertyCard.tsx (700+ lines)
   - Location: app/portal/ui/
   - Role: Individual property display
   - Features: Image carousel, favorites, badges
   - Z-index: z-10 badges, z-0 content
   - Favorites: Cookie persistence + DB sync

✅ ListProperties.tsx (150 lines)
   - Location: app/portal/ui/
   - Role: Property grid with pagination
   - Grid: 1-2-3 columns responsive
   - Pagination: Smart 5-number display
   - State Management: Via parent (PortalClient)

✅ FeaturedPropertiesList.tsx (150 lines)
   - Location: app/portal/ui/
   - Role: Featured properties carousel grid
   - URL Param: featured_page (separate from page)
   - Similar Structure: Same as ListProperties
```

### Authentication Components
```
✅ LoginForm.tsx
   - Location: app/components/
   - Role: Email/password login
   - Callback: onClose prop for dialog closure
   - Success: Returns { accessToken, user }

✅ RegisterForm.tsx
   - Location: app/components/
   - Role: User registration form
   - Fields: nombre, apellido, email, password, confirmPassword
   - Placeholders: Updated "Nombre" and "Apellido"
```

### Dialog & Modal
```
✅ Dialog component
   - Location: app/components/Dialog/
   - Size Variants: xs, sm, md, lg
   - Z-index: z-50 (above all content)
   - Used For: Login, Register modals

✅ PortalTopBar Dialogs
   - LoginDialog: Opens on "Iniciar Sesión" click
   - RegisterDialog: Opens on "Registrarse" click
   - Both: Close when backdrop clicked or action succeeds
```

### Other Components
```
✅ Slider (Hero)
   - Location: app/portal/ui/
   - Role: Featured properties carousel
   - Z-index: z-10 controls, z-0 images

✅ CookieConsent
   - Location: app/portal/ui/
   - Role: Cookie acceptance banner
   - Z-index: z-50 (above everything)
   - Impact: Controls favorites visibility

✅ Wsp (WhatsApp Button)
   - Location: app/portal/ui/
   - Role: Floating WhatsApp contact button
   - Z-index: z-40 (below modals, above content)
```

---

## 🎨 Color Palette Quick Reference

```
Background Colors:
├── var(--background): Main background
├── white: Card backgrounds
├── #f3f4f6 (gray-100): Icon row background
└── #e5e7eb (gray-200): Image placeholder background

Text Colors:
├── #1f2937 (gray-800): Headings, primary text
├── #6b7280 (gray-600): Secondary text
├── #d1d5db (gray-400): Muted text, separators
└── white: Contrast text on badges

Accent Colors:
├── var(--primary): Brand primary (blue-600 typically)
├── var(--accent): Accent color (for favorites, highlights)
├── #22c55e (green-500): Featured ribbon
└── #2563eb (blue-600): Operation badges
```

---

## 📐 Dimension Reference Table

| Element | Width | Height | Aspect | Padding | Notes |
|---------|-------|--------|--------|---------|-------|
| PropertyCard | 100% | auto | — | — | Full container width |
| PropertyCard Media | 100% | auto | 16:9 | — | Fixed aspect ratio |
| NavBar | 100% | auto | — | 16px | Full viewport width |
| NavBar Items | auto | 40px | — | 8px 4px | Flex items |
| Dropdown Menu | 224px | auto | — | — | Fixed width |
| PortalTopBar | 100% | 64px | — | 0 32px md+ | Sticky header |
| Dialog | 320px | auto | — | 24px | xs size, centered |
| Grid Gap | — | — | — | — | 24px (gap-6) |
| Featured Ribbon | 200px | 32px | — | 4px 32px | Rotated -45deg |
| Operation Badge | auto | auto | — | 4px 8px | Rounded pill |

---

## 🔄 Data Flow Patterns

### Property List Flow
```
page.tsx (Server Component)
  ↓
  ├─→ getPublishedFeaturedProperties() [Server Action]
  ├─→ getPublishedPropertiesFiltered() [Server Action]
  ↓
  ├─→ PortalClient (Client Component)
  │   ├─ State: filters, page numbers
  │   ├─ URL Sync: URLSearchParams
  │   └─→ FeaturedPropertiesList & ListProperties
  │       ├─→ PropertyCard (for each property)
  │       └─→ PaginationControls
  └─→ NavBar (Server Component)
```

### Authentication Flow
```
PortalTopBar (Client Component)
  ├─ State: loginDialogOpen, registerDialogOpen
  ├─→ Dialog (Login)
  │   └─→ LoginForm
  │       ├ onSubmit → backend /auth/sign-in
  │       └ onClose → closes dialog
  └─→ Dialog (Register)
      └─→ RegisterForm
          ├ onSubmit → backend /auth/register
          └ onClose → closes dialog
```

### Favorites Flow
```
PropertyCard
  ├─ Cookie Check: cookiesAccepted
  ├─ Icon Toggle: ❤️ (filled) or 🤍 (outline)
  ├─ Database Sync: PATCH /properties/{id}/favorite
  └─ Cookie Update: favorites_[propertyId] = true/false
```

---

## 🎯 Common Development Tasks

### Add a New Component to Portal
1. Create file in `app/portal/ui/`
2. Check z-index needs (update PORTAL_Z_INDEX_REFERENCE.md if needed)
3. Ensure responsive classes (grid-cols-1 sm:grid-cols-2 lg:grid-cols-3)
4. Wire into page.tsx or parent component
5. Test on xs, sm, md, lg breakpoints

### Modify PropertyCard Layout
1. Update `PORTAL_COMPONENTS_VISUAL_ELEMENTS.md` structure first
2. Update relevant className in PropertyCard.tsx
3. Test image display with various sizes
4. Verify z-index of badges and buttons remains z-10
5. Check responsive behavior (16:9 aspect maintained)

### Fix Z-index Stacking Issue
1. Reference PORTAL_Z_INDEX_REFERENCE.md for current hierarchy
2. Check if new element exceeds max z-index (currently 50)
3. Identify parent element and its z-index context
4. Adjust in this priority order:
   - Content: z-0
   - Cards/UI: z-10
   - Overlays/Sidebars: z-30 to z-40
   - Modals/Dialogs: z-50
5. Update PORTAL_Z_INDEX_REFERENCE.md with new value

### Add a New Filter Option
1. Add field to PortalClient.tsx state
2. Update URLSearchParams serialization
3. Add UI control to PropertyFilter component
4. Wire to server action: getPublishedPropertiesFiltered()
5. Test pagination reset when filters change

### Change Color Scheme
1. Find color in PORTAL_FRONTEND_ANALYSIS.md Color Palette section
2. Search PORTAL_COMPONENTS_VISUAL_ELEMENTS.md for className
3. Update Tailwind class (e.g., bg-blue-600 → bg-purple-600)
4. Test on all components using that color
5. Update color palette reference in this document

---

## ✅ Quality Checklist

### Before Deploying Portal Changes
- [ ] Tested on xs, sm, md, lg screen sizes
- [ ] Z-index verified (no stacking conflicts)
- [ ] Images display with correct 16:9 aspect
- [ ] Pagination controls work on all page numbers
- [ ] Login/Register dialogs close properly
- [ ] Favorites toggle visible only when cookies accepted
- [ ] Navigation dropdowns blur-close when expected
- [ ] Sidebar overlay disappears when backdrop clicked
- [ ] No console errors in browser DevTools
- [ ] Performance: Lighthouse score ≥ 90
- [ ] Accessibility: All buttons keyboard accessible
- [ ] Documented in PORTAL_FRONTEND_ANALYSIS.md if structural changes

---

## 🔗 Component Relationships Map

```
┌─────────────────────────────────────────────────────────────┐
│                      page.tsx (Root)                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
├─→ NavBar                                                   │
│   ├─ Material Icons: home, arrow_drop_down               │
│   └─ Dropdowns: Nosotros, Propiedades                   │
│                                                             │
├─→ PortalTopBar                                            │
│   ├─ Logo Display                                        │
│   ├─ UF Display                                          │
│   ├─ Menu Button [☰]                                    │
│   ├─ Sidebar (Overlay + Panel)                          │
│   │  ├─ Navigation (same as NavBar)                    │
│   │  └─ Logout Button (if logged in)                  │
│   ├─ Dialog (Login)                                     │
│   │  └─ LoginForm                                     │
│   └─ Dialog (Register)                                  │
│      └─ RegisterForm                                   │
│                                                             │
├─→ PortalClient                                            │
│   ├─ Filter State (operation, typeProperty, etc)       │
│   ├─ URL Synchronization                               │
│   │                                                      │
│   ├─→ FeaturedPropertiesList                           │
│   │   ├─→ PropertyCard (map)                          │
│   │   │   ├─ Featured Ribbon (if featured=true)      │
│   │   │   ├─ Operation Badge                         │
│   │   │   ├─ Image Carousel                          │
│   │   │   ├─ Favorites Toggle                        │
│   │   │   └─ Details (price, location, etc)          │
│   │   └─→ PaginationControls                         │
│   │       ├─ Previous Button                         │
│   │       ├─ Page Numbers (max 5)                    │
│   │       └─ Next Button                             │
│   │                                                      │
│   └─→ ListProperties                                    │
│       ├─→ PropertyCard (map)                          │
│       │   └─ [Same structure as above]               │
│       └─→ PaginationControls                         │
│                                                             │
├─→ Slider (Hero/Featured)                                 │
│   └─ Image Carousel                                     │
│                                                             │
├─→ CookieConsent                                          │
│   └─ Controls favorites visibility                      │
│                                                             │
└─→ Wsp (WhatsApp Button)                                  │
    └─ Floating contact button                             │
```

---

## 🚨 Known Issues & Solutions

### Issue: Favorites not showing
**Solution:** Check if `cookiesAccepted` state is true. Favorites only show after cookie consent.

### Issue: Z-index conflict with modals
**Solution:** Reference PORTAL_Z_INDEX_REFERENCE.md. Modals should be z-50, sidebars z-40, overlays z-35.

### Issue: Images not 16:9 aspect
**Solution:** Check PropertyCard className has `aspect-[16/9] object-cover` on img element.

### Issue: Pagination not working
**Solution:** Verify ListProperties receives `onPageChange` prop and calls it correctly. Check URL parameter name (page vs featured_page).

### Issue: Dropdown menu misaligned
**Solution:** Check NavBar dropdown has `absolute left-0 top-full` and parent has `relative` positioning.

### Issue: Sidebar overlay not closing
**Solution:** Verify Sidebar component has `onClick={onClose}` on overlay div with z-35 and `inset-0`.

---

## 📞 Support & Questions

For detailed information about:
- **Component Architecture**: See PORTAL_FRONTEND_ANALYSIS.md
- **Z-index Hierarchy**: See PORTAL_Z_INDEX_REFERENCE.md
- **Visual Layout & Styling**: See PORTAL_COMPONENTS_VISUAL_ELEMENTS.md
- **Specific Component Code**: Search in `app/portal/ui/` directory

---

**Last Updated:** November 26, 2025
**Documentation Set:** Complete (3 files, 1,464 lines)
**Status:** Ready for Development 🚀
