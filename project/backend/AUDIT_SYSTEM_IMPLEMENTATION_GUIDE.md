# Guía Integral de Implementación del Sistema de Auditoría

> Objetivo: Esta guía explica en detalle la arquitectura, componentes, decisiones técnicas y pasos para replicar el sistema de auditoría de este proyecto en **cualquier otro backend (NestJS + TypeORM)**. Está pensada para un desarrollador que necesita portar el patrón y adaptarlo a su propio dominio.

---
## 1. Visión General
El sistema de auditoría captura y persiste eventos relevantes del sistema (acciones CRUD, autenticación, vistas, exportaciones, etc.) junto con metadatos (usuario, IP, user-agent, entidad afectada, resultado, valores previos/nuevos, duración y contexto). El objetivo es:
- Trazabilidad completa
- Forense y cumplimiento (accountability)
- Análisis de actividad y seguridad
- Observabilidad de comportamiento de usuarios y del sistema

### Principios Clave
1. No debe romper la operación principal (fail-safe / fire-and-forget controlado)
2. Extensible (fácil agregar nuevos tipos de acciones y entidades)
3. Bajo acoplamiento (controladores sólo declaran intención de auditar)
4. Consultas optimizadas (índices adecuados)
5. Respetar privacidad (redactar campos sensibles)
6. Capaz de registrar intentos fallidos (especialmente LOGIN)
7. Capacidad de diferenciación fuente (USER vs UI_AUTO vs SYSTEM)

---
## 2. Componentes Principales
| Componente | Rol | Archivo en este repo |
|------------|-----|----------------------|
| Entidad | Modelo persistente de log | `libs/entities/audit-log.entity.ts` |
| Interceptor | Captura automática de requests anotados | `src/common/interceptors/audit.interceptor.ts` |
| Decoradores | Marcan métodos a auditar | Definidos dentro del interceptor |
| Servicio | API programática para crear logs manuales o consultas | `src/audit/audit.service.ts` |
| Controlador | Endpoints de lectura/administración | `src/audit/audit.controller.ts` |
| Módulo Global | Exporta servicio + interceptor | `src/audit/audit.module.ts` |
| Debug/Utilitarios | Validaciones y pruebas manuales | `src/common/controllers/debug.controller.ts` |

---
## 3. Flujo de Datos (High-Level)
```
[Request Entrante]
      │
      ▼
[Controlador con @Audit()]  ---> (si no tiene decorador, bypass)
      │
      ▼ (Nest pipeline)
[AuditInterceptor]
      │   ├─ Extrae metadata (acción, entidad, descripción)
      │   ├─ Lee request (user, params, body, headers, source)
      │   ├─ Mide duración
      │   ▼
   [Servicio/Handler real]
      │
      ├─ Respuesta OK  ───► createAuditLog(success=true)
      └─ Lanza Error ─────► createAuditLog(success=false, errorMessage)
      
[AuditLog Persistido en DB]
      │
      ▼
[Consultas / Estadísticas / Monitoreo]
```

---
## 4. Entidad de Auditoría: Campos y Justificación
Archivo base: `audit-log.entity.ts`

| Campo | Tipo | Propósito | Notas |
|-------|------|-----------|-------|
| id | PK | Identificador único | Autogenerado |
| userId (FK) | number? | Usuario que ejecuta acción | Nullable (login fallido, procesos de sistema) |
| ipAddress | string? | Origen IP | Normalizado (limpia ::1, 127.0.0.1, vacíos) |
| userAgent | string? | Información de cliente | Limpia valores vacíos / N/A |
| action | enum | Tipo de acción atómica | LOGIN/LOGOUT/CREATE/UPDATE/etc. |
| entityType | enum | Dominio afectado | USER / PRODUCER / ... / SYSTEM |
| entityId | number? | ID de la entidad afectada | Opcional (acciones globales) |
| description | string | Resumen human-readable | Útil para paneles |
| metadata | json? | Info técnica (url, método, duración, timestamp) | Extensible |
| oldValues | json? | Antes (para UPDATE) | Puede omitirse si no se carga previo |
| newValues | json? | Después (create/update/login payload) | Redacta sensibles |
| success | boolean | Resultado binario | True por defecto |
| errorMessage | string? | Mensaje de error si fallo | No lanza excepción secundaria |
| createdAt | timestamp | Orden temporal | Indexado |

