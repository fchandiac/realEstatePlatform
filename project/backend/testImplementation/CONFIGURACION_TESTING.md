# ⚙️ CONFIGURACIÓN DE TESTING - IMPLEMENTACIÓN DETALLADA

## 📋 VISIÓN GENERAL

Este documento detalla la configuración completa del sistema de testing del backend, incluyendo Jest, base de datos de testing, y estrategias de ejecución optimizadas.

## 🏗️ ARQUITECTURA DE CONFIGURACIÓN

### 1. COMPONENTES PRINCIPALES

La configuración de testing incluye:

- ✅ **Jest Configuration**: Configuración principal del test runner
- ✅ **Database Testing**: Configuración de base de datos para tests
- ✅ **Test Environments**: Entornos separados para diferentes tipos de tests
- ✅ **Coverage Configuration**: Configuración de reporte de cobertura
- ✅ **CI/CD Integration**: Integración con pipelines de CI/CD

### 2. ESTRUCTURA DE ARCHIVOS

```
backend/
├── jest.config.js                    # Configuración principal de Jest
├── jest-e2e.json                     # Configuración para E2E tests
├── test/
│   ├── jest-global-setup.ts          # Setup global para todos los tests
│   ├── jest-setup.ts                 # Setup por test file
│   ├── utils/
│   │   ├── test-helpers.ts           # Helpers globales para tests
│   │   └── test-db.ts                # Utilidades de base de datos para tests
│   ├── fixtures/                     # Datos de prueba
│   └── mocks/                        # Mocks compartidos
├── package.json                      # Scripts de testing
└── tsconfig.json                     # Configuración TypeScript para tests
```

## 🔧 CONFIGURACIÓN PRINCIPAL DE JEST

### 1. Jest Config Principal

```javascript
// jest.config.js
module.exports = {
  // Entorno de ejecución
  preset: 'ts-jest',
  testEnvironment: 'node',

  // Patrones de archivos de test
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/?(*.)+(spec|test).ts',
    '!**/integration/**/*.spec.ts', // Excluido de config principal
  ],

  // Transformación de archivos
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },

  // Configuración de TypeScript
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },

  // Archivos de setup
  setupFilesAfterEnv: ['<rootDir>/test/jest-setup.ts'],
  globalSetup: '<rootDir>/test/jest-global-setup.ts',

  // Cobertura
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.test.ts',
    '!src/main.ts',
    '!src/**/*.module.ts',
    '!src/**/*.dto.ts',
    '!src/**/*.entity.ts',
    '!src/**/*.config.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],

  // Umbrales de cobertura
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },

  // Mocks
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // Optimizaciones de performance
  maxWorkers: '50%',
  cache: true,
  detectOpenHandles: true,
  forceExit: true,

  // Timeouts
  testTimeout: 10000,

  // Reportes
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'test-results',
        outputName: 'jest-junit.xml',
        suiteName: 'Backend Tests',
      },
    ],
  ],

  // Limpieza
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};
```

### 2. Configuración para Tests E2E

```javascript
// jest-e2e.json
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  // Solo archivos E2E
  testMatch: [
    '**/test/**/*.e2e-spec.ts',
  ],

  // Setup específico para E2E
  setupFilesAfterEnv: ['<rootDir>/test/jest-e2e-setup.ts'],
  globalSetup: '<rootDir>/test/jest-e2e-global-setup.ts',

  // Base de datos dedicada para E2E
  globalTeardown: '<rootDir>/test/jest-e2e-global-teardown.ts',

  // Timeouts más largos para E2E
  testTimeout: 30000,

  // Cobertura separada
  coverageDirectory: 'coverage-e2e',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.test.ts',
    '!src/main.ts',
  ],

  // Reportes específicos
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'test-results-e2e',
        outputName: 'jest-e2e-junit.xml',
        suiteName: 'Backend E2E Tests',
      },
    ],
  ],

  // Detectar handles abiertos (servidores)
  detectOpenHandles: true,
  forceExit: true,
};
```

## 🗄️ CONFIGURACIÓN DE BASE DE DATOS PARA TESTING

### 1. Configuración de Base de Datos de Testing

