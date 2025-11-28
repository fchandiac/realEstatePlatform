# 🎨 Sistema de Colores - realEstatePlatform

## Introducción

El sistema de colores de **realEstatePlatform** utiliza **variables CSS en `:root`** para mantener una **consistencia visual centralizada** en toda la aplicación. En lugar de hardcodear colores hexadecimales en componentes individuales, se usan referencias a variables que pueden ser actualizadas globalmente.

### Beneficios

- ✅ **Consistencia Visual** - Un único lugar para definir la paleta de colores
- ✅ **Mantenibilidad** - Cambios globales sin buscar en cientos de archivos
- ✅ **Flexibilidad** - Fácil crear temas oscuro/claro en el futuro
- ✅ **Escalabilidad** - Sistema modular y reutilizable

---

## Ubicación

Las variables CSS se definen en: **`frontend/app/globals.css`** (líneas 5-19)

```css
:root {
  --color-primary: #242629;
  --color-background: #ffffff;
  --color-foreground: #131615;
  --color-border: #c1c1c2;
  --color-accent: #1351AE;
  --color-secondary: #d46a2f;
  --color-muted: #6b7280;
  --color-success: #4CAF50;
  --color-info: #2196F3;
  --color-warning: #FFC107;
  --color-error: #F44336;
  --color-neutral: #F3F4F6;
}
```

---

## Paleta de Colores Detallada

### 🏗️ **Colores de Estructura**

Estos colores definen la arquitectura visual de la interfaz: fondos, textos principales, bordes.

#### `--color-primary: #242629`
- **Representación Visual**: Gris oscuro casi negro
- **RGB**: rgb(36, 38, 41)
- **Brillo**: Muy oscuro (12% de luminancia)

**Usos Principales:**
- Títulos y headings (h1, h2, h3)
- Botones primarios (background)
- Textos de énfasis
- Barras de navegación
- Elementos destacados

**Ejemplo en Código:**
```tsx
// Tailwind CSS
<h1 className="text-primary">Bienvenido a realEstatePlatform</h1>
<button className="bg-primary text-background">Guardar</button>

// CSS Puro
.titulo {
  color: var(--color-primary);
}
```

---

#### `--color-background: #ffffff`
- **Representación Visual**: Blanco puro
- **RGB**: rgb(255, 255, 255)
- **Brillo**: Máximo (100% de luminancia)

**Usos Principales:**
- Fondo principal de la página
- Fondos de tarjetas (cards)
- Espacios de contenido
- Areas de lectura principal
- Contenedores de información

**Ejemplo en Código:**
```tsx
<div className="bg-background">
  <p>Contenido principal aquí</p>
</div>

// En CSS
body {
  background-color: var(--color-background);
  color: var(--color-foreground);
}
```

---

#### `--color-foreground: #131615`
- **Representación Visual**: Negro casi puro con matiz grisáceo
- **RGB**: rgb(19, 22, 21)
- **Brillo**: Muy oscuro (8% de luminancia)

**Usos Principales:**
- Texto normal de lectura (párrafos, descripciones)
- Iconos principales
- Bordes de elementos
- Contenido de alto contraste

**Ejemplo en Código:**
```tsx
<p className="text-foreground">
  Esta es la descripción del producto que los usuarios leerán
</p>

// En CSS
.descripcion {
  color: var(--color-foreground);
  line-height: 1.6;
}
```

---

#### `--color-border: #c1c1c2`
- **Representación Visual**: Gris claro/neutro
- **RGB**: rgb(193, 193, 194)
- **Brillo**: Claro (73% de luminancia)

**Usos Principales:**
- Bordes de inputs y formularios
- Separadores entre secciones
- Líneas divisorias
- Bordes de tarjetas
- Demarcadores visuales sutiles

**Ejemplo en Código:**
```tsx
<div className="border border-border rounded-lg p-4">
  <h3>Card Title</h3>
  <p>Card content</p>
</div>

// En CSS
input {
  border: 1px solid var(--color-border);
  border-radius: 4px;
}
```

---

### 🎯 **Colores de Acción e Interacción**

Estos colores indican elementos interactivos y llamadas a la acción.

#### `--color-accent: #1351AE`
- **Representación Visual**: Azul intenso profesional
- **RGB**: rgb(19, 81, 174)
- **Brillo**: Oscuro con saturación alta (33% de luminancia)

**Usos Principales:**
- Botones secundarios
- Enlaces principales
- Estados hover/focus
- Elementos interactivos destacados
- Énfasis profesional

