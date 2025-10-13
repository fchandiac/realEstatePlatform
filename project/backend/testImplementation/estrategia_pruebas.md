# Estrategia de Pruebas para Backend de Plataforma Inmobiliaria

## Visión General
El backend utiliza Jest como framework de pruebas, integrado con utilidades de testing de NestJS. Las pruebas se dividen en unitarias para entidades y servicios, de integración para módulos, y end-to-end.

## Componentes Clave
- **Framework**: Jest con @nestjs/testing
- **Base de Datos**: MySQL real para pruebas de integración, evitando mocks para mayor precisión
- **Autenticación**: JWT plano en entorno de pruebas, JWE en producción
- **Seeding de Datos**: Seeders personalizados para poblar datos de prueba
- **Cobertura**: Pruebas unitarias para entidades, integración para endpoints API

## Tipos de Pruebas
1. **Unitarias**: Validaciones de entidades, lógica de servicios. No usan base de datos real (emplean mocks o in-memory). No requieren login, prueban lógica pura.
2. **Integración**: Testing completo de módulos con DB real. Usan base de datos MySQL real para validar interacciones. Aplican login JWT solo cuando endpoints requieren autenticación (no todos los tests).
3. **E2E**: Flujos completos de aplicación. Usan base de datos real para simular escenarios completos. Incluyen login para autenticar usuarios en flujos protegidos.

## Aislamiento de Entorno
- Archivos .env específicos para pruebas
- Sincronización de DB deshabilitada en pruebas
- Manejo separado de JWT para test vs prod

## Ejecución
Ejecutar con `npm test`, patrones específicos con `--testPathPatterns`

## Lista de Pruebas

### Pruebas Unitarias
- **person.entity.spec.ts**: Valida la entidad Person, incluyendo relaciones (@OneToOne con User, @ManyToOne con Multimedia), restricciones de unicidad en DNI y campos opcionales.
- **app.controller.spec.ts**: Prueba el controlador principal de la aplicación NestJS.
- **auth.controller.spec.ts**: Prueba el controlador de autenticación, incluyendo endpoints de login.

### Pruebas de Integración
- **users.integration.spec.ts**: Prueba operaciones completas de usuarios: registro, login, gestión de perfiles con autenticación JWT.
- **person.integration.spec.ts**: Prueba CRUD de personas, incluyendo creación con relaciones y validaciones.
- **property.integration.spec.ts**: Prueba gestión de propiedades inmobiliarias: creación, actualización, búsqueda con filtros.
- **auth.integration.spec.ts**: Prueba integración de autenticación: login, validación de tokens, middleware de auth.
- **multimedia.upload.spec.ts**: Prueba subida y gestión de archivos multimedia (imágenes, videos) para propiedades.
- **contracts/contracts-document-upload.integration.spec.ts**: Prueba subida y asociación de documentos a contratos.
- **document.integration.spec.ts**: Prueba gestión de documentos: subida, almacenamiento, recuperación.
- **document-type.integration.spec.ts**: Prueba tipos de documentos y sus validaciones.
- **notification.integration.spec.ts**: Prueba sistema de notificaciones: envío, recepción, gestión.
- **property-types/property-type.integration.spec.ts**: Prueba tipos de propiedades inmobiliarias.
- **testimonial.integration.spec.ts**: Prueba gestión de testimonios de usuarios.
- **article.integration.spec.ts**: Prueba artículos del blog: creación, publicación, gestión.
- **team-member.integration.spec.ts**: Prueba miembros del equipo: perfiles, roles.
- **identity.integration.spec.ts**: Prueba verificación de identidad con documentos (DNI).
- **about-us.integration.spec.ts**: Prueba contenido de la sección "Acerca de".
- **contract.integration.spec.ts**: Prueba contratos: creación, firmas, gestión de estados.
- **audit-log.integration.spec.ts**: Prueba registro de auditoría: logging de acciones del sistema.

### Pruebas E2E
- **app.e2e-spec.ts**: Pruebas end-to-end que verifican flujos completos de la aplicación desde el cliente hasta la base de datos.