```typescript
// test/utils/test-db.ts
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

// Cargar variables de entorno de testing
config({ path: '.env.test' });

export const testDbConfig: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'test_user',
  password: process.env.DB_PASSWORD || 'test_password',
  database: process.env.DB_DATABASE || 'realestate_test',

  // Configuración específica para testing
  dropSchema: true,           // Eliminar esquema entre tests
  synchronize: true,          // Sincronizar esquema automáticamente
  logging: process.env.NODE_ENV === 'development',

  // Entities
  entities: ['src/**/*.entity{.ts,.js}'],

  // Migrations (deshabilitadas en testing)
  migrations: [],
  migrationsRun: false,
};

// Configuración para SQLite en memoria (para tests unitarios rápidos)
export const sqliteTestDbConfig: DataSourceOptions = {
  type: 'sqlite',
  database: ':memory:',
  dropSchema: true,
  synchronize: true,
  logging: false,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: [],
  migrationsRun: false,
};

// Factory para crear conexiones de testing
export const createTestDataSource = async (
  config: DataSourceOptions = testDbConfig
): Promise<DataSource> => {
  const dataSource = new DataSource(config);
  await dataSource.initialize();
  return dataSource;
};

// Utilidad para limpiar base de datos
export const clearDatabase = async (dataSource: DataSource): Promise<void> => {
  const entities = dataSource.entityMetadatas;

  try {
    // Deshabilitar foreign key checks
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0');

    // Limpiar tablas en orden inverso de dependencias
    const tables = [
      'audit_log',
      'notification',
      'contract_people',
      'contract_payment',
      'contract',
      'document',
      'testimonial',
      'multimedia',
      'property',
      'person',
      'user',
    ];

    for (const table of tables) {
      await dataSource.query(`DELETE FROM ${table}`);
      await dataSource.query(`ALTER TABLE ${table} AUTO_INCREMENT = 1`);
    }

    // Re-habilitar foreign key checks
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 1');
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  }
};
```

### 2. Variables de Entorno para Testing

```bash
# .env.test
# Base de datos de testing
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=test_user
DB_PASSWORD=test_password
DB_DATABASE=realestate_test

# JWT para testing
JWT_SECRET=test-jwt-secret-key-for-testing-only
JWT_EXPIRES_IN=1h

# Configuración de testing
NODE_ENV=test
LOG_LEVEL=error

# Email (usar mailtrap o similar para testing)
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=test-user
EMAIL_PASS=test-pass

# Storage (usar local para testing)
STORAGE_TYPE=local
STORAGE_PATH=./test/uploads
```

## 🚀 SETUP GLOBAL Y POR ARCHIVO

### 1. Global Setup

```typescript
// test/jest-global-setup.ts
import { createTestDataSource, testDbConfig } from './utils/test-db';

module.exports = async () => {
  // Crear conexión global a base de datos de testing
  global.testDataSource = await createTestDataSource();

  // Configurar variables globales si es necesario
  process.env.NODE_ENV = 'test';

  console.log('✅ Global test setup completed');
};
```

### 2. Setup por Archivo

```typescript
// test/jest-setup.ts
import 'reflect-metadata';
import { TestFixtures } from './fixtures';

// Configurar Jest con helpers globales
beforeAll(async () => {
  // Setup que se ejecuta antes de todos los tests en un archivo
  console.log('📋 Setting up test file...');
});

afterAll(async () => {
  // Cleanup que se ejecuta después de todos los tests en un archivo
  console.log('🧹 Cleaning up test file...');
});

// Helpers globales para tests
global.createTestFixtures = () => new TestFixtures(global.testDataSource);
global.clearTestDatabase = async () => {
  // Implementación de limpieza
};

// Configurar mocks globales si es necesario
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn().mockResolvedValue(true),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock-jwt-token'),
  verify: jest.fn().mockReturnValue({ userId: 'test-user-id' }),
}));
```

### 3. Setup Específico para E2E

```typescript
// test/jest-e2e-setup.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { createTestDataSource, clearDatabase } from './utils/test-db';

declare global {
  var app: INestApplication;
  var testDataSource: any;
  var authToken: string;
}

beforeAll(async () => {
  // Crear aplicación NestJS para E2E
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  global.app = moduleFixture.createNestApplication();
  await global.app.init();

  // Configurar base de datos de testing
  global.testDataSource = await createTestDataSource();

  console.log('🚀 E2E test setup completed');
}, 60000);

afterAll(async () => {
  // Limpiar y cerrar
  await global.app.close();
  await global.testDataSource.destroy();

  console.log('🛑 E2E test cleanup completed');
}, 60000);

beforeEach(async () => {
  // Limpiar base de datos antes de cada test
  await clearDatabase(global.testDataSource);
});
```

## 📊 CONFIGURACIÓN DE COBERTURA

### 1. Configuración Avanzada de Cobertura