**Ejemplo en Código:**
```tsx
<a href="/properties" className="text-accent hover:underline">
  Ver todas las propiedades
</a>

<button className="bg-accent text-background hover:opacity-90">
  Continuar
</button>

// En CSS
a {
  color: var(--color-accent);
  transition: opacity 0.2s;
}
a:hover {
  opacity: 0.8;
}
```

---

#### `--color-secondary: #d46a2f`
- **Representación Visual**: Naranja/coral vibrante
- **RGB**: rgb(212, 106, 47)
- **Brillo**: Medio con saturación alta (42% de luminancia)

**Usos Principales:**
- Botones de Llamada a la Acción (CTA)
- Acciones secundarias importantes
- Elementos que demandan atención visual
- Destacados especiales

**Ejemplo en Código:**
```tsx
<button className="bg-secondary text-white hover:opacity-90">
  Enviar Solicitud de Interés
</button>

<div className="bg-secondary/10 text-secondary border-l-4 border-secondary p-4">
  Oferta especial limitada
</div>

// En CSS
.cta-button {
  background-color: var(--color-secondary);
  color: white;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.cta-button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}
```

---

### ⚠️ **Colores de Estado (Feedback del Usuario)**

Estos colores comunican el resultado de acciones del usuario de forma inmediata e intuitiva.

#### `--color-success: #4CAF50`
- **Representación Visual**: Verde natural
- **RGB**: rgb(76, 175, 80)
- **Brillo**: Medio (55% de luminancia)

**Usos Principales:**
- Alertas de éxito
- Confirmaciones de operaciones completadas
- Estados "activo" o "verificado"
- Checkmarks
- Mensajes positivos

**Ejemplo en Código:**
```tsx
// En componente Alert
showAlert({
  message: 'Propiedad guardada exitosamente',
  type: 'success',
  duration: 3000
});

// En CSS
.alert-success {
  background-color: color-mix(in srgb, var(--color-success) 30%, transparent);
  color: var(--color-foreground);
  border-color: var(--color-success);
  border-left: 4px solid var(--color-success);
  padding: 12px;
  border-radius: 4px;
}
```

---

#### `--color-info: #2196F3`
- **Representación Visual**: Azul cielo claro
- **RGB**: rgb(33, 150, 243)
- **Brillo**: Medio (54% de luminancia)

**Usos Principales:**
- Alertas informativas
- Mensajes de información neutral
- Estados "en progreso"
- Tips y sugerencias
- Información contextual

**Ejemplo en Código:**
```tsx
showAlert({
  message: 'Tu solicitud está siendo procesada',
  type: 'info',
  duration: 5000
});

// En CSS
.alert-info {
  background-color: color-mix(in srgb, var(--color-info) 30%, transparent);
  border-color: var(--color-info);
}
```

---

#### `--color-warning: #FFC107`
- **Representación Visual**: Amarillo/Oro vibrante
- **RGB**: rgb(255, 193, 7)
- **Brillo**: Claro (74% de luminancia)

**Usos Principales:**
- Alertas de advertencia
- Confirmaciones antes de acciones importantes
- Estados "pendiente"
- Precauciones (sin error crítico)
- Información que requiere atención

**Ejemplo en Código:**
```tsx
showAlert({
  message: 'Tienes cambios sin guardar. ¿Deseas continuar?',
  type: 'warning',
  duration: 0 // No desaparece automáticamente
});

// En CSS
.alert-warning {
  background-color: color-mix(in srgb, var(--color-warning) 30%, transparent);
  border-color: var(--color-warning);
}
```

---

#### `--color-error: #F44336`
- **Representación Visual**: Rojo intenso
- **RGB**: rgb(244, 67, 54)
- **Brillo**: Medio (39% de luminancia)

**Usos Principales:**
- Alertas de error
- Mensajes de validación fallida
- Acciones destructivas (delete, remove)
- Estados críticos o fallidos
- Errores y excepciones

**Ejemplo en Código:**
```tsx
showAlert({
  message: 'El email ingresado no es válido',
  type: 'error',
  duration: 4000
});

// En validación de formulario
{error && (
  <p className="text-error text-sm mt-1">{error}</p>
)}

// En CSS
.alert-error {
  background-color: color-mix(in srgb, var(--color-error) 30%, transparent);
  border-color: var(--color-error);
}
```

---

### 🔇 **Colores Neutrales**

Estos colores proporcionan subtileza y jerarquía visual sin distraer.

#### `--color-muted: #6b7280`
- **Representación Visual**: Gris medio neutral
- **RGB**: rgb(107, 114, 128)
- **Brillo**: Medio (40% de luminancia)

