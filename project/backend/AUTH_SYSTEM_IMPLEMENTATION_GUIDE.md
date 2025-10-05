# Guía Integral de Implementación del Sistema de Autenticación

> Objetivo: Explicar cómo replicar el sistema de autenticación (login + protección de rutas + emisión y validación de tokens JWE/JWT) de este proyecto en otro backend (NestJS + TypeORM). Se describe arquitectura, componentes, flujo, seguridad y pasos para portar.

---
## 1. Visión General
El sistema implementa autenticación basada en **tokens cifrados (JWE)** y también soporta un **guard JWT clásico**. El flujo principal:
1. Usuario envía credenciales (`email`, `pass`) al endpoint de login.
2. El backend valida usuario y contraseña contra la base de datos.
3. Se construye un payload mínimo (sub, email, role).
4. Se genera un token JWE (cifrado asimétricamente con RSA-OAEP-256 + A256GCM) con expiración corta para el frontend.
5. Rutas protegidas usan `JweAuthGuard` (o `JwtAuthGuard` alternativo) para validar y extraer el `request.user`.
6. El interceptor de auditoría registra intentos de login (exitosos y fallidos).

---
## 2. Componentes Principales
| Componente | Rol | Archivo |
|-----------|-----|---------|
| Entidad Usuario | Fuente de identidad | `libs/entities/user.entity.ts` |
| Módulo Auth | Orquestación y exportación de servicios | `src/auth/auth/auth.module.ts` |
| Servicio Auth | Lógica de login | `src/auth/auth/auth.service.ts` |
| Controlador Auth | Endpoints `/auth` | `src/auth/auth/auth.controller.ts` |
| Módulo JWT | Registro de `JwtModule` | `src/auth/auth/jwt.module.ts` |
| Guard JWT | Validar token JWT estándar | `src/auth/auth/jwt-auth.guard.ts` |
| Módulo JWE | Servicios de cifrado/descifrado | `src/auth/jwe/jwe.module.ts` |
| Servicio JWE | Generar y validar tokens JWE | `src/auth/jwe/jwe.service.ts` |
| Guard JWE | Autorización basada en token cifrado | `src/auth/jwe/jwe-auth.guard.ts` |
| Wrapper jose | Carga dinámica / mocks test | `src/auth/jwe/jose-wrapper.service.ts` |
| Auditoría | Registro de intentos de login | `src/common/interceptors/audit.interceptor.ts` |

---
## 3. Dependencias y Entorno
Requisitos mínimos:
- NestJS + TypeORM
- Librería `jose` (para JWE) y claves RSA generadas
- Variable `JWT_SECRET` (para fallback JWT clásico)
- Variables para rutas de claves JWE (`envs.jwe.privateKeyPath`, `envs.jwe.publicKeyPath`)

Generación de claves (ejemplo RSA 4096 bits):
```bash
openssl genrsa -out private.pem 4096
openssl rsa -in private.pem -pubout -out public.pem
```

---
## 4. Entidad Usuario (Mínimo Necesario)
Campos mínimos sugeridos:
| Campo | Descripción |
|-------|-------------|
| id | PK numérica |
| email | Único, login principal |
| pass | Hash de contraseña (en este ejemplo plano, ver recomendaciones) |
| role | Rol para autorización básica |
| name | Identificación amigable |
| createdAt / updatedAt | Auditoría temporal |

Ejemplo simplificado existente: `user.entity.ts`.

---
## 5. Flujo de Login (Secuencia)
```
[Cliente]
  POST /auth/sign-in { email, pass }
     │
     ▼
[AuthController.signIn]
  -> AuthService.signIn(email, pass)
       │
       ├─ Busca usuario por email
       ├─ Valida contraseña
       ├─ Construye payload { sub, email, role }
       ├─ JweService.encrypt(payload, '15m')
       └─ Retorna { access_token, userId, email, role, name, user }
     │
     ▼
[Cliente] almacena token (Header Authorization: Bearer ...)
```