```javascript
// jest.config.js - sección de cobertura
coverageThreshold: {
  global: {
    branches: 80,
    functions: 85,
    lines: 85,
    statements: 85,
  },
  // Umbrales específicos por archivo/directorio
  './src/modules/auth/': {
    branches: 90,
    functions: 95,
  },
  './src/services/': {
    branches: 85,
    functions: 90,
  },
},

// Configuración de reporte de cobertura
coverageReporters: [
  'text',           // Reporte en consola
  'lcov',           // Formato LCOV para servicios como Codecov
  'html',           // Reporte HTML interactivo
  'json-summary',   // Resumen JSON para CI/CD
  'cobertura',      // Formato Cobertura para herramientas como SonarQube
],

// Exclusiones de cobertura
coveragePathIgnorePatterns: [
  '/node_modules/',
  '/test/',
  '/dist/',
  '/coverage/',
  '.*\\.config\\.js$',
  '.*\\.config\\.ts$',
],

// Configuración de colección de cobertura
collectCoverageFrom: [
  'src/**/*.{ts,js}',
  '!src/**/*.d.ts',
  '!src/main.ts',
  '!src/**/*.spec.ts',
  '!src/**/*.test.ts',
  '!src/**/*.module.ts',
  '!src/**/*.config.ts',
  '!src/**/*.entity.ts',
  '!src/**/*.dto.ts',
  '!src/**/*.interface.ts',
  '!src/**/*.enum.ts',
],
```

### 2. Scripts de Cobertura

```json
// package.json - scripts de cobertura
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:cov:watch": "jest --coverage --watch",
    "test:unit": "jest --testPathPattern=unit",
    "test:integration": "jest --testPathPattern=integration",
    "test:e2e": "jest --config jest-e2e.json",
    "test:ci": "jest --coverage --watchAll=false --passWithNoTests",
    "coverage:report": "open coverage/lcov-report/index.html",
    "coverage:summary": "cat coverage/coverage-summary.json | jq .total"
  }
}
```

## 🔄 CONFIGURACIÓN DE CI/CD

### 1. GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: realestate_test
          MYSQL_USER: test_user
          MYSQL_PASSWORD: test_password
        ports:
          - 3306:3306
        options: --health-cmd="mysqladmin ping" --health-interval=10s --health-timeout=5s --health-retries=3

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Run unit tests
        run: npm run test:unit -- --coverage --watchAll=false
        env:
          DB_HOST: 127.0.0.1
          DB_PORT: 3306
          DB_USERNAME: test_user
          DB_PASSWORD: test_password
          DB_DATABASE: realestate_test

      - name: Run integration tests
        run: npm run test:integration -- --coverage --watchAll=false
        env:
          DB_HOST: 127.0.0.0.1
          DB_PORT: 3306
          DB_USERNAME: test_user
          DB_PASSWORD: test_password
          DB_DATABASE: realestate_test

      - name: Run E2E tests
        run: npm run test:e2e -- --watchAll=false
        env:
          DB_HOST: 127.0.0.1
          DB_PORT: 3306
          DB_USERNAME: test_user
          DB_PASSWORD: test_password
          DB_DATABASE: realestate_test

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          flags: backend
          name: Backend Coverage
```

### 2. Configuración de SonarQube

```xml
<!-- sonar-project.properties -->
sonar.projectKey=realestate-backend
sonar.projectName=Real Estate Backend
sonar.projectVersion=1.0.0

sonar.sourceEncoding=UTF-8
sonar.sources=src
sonar.tests=test
sonar.test.inclusions=**/*.spec.ts,**/*.test.ts

sonar.typescript.lcov.reportPaths=coverage/lcov.info
sonar.testExecutionReportPaths=test-results/jest-junit.xml

sonar.exclusions=
  **/node_modules/**,
  **/dist/**,
  **/coverage/**,
  **/*.config.js,
  **/*.config.ts

sonar.coverage.exclusions=
  **/*.module.ts,
  **/*.config.ts,
  **/*.entity.ts,
  **/*.dto.ts,
  **/*.interface.ts,
  **/*.enum.ts,
  **/main.ts
```

## 📈 OPTIMIZACIONES DE PERFORMANCE

### 1. Configuración de Workers

```javascript
// jest.config.js - optimizaciones
module.exports = {
  // Número óptimo de workers
  maxWorkers: process.env.CI ? 2 : '50%',

  // Cache inteligente
  cache: true,
  cacheDirectory: '<rootDir>/.jest-cache',

  // Optimizaciones de memoria
  workerIdleMemoryLimit: '512MB',

  // Paralelización inteligente
  maxConcurrency: 5,

  // Optimizaciones de detección de cambios
  watchPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/coverage/',
  ],

  // Timeout adaptativo
  testTimeout: process.env.CI ? 15000 : 10000,
};
```

### 2. Configuración de Base de Datos Optimizada

```typescript
// test/utils/optimized-db.ts
import { DataSourceOptions } from 'typeorm';