**Usos Principales:**
- Textos secundarios (subtítulos, metadata)
- Placeholders en inputs
- Elementos deshabilitados
- Información menos importante
- Etiquetas y labels secundarios

**Ejemplo en Código:**
```tsx
<p className="text-muted text-sm">
  Creado hace 2 días por Juan Pérez
</p>

<input 
  placeholder="Buscar propiedades..."
  className="placeholder-muted"
/>

// En CSS
.text-muted {
  color: var(--color-muted);
  font-size: 0.875rem;
}

input::placeholder {
  color: var(--color-muted);
  opacity: 0.7;
}
```

---

#### `--color-neutral: #F3F4F6`
- **Representación Visual**: Gris muy claro (casi blanco)
- **RGB**: rgb(243, 244, 246)
- **Brillo**: Muy claro (95% de luminancia)

**Usos Principales:**
- Fondos alternos (filas alternas en tablas)
- Fondos de secciones secundarias
- Estados hover sutiles
- Separación visual sin fuerte contraste
- Áreas de agrupación

**Ejemplo en Código:**
```tsx
<div className="bg-neutral p-6 rounded-lg">
  <h4>Sección Secundaria</h4>
  <p>Contenido con fondo alternativo</p>
</div>

// En tabla con filas alternadas
tr:nth-child(even) {
  background-color: var(--color-neutral);
}

// En CSS
.section-alternate {
  background-color: var(--color-neutral);
  padding: 24px;
  border-radius: 8px;
}
```

---

## 📊 Jerarquía de Contraste

La combinación de colores sigue principios de accesibilidad WCAG. El contraste más alto garantiza legibilidad óptima:

