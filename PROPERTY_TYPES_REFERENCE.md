# Property Types Reference

## Tipos de Propiedad en Base de Datos

Los siguientes tipos de propiedad están definidos en la base de datos y disponibles para seleccionar en los formularios:

### 1. Casa
- **ID**: `ac181e4a-4371-4467-b8f9-cbf4ce60c59e`
- **Descripción**: Vivienda unifamiliar independiente
- **Características disponibles**:
  - ✅ Bedrooms (dormitorios)
  - ✅ Bathrooms (baños)
  - ✅ Built Square Meters (metros cuadrados construidos)
  - ✅ Land Square Meters (metros cuadrados de terreno)
  - ✅ Parking Spaces (estacionamientos)
  - ❌ Floors (pisos)
  - ✅ Construction Year (año de construcción)

### 2. Apartamento
- **ID**: `b22c8575-0317-4ff0-b277-e77011ee7afc`
- **Descripción**: Departamento en condominio
- **Características disponibles**:
  - ✅ Bedrooms (dormitorios)
  - ✅ Bathrooms (baños)
  - ✅ Built Square Meters (metros cuadrados construidos)
  - ❌ Land Square Meters (metros cuadrados de terreno)
  - ✅ Parking Spaces (estacionamientos)
  - ✅ Floors (pisos)
  - ✅ Construction Year (año de construcción)

### 3. Terreno
- **ID**: `3b03a182-99e5-4908-aad2-055f49477949`
- **Descripción**: Lote de terreno para construcción
- **Características disponibles**:
  - ❌ Bedrooms (dormitorios)
  - ❌ Bathrooms (baños)
  - ❌ Built Square Meters (metros cuadrados construidos)
  - ✅ Land Square Meters (metros cuadrados de terreno)
  - ❌ Parking Spaces (estacionamientos)
  - ❌ Floors (pisos)
  - ❌ Construction Year (año de construcción)

### 4. Comercial
- **ID**: `eac1a0f9-7747-4d58-82b5-8ddd7ae456ba`
- **Descripción**: Espacio comercial o retail
- **Características disponibles**:
  - ❌ Bedrooms (dormitorios)
  - ✅ Bathrooms (baños)
  - ✅ Built Square Meters (metros cuadrados construidos)
  - ❌ Land Square Meters (metros cuadrados de terreno)
  - ✅ Parking Spaces (estacionamientos)
  - ✅ Floors (pisos)
  - ✅ Construction Year (año de construcción)

### 5. Oficina
- **ID**: `077e61ff-1c45-4aab-85ea-005eeadcc606`
- **Descripción**: Oficina en centro de negocios
- **Características disponibles**:
  - ❌ Bedrooms (dormitorios)
  - ✅ Bathrooms (baños)
  - ✅ Built Square Meters (metros cuadrados construidos)
  - ❌ Land Square Meters (metros cuadrados de terreno)
  - ✅ Parking Spaces (estacionamientos)
  - ✅ Floors (pisos)
  - ✅ Construction Year (año de construcción)

## Endpoint para Obtener Tipos de Propiedad

**URL**: `GET /property-types`

**Requiere**: Bearer Token (autenticación)

**Respuesta de Ejemplo**:
```json
[
  {
    "id": "ac181e4a-4371-4467-b8f9-cbf4ce60c59e",
    "name": "Casa",
    "description": "Vivienda unifamiliar independiente",
    "hasBedrooms": true,
    "hasBathrooms": true,
    "hasBuiltSquareMeters": true,
    "hasLandSquareMeters": true,
    "hasParkingSpaces": true,
    "hasFloors": false,
    "hasConstructionYear": true,
    "createdAt": "2025-11-19T17:53:56.422Z",
    "updatedAt": "2025-11-19T17:53:56.422Z",
    "deletedAt": null
  }
]
```

## Cómo se Muestran en el Componente

En el componente `BasicInfoSection`, los tipos de propiedad se cargan mediante:

```typescript
const propertyTypeOptions = propertyTypes.map((type) => ({
  id: type.id,
  label: type.name,
}))
```

Esto crea opciones con:
- **id**: UUID del tipo de propiedad
- **label**: Nombre del tipo (Casa, Apartamento, Terreno, Comercial, Oficina)

## Actualizar Tipo de Propiedad

Cuando cambias el tipo de propiedad en el formulario:
1. Se actualiza `formData.propertyTypeId` con el ID del tipo seleccionado
2. Al hacer clic en "Actualizar", se envía el `propertyTypeId` al backend
3. El backend actualiza la columna `propertyTypeId` en la tabla `properties`
4. La relación `propertyType` se recarga automáticamente para mostrar los detalles actualizados

## Troubleshooting

Si los tipos de propiedad no se muestran correctamente:

1. **Verificar que el token de autenticación es válido** - La llamada a `/property-types` requiere autenticación
2. **Verificar en la consola del navegador** - Los tipos cargados se loguean con `console.log('🏠 [BasicInfoSection] Property types loaded:', ...)`
3. **Verificar en los logs del backend** - Si hay errores en la carga de tipos
4. **Verificar que la base de datos tiene datos** - Ejecutar seed si es necesario

## Ver Cambios en Browser Console

Para ver los tipos de propiedad que se están cargando:
```javascript
// En la consola del navegador mientras cargas el componente
// Deberías ver algo como:
// 🏠 [BasicInfoSection] Property types loaded: [
//   { id: "ac181e4a-4371-4467-b8f9-cbf4ce60c59e", name: "Casa" },
//   { id: "b22c8575-0317-4ff0-b277-e77011ee7afc", name: "Apartamento" },
//   ...
// ]
```