export const optimizedTestDbConfig: DataSourceOptions = {
  ...testDbConfig,

  // Optimizaciones para testing
  extra: {
    connectionLimit: 10,
    acquireTimeout: 60000,
    timeout: 60000,
  },

  // Logging condicional
  logging: process.env.DEBUG_TESTS === 'true' ? ['error', 'warn'] : false,

  // Pool de conexiones optimizado
  poolSize: 5,
  maxQueryExecutionTime: 10000,
};
```

## 🔍 CONFIGURACIÓN DE DEBUGGING

### 1. Debugging Interactivo

```javascript
// jest.config.js - debugging
module.exports = {
  // Verbose output
  verbose: true,

  // Colores en output
  colors: true,

  // Mostrar notificaciones del sistema
  notify: true,
  notifyMode: 'failure-change',

  // Debugging detallado
  detectLeaks: true,
  detectOpenHandles: true,
  errorOnDeprecated: true,

  // Setup para debugging
  setupFilesAfterEnv: [
    '<rootDir>/test/jest-setup.ts',
    process.env.DEBUG_TESTS && '<rootDir>/test/debug-setup.ts',
  ].filter(Boolean),
};
```

### 2. Scripts de Debugging

```json
// package.json - scripts de debugging
{
  "scripts": {
    "test:debug": "node --inspect-brk ./node_modules/jest/bin/jest.js --runInBand",
    "test:debug:watch": "node --inspect-brk ./node_modules/jest/bin/jest.js --runInBand --watch",
    "test:verbose": "npm run test -- --verbose",
    "test:debug:specific": "node --inspect-brk ./node_modules/jest/bin/jest.js --runInBand --testNamePattern='should create user'",
    "test:memory": "node --expose-gc ./node_modules/jest/bin/jest.js --runInBand --logHeapUsage"
  }
}
```

## 📊 MÉTRICAS Y MONITOREO

### 1. Métricas de Testing

```typescript
// test/utils/metrics.ts
export const testMetrics = {
  startTime: 0,
  endTime: 0,
  testCount: 0,
  passedTests: 0,
  failedTests: 0,

  start() {
    this.startTime = Date.now();
  },

  end() {
    this.endTime = Date.now();
  },

  recordTest(result: 'pass' | 'fail') {
    this.testCount++;
    if (result === 'pass') {
      this.passedTests++;
    } else {
      this.failedTests++;
    }
  },

  getSummary() {
    const duration = this.endTime - this.startTime;
    const successRate = (this.passedTests / this.testCount) * 100;

    return {
      duration,
      testCount: this.testCount,
      passedTests: this.passedTests,
      failedTests: this.failedTests,
      successRate: `${successRate.toFixed(2)}%`,
    };
  },
};
```

### 2. Reportes de Performance

```typescript
// test/utils/performance-reporter.ts
import { Reporter, TestResult } from '@jest/reporters';

export default class PerformanceReporter implements Reporter {
  onRunComplete(contexts: any, results: any) {
    const { testResults } = results;

    console.log('\n📊 Test Performance Report:');
    console.log('==========================');

    testResults.forEach((result: TestResult) => {
      const slowTests = result.testResults
        .filter(test => test.duration > 1000)
        .sort((a, b) => b.duration - a.duration);

      if (slowTests.length > 0) {
        console.log(`\n🐌 Slow tests in ${result.testFilePath}:`);
        slowTests.forEach(test => {
          console.log(`  - ${test.title}: ${test.duration}ms`);
        });
      }
    });
  }
}
```

## 🎯 CONCLUSIONES

La configuración de testing implementada proporciona:

- ✅ **Escalabilidad**: Configuración modular para diferentes tipos de tests
- ✅ **Performance**: Optimizaciones para ejecución rápida y eficiente
- ✅ **Mantenibilidad**: Configuración clara y documentada
- ✅ **CI/CD Ready**: Integración completa con pipelines de desarrollo
- ✅ **Debugging**: Herramientas avanzadas para troubleshooting
- ✅ **Monitoreo**: Métricas y reportes detallados de performance

Esta configuración establece un estándar profesional para testing, soportando el desarrollo continuo y la evolución del sistema con confianza y eficiencia.