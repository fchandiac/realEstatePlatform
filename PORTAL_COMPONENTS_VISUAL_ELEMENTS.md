# Portal Components - Visual Elements & Structure

## 🎯 PropertyCard - Desglose Visual Completo

### HTML/JSX Structure
```jsx
<div className="relative bg-white rounded-lg w-full text-left property-card shadow-lg overflow-hidden">
  
  {/* Featured Ribbon (opcional, si isFeatured=true) */}
  {featured && (
    <div className="featured-ribbon" style={{zIndex: 10}}>
      DESTACADA
    </div>
  )}
  
  {/* Operation Badge (siempre si hay operationType) */}
  {opText && (
    <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full border-2 border-white shadow-lg z-10">
      EN VENTA / EN ARRIENDO
    </div>
  )}
  
  {/* Media Container - Imagen o Video */}
  <div className="flex items-center justify-center w-full aspect-[16/9] bg-gray-200 text-gray-400 overflow-hidden relative">
    {mediaEl}  {/* Imagen, Video, o Fallback */}
    
    {/* Navigation Buttons (solo si hay múltiples imágenes) */}
    {hasImages && images.length > 1 && (
      <>
        <button className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/70 hover:bg-black/90">
          chevron_left
        </button>
        <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/70 hover:bg-black/90">
          chevron_right
        </button>
      </>
    )}
  </div>
  
  {/* Icons Row - Características */}
  <div className="justify-center flex items-center gap-3 px-4 py-2 bg-gray-100">
    {bedrooms && <span>🛏️ {bedrooms}</span>}
    {bathrooms && <span>🚿 {bathrooms}</span>}
    {builtSquareMeters && <span>🏠 {builtSquareMeters}m²</span>}
    {landSquareMeters && <span>📐 {landSquareMeters}m²</span>}
    {parkingSpaces && <span>🅿️ {parkingSpaces}</span>}
  </div>
  
  {/* Content Section */}
  <div className="p-6 text-center">
    {/* Property Type */}
    <div className="flex justify-center mb-2 text-thin text-xs">
      <p>{propertyTypeName}</p>
    </div>
    
    {/* Title - line-clamp-2 */}
    <h2 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2">
      {property.title}
    </h2>
    
    {/* Price */}
    <h3 className="text-xl font-bold text-gray-800 mb-2">
      $ 450.000.000  {/* or UF X.XXX */}
    </h3>
    
    {/* Location */}
    <div className="flex flex-col items-center space-y-1 text-center">
      <div className="flex justify-center items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-600 font-medium">Región</span>
        <span className="text-xs text-gray-400">•</span>
        <span className="text-xs text-gray-600 font-medium">Comuna</span>
      </div>
    </div>
  </div>
  
  {/* Footer Row with Button & Favorite */}
  <div className="flex justify-between items-center px-6 py-1 border-t border-gray-100">
    <Button variant="primary" className="px-3 py-1 text-xs font-medium">
      Ver propiedad
    </Button>
    
    {/* Favorite Button (solo si cookies aceptadas) */}
    {cookiesAccepted && (
      <button onClick={handleToggleFavorite} className="transition-all duration-200 hover:scale-110">
        <span className={isFavorited ? 'fill-accent text-accent' : 'text-gray-400'}>
          {isFavorited ? '❤️' : '🤍'}
        </span>
      </button>
    )}
  </div>
</div>
```