---
## 6. Payload del Token
Campos incluidos:
- `sub`: ID del usuario
- `email`: correo del usuario
- `role`: rol para controles de autorización
- (Automáticos) `iat`, `exp`, `iss`, `aud`

Expiración recomendada: corta (15m) + mecanismo de refresh (no implementado aquí, ver extensiones).

---
## 7. Servicio de Autenticación (`AuthService`)
Responsabilidad única: validar credenciales y emitir token.

Puntos clave del ejemplo:
- Uso directo de `(user as any).pass` para comparación (en producción usar hash bcrypt/argon2)
- Traducción de mensajes de error (`translate()` utilitario)
- Retorna objeto combinado útil para auditoría (`user` embed)

Interfaz de retorno sugerida:
```ts
interface SignInResult {
  access_token: string;
  userId: number;
  email: string;
  role: string;
  name: string;
  user: { id: number; email: string; role: string; name: string };
}
```

---
## 8. Emisión de Tokens JWE (`JweService`)
Usa `jose` para:
1. Importar claves (SPKI pública / PKCS8 privada)
2. Cifrar payload con `EncryptJWT` (alg: RSA-OAEP-256, enc: A256GCM)
3. Establecer issuer y audience fijos

Ventajas de JWE frente a JWT firmado:
- Payload no es legible por el cliente
- Evita exposición de claims sensibles

Limitaciones:
- Mayor peso del token
- Requiere infraestructura de claves

---
## 9. Validación de Tokens (`JweAuthGuard` / `JwtAuthGuard`)
Ambos guards extraen `Authorization: Bearer <token>`.

Diferencias:
| Guard | Mecanismo | Uso principal |
|-------|-----------|--------------|
| `JweAuthGuard` | Descifra JWE, valida issuer/audience | Producción (mayor privacidad) |
| `JwtAuthGuard` | Verifica firma HMAC (secret) | Simplicidad / fallback |

Ambos asignan `request.user = { id, email, role }` para consumo en controladores, servicios e interceptores de auditoría.

---
## 10. Protección de Rutas
Ejemplo de uso:
```ts
@UseGuards(JweAuthGuard)
@Get('secure')
getSecure(@Req() req) { return { ok: true, user: req.user }; }
```

O a nivel global en `main.ts`:
```ts
app.useGlobalGuards(app.get(JweAuthGuard));
```
(Nota: sólo si todas las rutas requieren autenticación; de lo contrario aplicar granularmente.)

---
## 11. Integración con Auditoría
El login está decorado con:
```ts
@Audit('LOGIN', 'USER', 'Intento de login')
```
El interceptor de auditoría obtiene:
- Resultado (éxito/fallo)
- Email y posible motivo de fallo
- userId sólo si login exitoso

Recomendación: también auditar `LOGOUT`, cambios de contraseña y creación de usuarios.

---
## 12. Pasos para Portar a Otro Proyecto (Checklist)
1. Crear entidad `User` con campos mínimos (email, pass hash, role)
2. Configurar TypeORM y registrar entidad
3. Generar claves RSA y definir paths en configuración (`envs.jwe.*`)
4. Implementar `JweService` (carga de claves + encrypt/decrypt)
5. Implementar `JoseWrapperService` para soportar mocks en tests
6. Crear `AuthService` (validar credenciales + emitir token)
7. Crear `AuthController` con endpoint `POST /auth/sign-in`
8. Implementar `JweAuthGuard` para proteger rutas
9. (Opcional) Implementar `JwtAuthGuard` fallback
10. Integrar auditoría (decorar login con `@Audit`)
11. Añadir variables de entorno: `JWT_SECRET`, paths de claves
12. Forzar HTTPS en despliegues (transporte seguro)
13. Añadir expiración corta + plan de refresh (extensión)
14. Proteger endpoints sensibles con roles (ver sección roles futura)