### Extensiones Futuras
- requestId / traceId para correlación distribuida
- severity / complianceTag
- actorType (USER / SYSTEM / SCHEDULER / API_KEY)

---
## 5. Enumeraciones (Acciones y Entidades)
Mantenerlos explícitos evita valores inconsistentes y facilita validación.

Ejemplo de acciones base:
```
LOGIN | LOGOUT | CREATE | UPDATE | DELETE | VIEW | EXPORT | IMPORT
```

Ejemplo de entidades base en este proyecto:
```
USER | PRODUCER | RECEPTION | RICE_TYPE | TEMPLATE | SEASON | TRANSACTION | DISCOUNT_PERCENT | ANALYSIS_PARAM | SYSTEM
```

### Cómo extender:
1. Agregar nuevo literal a los unions `AuditAction` o `AuditEntityType`.
2. (Opcional) Ajustar estadísticas en `audit.service.ts` (método `getStats` / `getAuditStats`).
3. Regenerar tipos o actualizar lugares que usen listas estáticas.

---
## 6. Interceptor de Auditoría
Punto neurálgico para auditoría automática.

Responsabilidades:
- Detectar si el handler tiene metadata de auditoría
- Construir el contexto (usuario autenticado, IP, headers, origen)
- Capturar tiempos y éxito/fallo
- Inferir `entityId` (params.id > response.id > body.id > body.userId)
- Aplicar lógica especial para LOGIN (razón de fallo, email, outcome)
- Redactar campos sensibles
- Persistir sin bloquear la respuesta principal

### Decoradores Disponibles
```
@Audit(action, entityType, description?)
@AuditUserQuery(action, entityType, description?) // Sólo si la fuente es USER (excluye UI_AUTO / SYSTEM)
```

### Origen de Request (Heurística)
- Header: `x-request-source`
- Query param: `?source=UI_AUTO`
- Default: `USER`

Esto evita generar ruido en consultas automáticas de refresco de UI.

---
## 7. Servicio de Auditoría
Ubicado en `audit.service.ts`.

Funciones clave:
- `createAuditLog(data)` creación manual (procesos batch, scripts, eventos de dominio fuera del contexto HTTP)
- `findAuditLogs(filters)` paginado + filtros (userId, action, entityType, date range, success)
- `getStats(days)` / `getAuditStats(days)` agregaciones varias
- `getUserAuditLogs(userId)` / `getEntityAuditLogs(entityType, entityId)` consultas focalizadas
- `cleanOldLogs(days)` mantenimiento
- `cleanupInvalidValues()` normalización retroactiva

### Contrato Mínimo de createAuditLog
```
interface CreateAuditLogInput {
  userId?: number;
  ipAddress?: string;
  userAgent?: string;
  action: AuditAction;
  entityType: AuditEntityType;
  entityId?: number;
  description: string;
  metadata?: any;
  oldValues?: any;
  newValues?: any;
  success?: boolean; // default true
  errorMessage?: string;
}
```

### Buenas Prácticas
- No pases objetos completos pesados (limita/serializa)
- Redacta secretos antes de llamar al servicio
- Evita loops de auditoría (no auditar lectura de logs de auditoría por defecto)

---
## 8. Controlador de Auditoría
Provee endpoints REST para exploración, paneles y administración.

Endpoints típicos:
```
GET  /audit               # listado con filtros
GET  /audit/stats         # métricas rápidas
GET  /audit/user/:id      # actividad por usuario
GET  /audit/entity/:type/:id  # evolución de una entidad
GET  /audit/cleanup/:days # purga histórica
POST /audit/manual        # inserción manual desde frontend / admin tool
POST /audit/cleanup-invalid-values # normaliza valores viejos
```

Sugerencia: proteger con roles (ej: sólo ADMIN / SECURITY).

---
## 9. Módulo Global
`@Global()` permite inyectar `AuditService` sin reimportar el módulo.

Estructura típica:
```
@Global()
@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  providers: [AuditService, AuditInterceptor],
  exports: [AuditService, AuditInterceptor],
})
export class AuditModule {}
```