### Dimensiones y Espaciados
```
PropertyCard {
  width: 100%
  border-radius: 8px (rounded-lg)
  background: white
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1)
  overflow: hidden
  
  Featured Ribbon {
    position: absolute
    top: 0, left: 0
    transform: rotate(-45deg) translate(-20%, 270%)
    background: #22c55e (green-500)
    padding: 0.25rem 2rem
    z-index: 10
    box-shadow: 0 2px 4px rgba(0,0,0,0.2)
  }
  
  Operation Badge {
    position: absolute
    top: 8px (0.5rem), right: 8px
    background: #2563eb (blue-600)
    color: white
    padding: 4px 8px (0.25rem 0.5rem)
    border-radius: 999px (rounded-full)
    border: 2px white
    font-size: 12px (text-xs)
    z-index: 10
  }
  
  Media Container {
    width: 100%
    aspect-ratio: 16/9
    background: #e5e7eb (gray-200)
    position: relative
    overflow: hidden
    
    Chevron Button {
      position: absolute
      top: 50% (translate-y-1/2)
      width: 40px
      height: 40px
      background: rgba(0,0,0,0.7)
      hover: rgba(0,0,0,0.9)
      border-radius: 50%
      color: white
      opacity: 0.8
      hover-opacity: 1.0
      z-index: 10
    }
  }
  
  Icons Row {
    padding: 8px 16px (py-2 px-4)
    background: #f3f4f6 (gray-100)
    display: flex
    gap: 12px (gap-3)
    justify-content: center
    align-items: center
    
    Icon {
      font-size: 20px
      color: var(--primary)
      display: flex
      gap: 4px
      white-space: nowrap
      text-size: 12px (text-xs)
      color: #374151 (gray-700)
    }
  }
  
  Content Section {
    padding: 24px (p-6)
    text-align: center
    
    Type {
      font-size: 12px (text-xs)
      font-weight: 300
      color: #6b7280 (gray-600)
      margin-bottom: 8px
    }
    
    Title {
      font-size: 18px (text-lg)
      font-weight: 700 (bold)
      color: #1f2937 (gray-800)
      margin-bottom: 12px
      max-lines: 2 (line-clamp-2)
    }
    
    Price {
      font-size: 20px (text-xl)
      font-weight: 700 (bold)
      color: #1f2937 (gray-800)
      margin-bottom: 8px
    }
    
    Location {
      display: flex
      flex-direction: column
      align-items: center
      gap: 4px (space-y-1)
      
      Separator {
        color: #d1d5db (gray-400)
      }
    }
  }
  
  Footer {
    display: flex
    justify-content: space-between
    align-items: center
    padding: 4px 24px (py-1 px-6)
    border-top: 1px #f3f4f6 (border-gray-100)
    
    Button {
      padding: 4px 12px (px-3 py-1)
      font-size: 12px (text-xs)
    }
    
    Favorite Button {
      transition: all 200ms
      hover: scale(1.1)
      padding: 8px
      
      Active {
        color: var(--accent)
        fill: var(--accent)
      }
      
      Inactive {
        color: #d1d5db (gray-400)
        hover-color: var(--accent)
      }
    }
  }
}
```

### Responsive Behavior
```
xs (< 640px)
- Card width: 100% of container
- Margin: responsive
- Images: 16:9 aspect ratio maintained

sm (≥ 640px)
- Card width: calc(50% - 12px) in grid
- Same proportions

md+ (≥ 768px)
- Card width: calc(33.333% - 16px) in grid
- Same proportions
```

---

## 🎛️ NavBar - Component Breakdown

### HTML Structure
```jsx
<nav className="w-full bg-background z-50" aria-label="Main navigation">
  <ul className="flex items-center justify-center gap-3 px-4 py-3">
    
    {/* Home Button */}
    <li>
      <button className="flex items-center gap-2 text-sm font-medium text-neutral-900 hover:text-primary">
        <span className="material-symbols-sharp text-2xl text-primary">home</span>
      </button>
    </li>
    
    {/* Nosotros Dropdown */}
    <li className="relative" onBlur={handleBlur}>
      <button className="flex items-center gap-1 cursor-pointer py-2 px-1" onClick={toggleMenu}>
        <span className="text-sm font-medium text-neutral-900">Nosotros</span>
        <span className="material-symbols-outlined text-base text-primary">arrow_drop_down</span>
      </button>
      
      {/* Dropdown Menu */}
      {openMenu === 'nosotros' && (
        <ul className="absolute left-0 top-full mt-1 w-56 bg-white border border-neutral-200 rounded shadow-lg z-20">
          <li><button>Quiénes somos</button></li>
          <li><button>Nuestro Equipo</button></li>
          <li><button>Testimonios</button></li>
        </ul>
      )}
    </li>
    
    {/* Propiedades Dropdown */}
    <li className="relative" onBlur={handleBlur}>
      <button className="flex items-center gap-1 cursor-pointer py-2 px-1" onClick={toggleMenu}>
        <span className="text-sm font-medium text-neutral-900">Propiedades</span>
        <span className="material-symbols-outlined text-base text-primary">arrow_drop_down</span>
      </button>
      
      {/* Dropdown Menu */}
      {openMenu === 'propiedades' && (
        <ul className="absolute left-0 top-full mt-1 w-56 bg-white border border-neutral-200 rounded shadow-lg z-20">
          <li><button>En Arriendo</button></li>
          <li><button>En Venta</button></li>
          <li><button>Servicio de Administración</button></li>
        </ul>
      )}
    </li>
    
    {/* Direct Links */}
    <li>
      <button className="text-sm font-medium text-neutral-900 hover:text-primary">
        Publica tu propiedad
      </button>
    </li>
    
    <li className="hidden sm:block">
      <button className="text-sm font-medium text-neutral-900 hover:text-primary">
        Blog
      </button>
    </li>
  </ul>
</nav>
```

