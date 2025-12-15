# Password Recovery Implementation Plan

## 1. Objetivo
Habilitar un flujo completo de recuperación de contraseña alineado con la arquitectura existente (NestJS + Next.js) que permita a un usuario solicitar la restauración de su cuenta, recibir un enlace temporal vía correo y establecer una nueva contraseña de manera segura.

---

## 2. Supuestos y dependencias
- La autenticación actual usa NextAuth con proveedor de credenciales (`frontend/app/api/auth/[...nextauth]/route.ts`) y backend `/auth/sign-in`.
- El servicio de correo está disponible (ver `backend/src/common/mailer` y guías `EMAIL_SETUP_GUIDE.md`).
- Usuarios residen en tabla/entidad `User` con campo `email` único y `password` encriptado.
- Configuración de envs contempla claves RSA para JWE; se añadirán variables para URLs públicas del frontend.

---

## 3. Resumen de componentes
| Área | Elementos | Descripción |
| --- | --- | --- |
| Backend (NestJS) | Nuevo controlador y servicio `auth/password-recovery`<br>Entidad `PasswordResetToken` (UUID + expiración)<br>Mailer para template reset | Genera tokens firmados, envía correo y aplica cambios de contraseña |
| Frontend (Next.js) | Actualización Login (`/portal/login` o formulario actual)<br>Página `forgot-password` (solicitud)<br>Página `reset-password` (formulario con token)<br>Server actions para llamar al backend | Entrada de email, validación de token y envío de nuevas contraseñas |
| Infraestructura | Variables de entorno adicionales (`RESET_TOKEN_EXP_MINUTES`, `FRONTEND_BASE_URL`, etc.) | Asegura construcción de URL y vigencia |

---

## 4. Diseño backend paso a paso

### 4.1. Base de datos y entidad
1. Crear entidad `PasswordResetToken` (`backend/src/entities/password-reset-token.entity.ts`):
   - `id` UUID (PK).
   - `userId` (FK a `User`).
   - `token` string (UUID o hash aleatorio, 64 chars).
   - `expiresAt` (`timestamp` con zona).
   - `consumedAt` (`timestamp` nullable) para revocar.
   - `createdAt` / `updatedAt` con `@CreateDateColumn` y `@UpdateDateColumn`.
2. Añadir migración TypeORM (`backend/database/migrations/*`): tabla con índices en `userId`, `token`, `expiresAt`.
3. Registrar entidad en `TypeOrmModule` (ver `backend/src/database/entities.ts`).

### 4.2. Módulo y servicio
1. Generar carpeta `backend/src/modules/password-recovery` con:
   - `password-recovery.module.ts`: importa `TypeOrmModule.forFeature([PasswordResetToken, User])`, `MailerModule`, `ConfigModule`.
   - `password-recovery.service.ts`: métodos principales:
     - `requestReset(email: string, originIp?: string)`:
       - Buscar usuario por email (case insensitive).
       - Si no existe, retornar ok sin revelar (prevención enumeración).
       - Invalidar tokens activos previos (`consumedAt = now`).
       - Crear token aleatorio (`randomUUID`), guardar con expiración configurable (`ConfigService.get('RESET_TOKEN_EXP_MINUTES')`).
       - Firmar payload opcional (no necesario si token es random y se valida en DB).
       - Enviar correo (ver 4.3) con enlace `<FRONTEND_URL>/portal/reset-password?token=...`.
     - `validateToken(token: string)`:
       - Encontrar token, verificar `expiresAt` >= now y `consumedAt IS NULL`.
       - Retornar usuario asociado para verificación.
     - `consumeToken(token: string, newPassword: string)`:
       - Validar como anterior.
       - Hashear contraseña (`AuthService.hashPassword` o `bcrypt` central).
       - Actualizar usuario (`user.password = hashed`), `consumedAt = now`.
   - Incluir logging y `Audit` decorador (definir `@Audit('password-recovery-request')`, etc.).
2. Exponer el módulo en `backend/src/modules/auth/auth.module.ts` o como módulo propio registrado en `app.module.ts`.

### 4.3. Controlador y rutas
1. `password-recovery.controller.ts` con rutas:
   - `POST /auth/password-recovery/request`:
     - DTO `{ email: string }` validado (`IsEmail`, `IsNotEmpty`).
     - Llama servicio `requestReset`.
     - Retorna `202 Accepted` con mensaje genérico.
   - `POST /auth/password-recovery/validate`:
     - DTO `{ token: string }`.
     - Usa `validateToken` y responde con `200` + datos no sensibles (p.ej. `email parcialmente enmascarado`).
   - `POST /auth/password-recovery/reset`:
     - DTO `{ token: string, password: string, confirmPassword: string }` con validaciones (`MinLength`, `Matches` políticas).
     - Llama `consumeToken`.
     - Retorna `200` con confirmación.
2. Decorar con `@Audit`, usar `RateLimitGuard` si disponible.
3. Añadir esquema Swagger en `SWAGGER_DOCUMENTATION_COMPLETE.md`.