---
## 13. Diagrama Simplificado de Componentes
```
+-------------+      login       +--------------+    encrypt    +------------+
|  Frontend   |  POST /sign-in  | AuthService  | ------------> | JweService |
+------+------+                  +------+-------+               +------+-----+
       |                                |                              |
       |  access_token                  |                              |
       | <------------------------------+                              |
       |                                                                |
       |  Authorization: Bearer token         decrypt + validate        |
       |  GET /secure  -------------------->  JweAuthGuard  ----------> V
       |                                                  attaches req.user
```

---
## 14. Seguridad y Buenas Prácticas
| Aspecto | Recomendación |
|---------|---------------|
| Almacenamiento contraseñas | Usar bcrypt/argon2 (NO texto plano) |
| Reintentos login | Implementar throttling / rate limiting |
| Logs sensibles | No guardar pass / tokens en logs |
| Transporte | Siempre HTTPS en producción |
| Revocación | Mantener lista de tokens revocados / rotation keys |
| Expiración | Acceso corto (15m) + Refresh (7d) |
| Roles | Implementar guard/custom decorator `@Roles()` para autorización |
| CSRF | No aplica a Bearer API, sí a cookies si se usaran |

---
## 15. Extensiones Futuras
- Refresh tokens y rotación
- Single Sign-Out (lista revocada)
- Multi-factor (MFA / OTP)
- Device fingerprinting
- Sesiones activas (tabla `user_session`)
- Scope-based auth (claims granulares)
- Rate limit adaptativo por IP/usuario

---
## 16. Errores Comunes al Portar
| Problema | Causa | Solución |
|----------|-------|----------|
| `Invalid or expired token` constante | Claves mal cargadas o issuer/audience distinto | Revisar `issuer/audience` en encrypt/decrypt |
| `Usuario no encontrado` aunque existe | Config DB o casing email | Normalizar emails a lowercase |
| `Contraseña incorrecta` siempre | Comparación plana vs hash | Implementar bcrypt y comparar hash |
| Payload expuesto en JWT | Uso de JWT firmado en vez de JWE | Migrar a JWE para ocultar claims |
| Tests fallan por jose | Import dinámico falla en test | Usar `JoseWrapperService` mockeado |

---
## 17. Implementación de Hash de Contraseña (Sugerido)
Ejemplo (adaptar):
```ts
import * as bcrypt from 'bcrypt';
// Al crear usuario
user.pass = await bcrypt.hash(plainPass, 12);
// Al validar login
const ok = await bcrypt.compare(pass, user.pass);
if (!ok) throw new UnauthorizedException('Contraseña incorrecta');
```

---
## 18. Ejemplo de Guard de Roles (Extensión)
```ts
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const required = this.reflector.get<string[]>('roles', ctx.getHandler()) || [];
    if (!required.length) return true;
    return required.includes(req.user?.role);
  }
}
```
Uso:
```ts
@UseGuards(JweAuthGuard, RolesGuard)
@Roles('admin')
@Get('admin/metrics')
getMetrics() {}
```

---
## 19. Checklist Final
```
[ ] Entidad User creada
[ ] Claves RSA generadas y accesibles
[ ] JweService operativo (encrypt/decrypt OK)
[ ] AuthService login funcionando
[ ] Endpoint POST /auth/sign-in responde token
[ ] Guard JWE protege ruta de prueba
[ ] Auditoría registra intentos de login
[ ] Mensajes de error genéricos (no filtrar existencia)
[ ] Hash de contraseña implementado
[ ] Rate limiting configurado
[ ] Roles/autorización avanzada (si aplica)
[ ] Estrategia de refresh tokens planificada
```

---
## 20. Conclusión
Este sistema ofrece una base segura y extensible para autenticación basada en tokens cifrados. Para producción se recomienda: reforzar hashing, agregar refresh tokens, monitorear abusos y centralizar revocación. La modularidad permite portar cada componente de forma incremental.

¿Necesitas una variante para microservicios, OAuth2 o integración con un Identity Provider externo? Crea un documento `AUTH_SYSTEM_IDP_GUIDE.md` derivado de esta base.