### Styling Details
```
NavBar {
  width: 100%
  background: var(--background)
  z-index: 50
  
  Container (ul) {
    display: flex
    align-items: center
    justify-content: center
    gap: 12px (gap-3)
    padding: 12px 16px (px-4 py-3)
  }
  
  NavItem {
    display: flex
    align-items: center
    gap: 4px (gap-1)
    cursor: pointer
    padding: 8px 4px (py-2 px-1)
    position: relative
    
    Text {
      font-size: 14px (text-sm)
      font-weight: 500 (font-medium)
      color: #1f2937 (neutral-900)
      
      hover {
        color: var(--primary)
      }
    }
    
    Icon {
      font-size: 16px (text-base)
      color: var(--primary)
    }
  }
  
  Dropdown Menu {
    position: absolute
    left: 0
    top: 100% (top-full)
    margin-top: 4px (mt-1)
    width: 224px (w-56)
    background: white
    border: 1px neutral-200
    border-radius: 4px
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1)
    z-index: 20
    
    MenuItem {
      display: block
      width: 100%
      text-align: left
      padding: 8px 16px (px-4 py-2)
      font-size: 14px (text-sm)
      color: #1f2937 (neutral-900)
      background: white
      
      hover {
        background: rgba(var(--primary-rgb), 0.1)
        transition: background-color 200ms
      }
    }
  }
}
```

---

## 🎨 PortalTopBar - Full Structure

### Layout Architecture
```
┌──────────────────────────────────────────────────────────────┐
│ PortalTopBar (sticky top-0 z-30)                            │
├──────────────────────────────────────────────────────────────┤
│ │ Logo  │  UF Display   │     Menu Items  │  User / Auth  │  │
│ │       │               │                 │               │  │
│ │  +    │  UF 37.000    │  [☰] (xs/sm)    │  [🔐] [👤]   │  │
│ └──────────────────────────────────────────────────────────────┘

When logged in:
┌──────────────────────────────────────────────────────────────┐
│ │ Logo  │  UF Display   │  Hamburger  │  User Name  │  [⋮]  │  │
│ │       │               │   [☰]       │  "Juan G."  │       │  │
│ └──────────────────────────────────────────────────────────────┘
      ↓
      Sidebar Opens (z-40)
      ├── Overlay (z-35)
      └── Panel (z-40)
           ├── Logo
           ├── User Name
           ├── Navigation
           └── Logout button
```

### TopBar HTML Structure
```jsx
<header className="flex items-center justify-between h-16 w-full bg-background sm:px-8 md:px-24 box-border sticky top-0 left-0 z-30">
  
  {/* Left Section - Logo */}
  <div className="flex items-center">
    <Logo src={logoSrc} className="w-48 h-20" />
  </div>
  
  {/* Middle Section - UF Display */}
  <div className="hidden md:flex items-center gap-2">
    <span className="text-sm font-medium">UF: ${formatCLP(uf)}</span>
  </div>
  
  {/* Right Section */}
  <div className="flex items-center mr-2 gap-2">
    {/* Menu Button */}
    <IconButton 
      icon="menu"
      className={`ml-4 ${session?.user ? 'md:flex' : 'sm:hidden'}`}
      onClick={() => setSidebarOpen(true)}
    />
    
    {/* Auth Buttons or User Info */}
    {session?.user ? (
      <>
        <span className="hidden md:inline text-sm">{session.user.name}</span>
        <IconButton icon="person" />
        <IconButton icon="more_vert" onClick={() => setSidebarOpen(true)} />
      </>
    ) : (
      <>
        <Button variant="text" onClick={handleLogin}>Iniciar Sesión</Button>
        <Button variant="primary" onClick={handleRegister}>Registrarse</Button>
      </>
    )}
  </div>
</header>
```

### Sidebar Structure (When Open)
```jsx
<>
  {/* Overlay */}
  <div
    className="fixed inset-0 bg-transparent z-35 transition-opacity duration-300"
    onClick={onClose}
  />
  
  {/* Sidebar Panel */}
  <div className="fixed left-0 top-0 h-full w-64 bg-white/60 backdrop-blur backdrop-saturate-150 z-40 shadow-xl transform transition-transform duration-300 ease-in-out border border-white/20">
    
    {/* Header */}
    <div className="flex flex-col items-center justify-center p-4 text-center gap-2">
      {identity?.urlLogo && <img src={identity.urlLogo} alt="Logo" />}
      {session?.user && <span className="font-medium">{session.user.name}</span>}
    </div>
    
    {/* Navigation */}
    {/* Same as NavBar */}
    
    {/* Logout Button (if logged in) */}
    {session?.user && (
      <Button variant="outlined" onClick={handleLogout}>
        Cerrar Sesión
      </Button>
    )}
  </div>
</>
```