### 4.4. Mailing
1. Crear template MJML/Handlebars en `backend/src/common/mailer/templates/password-reset.hbs` con variables: `{appName, resetUrl, expiresInMinutes}`.
2. Configurar `MailerService` para enviar asunto "Recupera tu contraseña".
3. Asegurar trazabilidad con `MailLog` si existe.

### 4.5. Configuración
- Nuevas env vars (`backend/.env`):
  - `PASSWORD_RESET_TOKEN_TTL=30`
  - `PASSWORD_RESET_BASE_URL=https://portal.bravo-schott.cl` (matching frontend).
- Agregar en `config` (`backend/src/config/app.config.ts`).

### 4.6. Seguridad
- Tokens únicos, de un solo uso.
- Expiración corta (30-60 min).
- Respuestas uniformes (no revelar si email existe).
- Logs con IP origen (`req.ip`).
- Requiere HTTPS en producción.

---

## 5. Diseño frontend paso a paso

### 5.1. Actualización Login
1. Identificar formulario de acceso (p.ej. `frontend/app/(auth)/login/page.tsx`).
2. Añadir enlace textual bajo el campo contraseña: "¿Olvidaste tu contraseña?" -> router a `/portal/forgot-password` (usar `Link` de Next).
3. Ajustar estilos acorde a naming (ver `components/TextField` y `Button`).

### 5.2. Flujo "Forgot password"
1. Crear ruta `frontend/app/portal/forgot-password/page.tsx` (Server Component) con metadata.
2. Incluir Client Component (`ForgotPasswordForm.tsx`):
   - Formulario con `TextField` para email, botón "Enviar instrucciones".
   - Validación con `zod`/`react-hook-form` (coherente con patrones del portal).
   - Hook `useAlert` para feedback.
   - Llamar server action `requestPasswordReset(formData)`.
3. Server action en `frontend/app/actions/auth.ts` (o crear nuevo archivo):
   - Obtener session (no necesaria pero mantener patrón `getServerSession`).
   - `fetch` POST a `${env.backendApiUrl}/auth/password-recovery/request` con `email`.
   - Manejar status 202 y errores (mostrar alerta genérica).
4. Página de confirmación opcional: mostrar mensaje "Si el correo existe, recibirás instrucciones".

### 5.3. Página "Reset password"
1. Crear ruta `frontend/app/portal/reset-password/page.tsx` con `searchParams.token`.
2. Server Component validará token via server action `validatePasswordResetToken(token)` durante SSR para mostrar email enmascarado o redirigir a error.
3. Client Component (`ResetPasswordForm.tsx`) con campos `password` y `confirmPassword` + checklist políticas (mínimo 12 chars, mayúscula, número, etc. adaptado a backend).
4. Botón "Actualizar contraseña" -> server action `completePasswordReset(token, password)`:
   - POST `${env.backendApiUrl}/auth/password-recovery/reset`.
   - En éxito: mostrar alerta y redirigir a login.
   - En error (token inválido/expirado): mostrar mensaje y sugerir reinicio.
5. Añadir `metadata` para SEO.

### 5.4. Integración NextAuth
- No requiere cambios en provider `Credentials`, pero tras reset exitoso se puede auto autenticar (opcional).
- Forzar logout de sesiones previas si se guarda `sessionVersion` (no implementado actualmente, considerar como mejora futura).

### 5.5. Accesibilidad y UX
- Copy centrado en claridad y brevedad.
- Bloquear repetidos envíos con loader.
- Feedback visual (spinner `CircularProgress` y `useAlert`).

---

## 6. QA y pruebas
| Tipo | Escenarios |
| --- | --- |
| Unit tests (backend) | `requestReset` crea token y envía mail<br>`consumeToken` actualiza contraseña y marca token consumido<br>Manejo de expiración y tokens inexistentes |
| E2E backend | API returns 202 for unknown email<br>Reset fails con token leído/expirado |
| Frontend | Form validations (email inválido, contraseñas no coincidentes)<br>Flujo completo manual: solicitud → correo (mock) → reset |
| Seguridad | Intentos múltiples -> rate limit<br>Verificar que el token no funciona dos veces |

---

## 7. Plan de despliegue
1. Crear migración y aplicarla (`npm run migration:generate`, `run-migrations.ts`).
2. Implementar servicios/controladores + tests.
3. Configurar template email y variables en ambientes.
4. Desplegar backend (PM2 restart).
5. Desplegar frontend (build + pm2 reload) para nuevas vistas.
6. Verificar envío real en entorno QA antes de producción.

---

## 8. Riesgos y mitigaciones
- **Correo no llega**: asegurar configuración SMTP y fallback `reply-to`.
- **Exposición token en logs**: enmascarar al loguear.
- **Ataques de enumeración**: respuestas uniformes y rate limiting.
- **Uso repetido**: marcar `consumedAt` y validar.

---

## 9. Próximos pasos sugeridos
- Después de implementar, documentar en `SWAGGER_DOCUMENTATION_COMPLETE.md` y `PORTAL_DOCUMENTATION_INDEX.md`.
- Considerar "Remember device" y "Session invalidation" tras cambio de contraseña.