---
## 10. Pasos para Integrar en Otro Proyecto (Checklist)
1. Crear entidad `AuditLog` (ajusta nombres/enum a tu dominio)
2. Añadirla a configuración de TypeORM (entities[] / sincronización / migración)
3. Implementar interceptor + decoradores (`Audit`, `AuditUserQuery`)
4. Implementar servicio (`createAuditLog` + consultas necesarias)
5. Implementar controlador (si necesitas endpoints públicos)
6. Marcar módulo como `@Global` y exportar providers
7. Agregar índices adecuados (userId+createdAt, entityType+entityId, action+createdAt)
8. Colocar `@UseInterceptors(AuditInterceptor)` en controladores base o globalmente (APP_INTERCEPTOR)
9. Anotar métodos con `@Audit()` según casos de uso
10. Proteger endpoints de lectura con guard de roles
11. Añadir tareas de mantenimiento (purga automática via cron si procede)
12. Crear dashboard (frontend) para explorar
13. Añadir monitoreo/alertas para acciones críticas (ej: muchos LOGIN fallidos)

---
## 11. Adaptación a Distintos Contextos
| Escenario | Ajuste Necesario |
|-----------|------------------|
| Base de datos PostgreSQL | Cambiar tipos enum a `varchar` o usar `enumName` específico |
| Multi-servicio (microservicios) | Añadir campo `serviceName` o `originService` |
| Auditoría de eventos de dominio (no HTTP) | Exponer función `auditDomainEvent(event)` que llame `createAuditLog()` |
| Alta concurrencia | Usar cola asíncrona (BullMQ / Kafka) para persistencia diferida |
| Alto volumen histórico | Particionar tabla por fecha o archivar a storage frío |
| Regulaciones de privacidad | Agregar anonimización selectiva (hash IP / borrar después de N días) |

---
## 12. Ejemplo de Interceptor Mínimo (Esqueleto Portable)
```ts
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private ds: DataSource) {}
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const meta = this.reflect(ctx.getHandler());
    if (!meta) return next.handle();
    const req = ctx.switchToHttp().getRequest();
    const start = Date.now();
    return next.handle().pipe(
      tap(async (res) => this.persist(meta, req, res, true, null, Date.now()-start)),
      catchError(err => {
        this.persist(meta, req, null, false, err.message, Date.now()-start);
        throw err;
      })
    );
  }
  private async persist(meta, req, res, success, errorMessage, duration) { /* ... */ }
}
```

---
## 13. Ejemplo de Uso en Controlador
```ts
@Controller('products')
@UseInterceptors(AuditInterceptor)
export class ProductController {
  constructor(private service: ProductService) {}

  @Post()
  @Audit('CREATE', 'PRODUCT', 'Crear producto')
  create(@Body() dto: CreateProductDto) { return this.service.create(dto); }

  @Patch(':id')
  @Audit('UPDATE', 'PRODUCT', 'Actualizar producto')
  update(@Param('id') id: number, @Body() dto: UpdateProductDto) { return this.service.update(id, dto); }
}
```

---
## 14. Estrategia para UPDATE (oldValues vs newValues)
Para capturar `oldValues`:
1. En el servicio de dominio antes de actualizar: `const before = await repo.findOne(id);`
2. Después de aplicar cambios, en el interceptor o manualmente: guardar snapshot limpio.
3. Redactar campos sensibles. Ejemplo:
```ts
const sanitize = (o) => { const c = {...o}; delete c.password; return c; };
await auditService.createAuditLog({
  action: 'UPDATE', entityType: 'USER', entityId: user.id,
  description: 'Actualización de perfil',
  oldValues: sanitize(before),
  newValues: sanitize(updated),
});
```

---
## 15. Estadísticas y Análisis
Puedes construir métricas adicionales:
- Frecuencia de acciones por hora
- Ratio LOGIN exitoso/fallido
- Entidades más modificadas
- Detección de patrones anómalos (muchos DELETE seguidos)

Sugerencia: Exponer endpoint `/audit/analytics` y precalcular con CRON si la base crece.

---
## 16. Seguridad y Privacidad
Recomendaciones:
- No almacenar contraseñas, tokens, secretos (redactar siempre)
- Para GDPR/privacidad: permitir borrar datos específicos asociados a usuarios (soft delete o anonimización)
- Limitar acceso a endpoints de auditoría (solo roles elevados)
- Evitar filtrar existencia de usuarios en login fallido (mensaje genérico)