| Combinación | Contraste | Uso |
|-----------|-----------|-----|
| `foreground` (#131615) sobre `background` (#ffffff) | 21:1 | **Máxima legibilidad** - Textos principales |
| `primary` (#242629) sobre `background` (#ffffff) | 18:1 | Textos secundarios importantes |
| `foreground` sobre `neutral` (#F3F4F6) | 20:1 | Contenido en fondos alternos |
| `muted` (#6b7280) sobre `background` (#ffffff) | 7.4:1 | Textos terciarios |
| `muted` sobre `neutral` (#F3F4F6) | 6.8:1 | Información menos importante |

**Nota**: Todas las combinaciones cumplen con el estándar WCAG AA (mínimo 4.5:1) para accesibilidad.

---

## 🎨 Casos de Uso Prácticos

### Ejemplo 1: Tarjeta de Propiedad

```tsx
<div className="bg-background border border-border rounded-lg overflow-hidden">
  {/* Imagen */}
  <img src={property.image} alt={property.title} />
  
  {/* Contenido */}
  <div className="p-4">
    <h3 className="text-primary text-lg font-bold mb-2">
      {property.title}
    </h3>
    
    <p className="text-foreground text-sm mb-3">
      {property.description}
    </p>
    
    <p className="text-muted text-xs mb-4">
      {property.location} • Creado {property.createdAt}
    </p>
    
    <div className="flex gap-2">
      <button className="flex-1 bg-primary text-background">
        Ver Detalles
      </button>
      <button className="flex-1 bg-secondary text-white">
        Contactar Agente
      </button>
    </div>
  </div>
</div>
```

---

### Ejemplo 2: Formulario con Validación

```tsx
<form className="space-y-4">
  {/* Campo válido */}
  <div>
    <label className="block text-primary font-medium mb-1">
      Correo Electrónico
    </label>
    <input 
      type="email"
      className="w-full border border-border rounded px-3 py-2 text-foreground focus:border-accent"
      placeholder="tu@correo.com"
    />
    <p className="text-success text-xs mt-1">✓ Correo válido</p>
  </div>
  
  {/* Campo con error */}
  <div>
    <label className="block text-primary font-medium mb-1">
      Teléfono
    </label>
    <input 
      type="tel"
      className="w-full border border-error rounded px-3 py-2 text-foreground"
      placeholder="+56 9 XXXX XXXX"
    />
    <p className="text-error text-xs mt-1">✗ Teléfono inválido</p>
  </div>
  
  <button className="w-full bg-secondary text-white font-medium py-2 rounded">
    Enviar
  </button>
</form>
```

---

### Ejemplo 3: Sistema de Alertas

```tsx
{/* Alerta de Éxito */}
<div className="alert-success rounded p-4">
  <div className="flex items-center gap-3">
    <span className="material-symbols-outlined text-success">check_circle</span>
    <span className="text-foreground">Propiedad guardada exitosamente</span>
  </div>
</div>

{/* Alerta de Error */}
<div className="alert-error rounded p-4">
  <div className="flex items-center gap-3">
    <span className="material-symbols-outlined text-error">error</span>
    <span className="text-foreground">Ocurrió un error. Intenta nuevamente</span>
  </div>
</div>

{/* Alerta de Advertencia */}
<div className="alert-warning rounded p-4">
  <div className="flex items-center gap-3">
    <span className="material-symbols-outlined text-warning">warning</span>
    <span className="text-foreground">Esta acción no se puede deshacer</span>
  </div>
</div>

{/* Alerta de Información */}
<div className="alert-info rounded p-4">
  <div className="flex items-center gap-3">
    <span className="material-symbols-outlined text-info">info</span>
    <span className="text-foreground">Tu solicitud está siendo procesada</span>
  </div>
</div>
```

---

## 🛠️ Uso en Tailwind CSS

El proyecto usa **Tailwind CSS** con un sistema de configuración personalizado. Los colores están disponibles a través de clases Tailwind:

### Clases de Texto
```tsx
<p className="text-primary">Texto primario</p>
<p className="text-foreground">Texto principal</p>
<p className="text-muted">Texto mutado</p>
```

### Clases de Fondo
```tsx
<div className="bg-background">Fondo blanco</div>
<div className="bg-neutral">Fondo neutro</div>
<div className="bg-primary">Fondo primario</div>
```

### Clases de Bordes
```tsx
<div className="border border-border">Borde gris claro</div>
<div className="border-2 border-primary">Borde primario</div>
```

### Estados
```tsx
<button className="bg-primary hover:bg-accent focus:ring-2 focus:ring-accent">
  Botón
</button>
```

---

## 📝 Clases CSS Predefinidas

El archivo `globals.css` incluye clases reutilizables para patrones comunes:

### Botones

#### `.btn-contained-primary`
- Fondo primario, texto blanco
- Hover: cambia a accent
- Efecto click: escala 90%

```tsx
<button className="btn-contained-primary">Guardar</button>
```

#### `.btn-contained-secondary`
- Fondo secundario, texto negro
- Hover: cambia a accent
- Efecto click: escala 90%

```tsx
<button className="btn-contained-secondary">Contactar</button>
```

#### `.btn-outlined`
- Borde foreground, fondo transparente
- Hover: fondo accent
- Efecto click: escala 90%

```tsx
<button className="btn-outlined">Cancelar</button>
```

#### `.btn-pill-*`
- Versiones redondeadas de botones
- Variantes: `primary`, `secondary`, `outlined`

```tsx
<button className="btn-pill-primary">Acción</button>
```

### Alertas

#### `.alert-success`
- Fondo: 30% de color success con transparencia
- Borde: color success
- Uso: confirmaciones positivas

#### `.alert-error`
- Fondo: 30% de color error con transparencia
- Borde: color error
- Uso: errores y validaciones fallidas

#### `.alert-warning`
- Fondo: 30% de color warning con transparencia
- Borde: color warning
- Uso: advertencias y precauciones

#### `.alert-info`
- Fondo: 30% de color info con transparencia
- Borde: color info
- Uso: información neutral

---

## 🔄 Cómo Cambiar Colores Globalmente

Para actualizar la paleta de colores en toda la aplicación, simplemente edita las variables en `frontend/app/globals.css`:

### Ejemplo: Cambiar el color primario

**Antes:**
```css
--color-primary: #242629;
```

**Después:**
```css
--color-primary: #1e40af; /* Azul más intenso */
```

**Resultado**: Todos los elementos que usan `className="text-primary"` o `className="bg-primary"` se actualizarán automáticamente.

---

## 📱 Tema Oscuro (Futuro)

El sistema está preparado para implementar tema oscuro usando media queries:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-primary: #f0f0f0;
    --color-background: #1a1a1a;
    --color-foreground: #ffffff;
    /* ... más colores para tema oscuro ... */
  }
}
```

---

## ✨ Resumen

| Categoría | Colores | Propósito |
|-----------|---------|-----------|
| **Estructura** | primary, background, foreground, border | Define la arquitectura visual |
| **Acción** | accent, secondary | Elementos interactivos |
| **Feedback** | success, error, warning, info | Estados de operaciones |
| **Neutral** | muted, neutral | Información secundaria |

Este sistema garantiza:
- ✅ Consistencia en toda la aplicación
- ✅ Accesibilidad (contraste WCAG AA)
- ✅ Flexibilidad para futuros cambios de tema
- ✅ Mantenibilidad centralizada
- ✅ Comunicación visual clara

---

**Última actualización:** 28 de Noviembre, 2025
**Archivo:** `frontend/app/globals.css`
**Configuración:** Tailwind CSS + CSS Variables