---

## 📋 Dialog (Login/Register)

### Dialog Container
```jsx
<Dialog
  open={loginDialogOpen}
  onClose={() => setLoginDialogOpen(false)}
  title="Iniciar Sesión"
  size="xs"
>
  <LoginForm
    logoSrc={identity?.urlLogo}
    companyName={identity?.name}
    onClose={() => setLoginDialogOpen(false)}
    onRegisterClick={() => {
      setLoginDialogOpen(false);
      setRegisterDialogOpen(true);
    }}
  />
</Dialog>
```

### LoginForm Content
```jsx
<div className="flex flex-col gap-4">
  {/* Logo & Company Name */}
  {logoSrc && (
    <div>
      <div className="flex justify-center mb-4">
        <Logo src={logoSrc} className="w-48 h-20" />
      </div>
      <div className="text-center text-sm text-foreground text-xl">
        {companyName || "nuestro portal"}
      </div>
    </div>
  )}
  
  {/* Form */}
  <form onSubmit={handleSubmit}>
    <TextField
      label="Correo electrónico"
      type="email"
      placeholder="nombre@correo.com"
      required
    />
    
    <TextField
      label="Contraseña"
      type="password"
      placeholder="••••••••"
      required
    />
    
    {error && <p className="text-sm text-red-600">{error}</p>}
    
    <Button
      variant="primary"
      type="submit"
      disabled={isSubmitting}
      className="w-full mt-4"
    >
      {isSubmitting ? "Ingresando..." : "Ingresar"}
    </Button>
    
    {/* Register Link */}
    <div className="text-center text-sm text-muted-foreground">
      <span>¿No tienes cuenta? </span>
      <Button
        variant="text"
        className="text-primary p-0 h-auto"
        onClick={() => onRegisterClick?.()}
      >
        Registrarse aquí
      </Button>
    </div>
  </form>
</div>
```

### RegisterForm Content
```jsx
<form onSubmit={handleSubmit} className="flex flex-col gap-4">
  <TextField label="Nombre" placeholder="Nombre" required />
  <TextField label="Apellido" placeholder="Apellido" required />
  <TextField label="Correo electrónico" type="email" placeholder="nombre@correo.com" required />
  <TextField label="Contraseña" type="password" placeholder="••••••••" required />
  <TextField label="Confirmar contraseña" type="password" placeholder="••••••••" required />
  
  <Button variant="primary" type="submit" disabled={isSubmitting} className="w-full mt-4">
    {isSubmitting ? "Registrando..." : "Registrarse"}
  </Button>
  
  <div className="text-center text-sm">
    <span>¿Ya tienes cuenta? </span>
    <Button variant="text" className="text-primary p-0 h-auto">
      Inicia sesión aquí
    </Button>
  </div>
</form>
```

---

## 📊 ListProperties Grid Layout

### Grid Container
```jsx
<div className="w-full">
  {/* Cards Grid */}
  <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-200 ${isLoading ? 'opacity-70' : 'opacity-100'}`}>
    {properties.map((property) => <PropertyCard key={property.id} property={mappedProperty} />)}
  </div>
  
  {/* Pagination Controls */}
  {pagination && <PaginationControls pagination={pagination} onPageChange={onPageChange} />}
</div>
```

### Grid Responsive
```
xs (< 640px)
├── grid-cols-1 (1 columna)
└── gap-6 (24px)

sm (≥ 640px)
├── grid-cols-2 (2 columnas)
└── gap-6

lg (≥ 1024px)
├── grid-cols-3 (3 columnas)
└── gap-6

max-width: 80rem (1280px)
```

### PaginationControls
```jsx
<div className="flex items-center justify-center space-x-2 mt-8">
  {/* Previous Button */}
  {hasPrevPage && (
    <Button variant="outlined" onClick={() => handlePageChange(page - 1)}>
      ← Anterior
    </Button>
  )}
  
  {/* Page Numbers */}
  {getPageNumbers().map((pageNum) => (
    <button
      key={pageNum}
      onClick={() => handlePageChange(pageNum)}
      className={pageNum === page ? 'bg-primary text-background font-medium' : 'text-foreground hover:bg-accent'}
    >
      {pageNum}
    </button>
  ))}
  
  {/* Next Button */}
  {hasNextPage && (
    <Button variant="outlined" onClick={() => handlePageChange(page + 1)}>
      Siguiente →
    </Button>
  )}
</div>
```

---

**Documento completado: 26 de Noviembre, 2025**