---
## 17. Errores Comunes al Portar
| Problema | Causa | Solución |
|----------|-------|----------|
| No se persisten logs | Falta importar módulo global o entidad en TypeORM | Verifica `AuditModule` y `entities: []` |
| `enum` error en migración | Diferencia entre DB y tipos | Ajustar migración / usar strings simples |
| `userId` siempre null | Guard de auth no adjunta `req.user` | Asegurar middleware/guard JWT setea usuario |
| Sobrecarga de logs | Se auditan consultas automáticas | Usar `@AuditUserQuery` o filtrar `x-request-source` |
| Campos sensibles expuestos | Falta sanitize | Revisar `sanitizeData()` y listas de campos |

---
## 18. Optimización y Escalabilidad
- Índices: revisar plan de ejecución (`EXPLAIN`)
- Purga: CRON diario `DELETE WHERE createdAt < NOW() - INTERVAL 365 DAY`
- Archivar: mover registros antiguos a otra tabla/almacen S3
- Sharding lógico por año si >50M filas
- Considerar particionamiento nativo (Postgres `PARTITION BY RANGE`)

---
## 19. Checklist Rápido de Implementación
```
[ ] Crear entidad AuditLog
[ ] Agregar a TypeORM config / migración
[ ] Implementar servicio (create + queries)
[ ] Implementar interceptor + decoradores
[ ] Registrar módulo global
[ ] Añadir índices (userId+createdAt, entityType+entityId, action+createdAt)
[ ] Aplicar @UseInterceptors en controladores o global
[ ] Decorar métodos críticos con @Audit
[ ] Proteger endpoints /audit con auth + roles
[ ] Implementar purga programada
[ ] Construir dashboard básico
[ ] Añadir alertas (login fallidos, deletes masivos)
```

---
## 20. Ejemplo de Migración (Si No Usas synchronize)
```ts
export class CreateAuditLogTable1700000000000 implements MigrationInterface {
  name = 'CreateAuditLogTable1700000000000';
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE audit_log (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NULL,
      ipAddress VARCHAR(45) NULL,
      userAgent VARCHAR(500) NULL,
      action VARCHAR(20) NOT NULL,
      entityType VARCHAR(50) NOT NULL,
      entityId INT NULL,
      description VARCHAR(255) NOT NULL,
      metadata JSON NULL,
      oldValues JSON NULL,
      newValues JSON NULL,
      success TINYINT(1) NOT NULL DEFAULT 1,
      errorMessage VARCHAR(500) NULL,
      createdAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      INDEX IDX_user_createdAt (userId, createdAt),
      INDEX IDX_entity (entityType, entityId),
      INDEX IDX_action_createdAt (action, createdAt)
    ) ENGINE=InnoDB;`);
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE audit_log');
  }
}
```

---
## 21. Extensión: Auditoría de Eventos de Dominio
Puedes envolver eventos (Domain Events) con un publicador que inyecte auditoría:
```ts
class DomainEventAuditor {
  constructor(private audit: AuditService) {}
  async record(event: { type: string; entity: string; entityId?: number; payload?: any; }) {
    await this.audit.createAuditLog({
      action: 'SYSTEM_EVENT' as any,
      entityType: event.entity as any,
      entityId: event.entityId,
      description: `Evento de dominio: ${event.type}`,
      newValues: event.payload,
      success: true,
      metadata: { emittedAt: new Date().toISOString() }
    });
  }
}
```

---
## 22. Siguientes Mejoras Potenciales
- Integración con SIEM (Splunk/ELK) vía cola
- Firma digital de logs sensibles (integridad)
- Campo hash encadenado para detectar manipulación
- API GraphQL para exploración avanzada
- Alertas reactivas en tiempo real (WebSocket)

---
## 23. Conclusión
Este patrón desacopla la intención de auditar de la lógica de negocio, habilita escalabilidad y mantiene la trazabilidad esencial para cumplimiento y seguridad. Adaptarlo implica ajustar enumeraciones, ampliar metadatos y endurecer controles de acceso.

> Si portas este sistema, documenta qué acciones son realmente críticas y aplica revisiones periódicas a los reportes.

---
¿Dudas o necesitas una versión adaptada a microservicios? Extiende este documento o crea `AUDIT_SYSTEM_MICROSERVICES.md` basándote en la sección 11.
