# Guía de Implementación de Sistema de Seeding

## Índice
1. [Introducción](#introducción)
2. [Configuración del Proyecto](#configuración-del-proyecto)
3. [Estructura de Directorios](#estructura-de-directorios)
4. [Dependencias Necesarias](#dependencias-necesarias)
5. [Scripts de NPM](#scripts-de-npm)
6. [Arquitectura del Sistema](#arquitectura-del-sistema)
7. [Implementación Paso a Paso](#implementación-paso-a-paso)
8. [Mejores Prácticas](#mejores-prácticas)
9. [Problemas Comunes](#problemas-comunes)

## Introducción

Un sistema de seeding es esencial para poblar una base de datos con datos de prueba realistas y consistentes. Esta guía explica cómo implementar un sistema de seeding robusto para una aplicación Node.js con TypeScript y TypeORM.

## Configuración del Proyecto

### Dependencias Base
```json
{
  "dependencies": {
    "typeorm": "^0.3.x",
    "@faker-js/faker": "^8.x",
    "uuid": "^9.x"
  },
  "devDependencies": {
    "@types/uuid": "^9.x",
    "ts-node": "^10.x",
    "typescript": "^5.x"
  }
}
```

### Scripts NPM Recomendados
```json
{
  "scripts": {
    "seed:reset": "ts-node database/seeders/seed.ts",
    "seed": "ts-node database/seeders/seed.ts --preserve",
    "seed:rollback": "ts-node database/seeders/rollback.ts"
  }
}
```

## Estructura de Directorios

```
database/
├── seeders/
│   ├── seed.ts                 # Script principal de seeding
│   ├── seeder.factory.ts       # Factory para generar datos
│   ├── rollback.ts            # Script para revertir seeds
│   └── interfaces/            # Interfaces para tipado
└── migrations/                # Migraciones de base de datos
```

## Arquitectura del Sistema

### 1. Factory Pattern
El sistema utiliza el patrón Factory para generar datos consistentes:

```typescript
export class SeederFactory {
  static createRandomUser() {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      // ...
    };
  }
  
  // Un método por cada entidad
}
```

### 2. Sistema de Relaciones
```typescript
interface SeederRelations {
  users: Map<string, User>;
  properties: Map<string, Property>;
  // ... otras entidades
}

class SeederContext {
  private relations: SeederRelations;
  
  constructor() {
    this.relations = {
      users: new Map(),
      properties: new Map()
    };
  }
  
  addUser(user: User) {
    this.relations.users.set(user.id, user);
  }
  
  // ... métodos para otras entidades
}
```

## Implementación Paso a Paso

### 1. Configuración Inicial
```bash
npm install typeorm @faker-js/faker uuid
npm install -D @types/uuid typescript ts-node
```

### 2. Crear Estructura de Directorios
```bash
mkdir -p database/seeders/interfaces
touch database/seeders/seed.ts
touch database/seeders/seeder.factory.ts
touch database/seeders/rollback.ts
```

### 3. Implementar Factory Base
```typescript
// seeder.factory.ts
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

export class SeederFactory {
  static createRandomEntity() {
    return {
      id: uuidv4(),
      createdAt: faker.date.past(),
      updatedAt: new Date(),
      // ... propiedades comunes
    };
  }
}
```

### 4. Implementar Script Principal
```typescript
// seed.ts
import { DataSource } from 'typeorm';
import { SeederFactory } from './seeder.factory';

async function seedDatabase() {
  try {
    // 1. Inicializar conexión
    await AppDataSource.initialize();
    
    // 2. Limpiar datos existentes si es necesario
    if (!process.argv.includes('--preserve')) {
      await clearDatabase();
    }
    
    // 3. Crear datos en orden específico
    console.log('Seeding users...');
    const users = await seedUsers();
    
    console.log('Seeding properties...');
    const properties = await seedProperties(users);
    
    // ... más entidades
    
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  }
}
```

## Mejores Prácticas

1. **Orden de Inserción**
   - Identifica dependencias entre entidades
   - Crea primero las entidades base
   - Mantén un registro de IDs generados

2. **Manejo de Relaciones**
   - Usa Maps para almacenar referencias
   - Implementa getters/setters para acceso controlado
   - Valida existencia de relaciones antes de crear

3. **Datos Realistas**
   - Utiliza Faker.js para datos verosímiles
   - Personaliza los generadores según el dominio
   - Mantén consistencia en fechas y relaciones

4. **Control de Errores**
   - Implementa rollback en caso de error
   - Valida datos antes de insertar
   - Registra errores detalladamente

5. **Optimización**
   - Usa inserción por lotes (bulk insert)
   - Mantén índices deshabilitados durante seeding
   - Utiliza transacciones cuando sea posible

## Problemas Comunes

### 1. Inconsistencia en Relaciones
```typescript
// Solución: Usar un contexto centralizado
class SeederContext {
  private relations = new Map();
  
  async ensureRelationExists(entityType: string, id: string) {
    if (!this.relations.get(entityType).has(id)) {
      throw new Error(`Missing ${entityType} relation: ${id}`);
    }
  }
}
```

### 2. Errores de Concurrencia
```typescript
// Solución: Usar transacciones
async function seedWithTransaction() {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  
  try {
    // ... operaciones de seeding
    await queryRunner.commitTransaction();
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
}
```

### 3. Rendimiento con Grandes Conjuntos
```typescript
// Solución: Inserción por lotes
async function bulkInsert<T>(
  repository: Repository<T>,
  entities: T[],
  batchSize = 1000
) {
  for (let i = 0; i < entities.length; i += batchSize) {
    const batch = entities.slice(i, i + batchSize);
    await repository.save(batch);
  }
}
```

## Recomendaciones Adicionales

1. **Control de Versiones**
   - Versiona tus seeders
   - Documenta cambios importantes
   - Mantén compatibilidad hacia atrás

2. **Entorno de Desarrollo**
   - Usa diferentes conjuntos de datos por ambiente
   - Implementa flags para comportamientos específicos
   - Mantén seeds de desarrollo más pequeños

3. **Mantenimiento**
   - Actualiza regularmente las dependencias
   - Revisa y optimiza el rendimiento
   - Mantén la documentación al día

4. **Testing**
   - Crea seeds específicos para pruebas
   - Valida la integridad de los datos
   - Automatiza pruebas de seeding

## Conclusión

Un sistema de seeding robusto es fundamental para el desarrollo y pruebas efectivas. La implementación debe ser:
- Mantenible
- Escalable
- Consistente
- Eficiente
- Documentada

Siguiendo esta guía, podrás implementar un sistema de seeding que cumpla con estos requisitos y se adapte a las necesidades específicas de tu proyecto.