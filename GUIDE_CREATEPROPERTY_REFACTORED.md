# Guía de Uso: CreateProperty Refactorizado

## 🎯 Propósito

Este documento explica cómo usar y mantener la arquitectura refactorizada del componente `CreateProperty`.

---

## 📖 Cómo Usar

### Importar y Usar el Componente

```typescript
import CreatePropertyRefactored from '@/app/backOffice/properties/ui/createProperty/CreatePropertyRefactored';

export default function PropertiesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsDialogOpen(true)}>
        Crear Propiedad
      </button>

      <CreatePropertyRefactored
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        size="800px"
      />
    </div>
  );
}
```

---

## 🔧 Usar el Hook en Otros Componentes

Si necesitas la lógica de formulario en otro lugar, puedes usar el hook directamente:

```typescript
'use client';

import { useCreatePropertyForm } from '@/app/backOffice/properties/hooks/useCreatePropertyForm';

export default function MyCustomPropertyForm() {
  const {
    formData,
    handleChange,
    handleSubmit,
    selectedPropertyType,
    isSubmitting,
    submitError,
  } = useCreatePropertyForm({ onClose: () => console.log('Closed') });

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <input
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
      />
      {/* ... más fields ... */}
      <button type="submit" disabled={isSubmitting}>
        Submit
      </button>
    </form>
  );
}
```

---

## 🎨 Reutilizar Componentes Individuales

Cada sección puede usarse independientemente:

```typescript
'use client';

import { BasicInfoSection } from '@/app/backOffice/properties/ui/createProperty/components';
import { useCreatePropertyForm } from '@/app/backOffice/properties/hooks/useCreatePropertyForm';

export default function StepOne() {
  const {
    formData,
    handleChange,
    propertyTypes,
    loadingTypes,
    formatPriceForDisplay,
    cleanPriceValue,
  } = useCreatePropertyForm();

  return (
    <div>
      <h2>Paso 1: Información Básica</h2>
      <BasicInfoSection
        formData={formData}
        handleChange={handleChange}
        propertyTypes={propertyTypes}
        loadingTypes={loadingTypes}
        formatPriceForDisplay={formatPriceForDisplay}
        cleanPriceValue={cleanPriceValue}
      />
    </div>
  );
}
```

---

## 🔄 Agregar una Nueva Sección

Si necesitas agregar una nueva sección (ej: Amenities):

### 1. Crear el Componente
**Archivo:** `/frontend/app/backOffice/properties/ui/createProperty/components/AmenitiesSection.tsx`

```typescript
'use client';

import { CreatePropertyFormData } from '../types';
import Switch from '@/components/Switch/Switch';

interface AmenitiesSectionProps {
  formData: CreatePropertyFormData;
  handleChange: (field: string, value: any) => void;
}

export default function AmenitiesSection({
  formData,
  handleChange,
}: AmenitiesSectionProps) {
  return (
    <div className="space-y-4 border-b pb-4 mb-4">
      <h2 className="text-lg font-semibold">Amenidades</h2>
      
      <Switch
        label="Piscina"
        checked={formData.hasPool || false}
        onChange={(checked) => handleChange('hasPool', checked)}
      />
      
      <Switch
        label="Gimnasio"
        checked={formData.hasGym || false}
        onChange={(checked) => handleChange('hasGym', checked)}
      />
    </div>
  );
}
```

### 2. Actualizar types.ts
```typescript
export interface CreatePropertyFormData {
  // ... campos existentes ...
  hasPool?: boolean;
  hasGym?: boolean;
}
```

### 3. Exportar en index.ts
```typescript
export { default as AmenitiesSection } from './AmenitiesSection';
```

### 4. Usar en CreatePropertyRefactored
```typescript
import { AmenitiesSection } from './components';

// En el JSX:
<AmenitiesSection
  formData={formData}
  handleChange={handleChange}
/>
```

---

## 🧪 Testing

### Test del Hook

```typescript
import { renderHook, act } from '@testing-library/react';
import { useCreatePropertyForm } from '@/app/backOffice/properties/hooks/useCreatePropertyForm';

describe('useCreatePropertyForm', () => {
  it('should update form data', () => {
    const { result } = renderHook(() => useCreatePropertyForm());

    act(() => {
      result.current.handleChange('title', 'Mi Propiedad');
    });

    expect(result.current.formData.title).toBe('Mi Propiedad');
  });

  it('should format price correctly for CLP', () => {
    const { result } = renderHook(() => useCreatePropertyForm());

    const formatted = result.current.formatPriceForDisplay(1000000);
    expect(formatted).toBe('1.000.000');
  });
});
```

### Test de un Componente

```typescript
import { render, screen } from '@testing-library/react';
import BasicInfoSection from '@/app/backOffice/properties/ui/createProperty/components/BasicInfoSection';

describe('BasicInfoSection', () => {
  it('should render title field', () => {
    const mockFormData = {
      title: 'Test',
      // ... otros campos ...
    };

    render(
      <BasicInfoSection
        formData={mockFormData}
        handleChange={jest.fn()}
        propertyTypes={[]}
        loadingTypes={false}
        formatPriceForDisplay={(p) => p.toString()}
        cleanPriceValue={(p) => parseFloat(p)}
      />
    );

    expect(screen.getByDisplayValue('Test')).toBeInTheDocument();
  });
});
```

---

## ⚠️ Errores Comunes

### Error: "Cannot find module '../hooks/useCreatePropertyForm'"
**Causa:** Path incorrecto en el import
**Solución:** Usar ruta relativa correcta
```typescript
// ❌ INCORRECTO
import { useCreatePropertyForm } from '../hooks/useCreatePropertyForm';

// ✅ CORRECTO (desde CreatePropertyRefactored)
import { useCreatePropertyForm } from '../../hooks/useCreatePropertyForm';
```

### Error: "Property 'xxx' does not exist on type 'PropertyTypeOption'"
**Causa:** PropertyTypeOption falta propiedades
**Solución:** Verificar que `types.ts` tenga la propiedad

### Error: "Cannot update component while rendering another component"
**Causa:** Actualizar estado dentro de otro useEffect sin dependencias correctas
**Solución:** Agregar dependencias al useEffect: `useEffect(() => { ... }, [dependencies])`

---

## 🚀 Performance Tips

1. **Memoización:** Si el componente actualiza frecuentemente, usar `React.memo`
   ```typescript
   export default React.memo(BasicInfoSection);
   ```

2. **Callbacks memoizados:** Usar `useCallback` en handleChange si es necesario
   ```typescript
   const handleChange = useCallback((field, value) => {
     setFormData(prev => ({ ...prev, [field]: value }));
   }, []);
   ```

3. **Split del Hook:** Si el hook se hace muy grande, dividir en múltiples hooks
   ```typescript
   const formState = useFormState();
   const dataLoading = useDataLoading();
   const submission = useFormSubmission();
   ```

---

## 📝 Changelog

### v1.0 (2024)
- ✅ Refactorización inicial completada
- ✅ 7 componentes reutilizables creados
- ✅ Hook centralizado implementado
- ✅ Tipos compartidos definidos
- ✅ Documentación completa

---

## 🤝 Contribución

Cuando agregues nuevas features:

1. Mantener la responsabilidad única de cada componente
2. Actualizar tipos en `types.ts`
3. Agregar documentación en el componente (JSDoc)
4. Escribir tests
5. Actualizar este documento

---

## 📞 Support

Si encuentras problemas:
1. Verificar tipos en TypeScript
2. Revisar props pasadas al componente
3. Verificar imports/paths
4. Consultar REFACTORING_CREATEPROPERTY.md para arquitectura general
