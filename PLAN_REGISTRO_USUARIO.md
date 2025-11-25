# Plan de Implementación: Registro de Usuario con Validación por Email

## 📋 Resumen Ejecutivo
Implementar un flujo completo de registro de usuarios (COMMUNITY) con validación por correo electrónico, desde el frontend portal hasta la creación en backend con envío de email de confirmación.

---

## 🏗️ Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUJO DE REGISTRO                         │
└─────────────────────────────────────────────────────────────┘

1. USUARIO VE PORTAL (PortalTopBar)
   └─> Click en "Registrarse" (botón en LoginForm)
       └─> Abre RegisterForm en Dialog

2. USUARIO COMPLETA FORMULARIO (RegisterForm)
   └─> Valida: email, contraseña, nombre
   └─> Envía a Server Action: createUserAction()

3. BACKEND PROCESA REGISTRO (users.service.ts)
   └─> Validar email único
   └─> Crear usuario con role: "COMMUNITY"
   └─> Status: "ACTIVE" (inicialmente)
   └─> Generar token de verificación
   └─> GUARDAR EN DB: pendingEmailVerification

4. ENVÍO DE EMAIL (mail.service.ts)
   └─> Email con link de verificación
   └─> Link: /portal/verify-email?token=xxxxx

5. USUARIO VERIFICA EMAIL
   └─> Click en link
   └─> Frontend valida token
   └─> Backend marca como verificado
   └─> Usuario puede login

6. LOGIN EXITOSO
   └─> Redirecciona a /portal (usuario community)
```

---

## 📁 Archivos a Crear/Modificar

### FRONTEND

#### 1. `frontend/app/portal/ui/PortalTopBar.tsx` ✏️ MODIFICAR
**Estado**: Ya existe, solo agregar botón de registro
- **Cambio**: Abrir Dialog de Registro cuando usuario no está logueado
- **Ubicación**: En LoginForm, agregar botón "¿No tienes cuenta? Registrarse"

#### 2. `frontend/app/portal/ui/RegisterForm.tsx` ✏️ MODIFICAR
**Estado**: Ya existe pero solo es un formulario sin lógica
**Cambios**:
- Agregar `'use client'` directive
- Agregar lógica de envío a servidor
- Integrar con `useAlert()` para feedback
- Validaciones de cliente:
  - Email válido
  - Contraseña mínimo 8 caracteres
  - Contraseñas coinciden
  - Nombre y apellido requeridos
- Estados:
  - `isSubmitting`: durante envío
  - `errorMessage`: mostrar errores
- Llamar a new server action: `registerUserAction()`

#### 3. 🆕 `frontend/app/actions/auth.ts` CREAR
**Propósito**: Server actions para autenticación portal
**Funciones**:
```typescript
export async function registerUserAction(formData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<{
  success: boolean;
  error?: string;
  message?: string;
}>
```
**Lógica**:
- Leer `backendApiUrl` desde env
- Enviar POST a `${backendApiUrl}/auth/register`
- Manejar errores (email duplicado, validación, etc)
- Retornar resultado

#### 4. 🆕 `frontend/app/portal/verify-email/page.tsx` CREAR
**Propósito**: Página de verificación de email
**Componentes**:
- Extraer token de URL: `useSearchParams()`
- Mostrar spinner mientras verifica
- Llamar a server action: `verifyEmailAction(token)`
- Mostrar éxito o error
- Link para login o resend email

#### 5. 🆕 `frontend/app/actions/email-verification.ts` CREAR
**Funciones**:
```typescript
export async function verifyEmailAction(token: string): Promise<{
  success: boolean;
  error?: string;
}>

export async function resendVerificationEmailAction(email: string): Promise<{
  success: boolean;
  error?: string;
}>
```

---

### BACKEND

#### 6. 🆕 `backend/src/modules/users/dto/create-user-community.dto.ts` CREAR
**Propósito**: DTO específico para registro en portal (COMMUNITY users)
```typescript
export class CreateUserCommunityDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
```

#### 7. 🆕 `backend/src/modules/auth/dto/register-response.dto.ts` CREAR
```typescript
export class RegisterResponseDto {
  success: boolean;
  message: string;
  userId?: string;
  error?: string;
}
```

#### 8. ✏️ `backend/src/modules/users/users.service.ts` MODIFICAR
**Métodos a Agregar**:
```typescript
// Crear usuario COMMUNITY con verificación de email
async createCommunityUser(
  createUserCommunityDto: CreateUserCommunityDto
): Promise<User>

// Generar token de verificación (JWT corta duración)
private generateEmailVerificationToken(userId: string, email: string): string

// Marcar email como verificado
async verifyUserEmail(token: string): Promise<{ success: boolean }>

// Buscar usuario por token de verificación
private async findUserByVerificationToken(token: string): Promise<User>
```

#### 9. 🆕 `backend/src/modules/auth/auth.controller.ts` MODIFICAR
**Endpoints a Agregar**:
```
POST /auth/register
  Body: CreateUserCommunityDto
  Response: RegisterResponseDto

POST /auth/verify-email
  Body: { token: string }
  Response: { success: boolean, message: string }

POST /auth/resend-verification-email
  Body: { email: string }
  Response: { success: boolean, message: string }
```

#### 10. 🆕 `backend/src/modules/auth/auth.service.ts` MODIFICAR
**Métodos a Agregar**:
```typescript
async register(createUserCommunityDto: CreateUserCommunityDto): 
  Promise<RegisterResponseDto>

async verifyEmail(token: string): 
  Promise<{ success: boolean; message: string }>

async resendVerificationEmail(email: string):
  Promise<{ success: boolean; message: string }>
```

#### 11. ✏️ `backend/src/entities/user.entity.ts` MODIFICAR
**Campos a Agregar**:
```typescript
@Column({ default: false })
emailVerified: boolean;

@Column({ nullable: true })
emailVerificationToken: string;

@Column({ nullable: true })
emailVerificationExpires: Date;
```

#### 12. ✏️ `backend/src/modules/mail/mail.service.ts` MODIFICAR
**Métodos a Agregar**:
```typescript
async sendEmailVerification(
  email: string,
  firstName: string,
  verificationLink: string
): Promise<void>

async sendWelcomeEmail(
  email: string,
  firstName: string
): Promise<void>
```

#### 13. 🆕 `backend/src/modules/mail/templates/email-verification.hbs` CREAR
**Template Handlebars**:
```html
<h2>¡Bienvenido {{firstName}}!</h2>
<p>Para completar tu registro, verifica tu correo electrónico:</p>
<a href="{{verificationLink}}">Verificar Correo</a>
<p>Si no solicitaste esta cuenta, ignora este mensaje.</p>
```

#### 14. 🆕 `backend/database/migrations/AddEmailVerificationToUsers.ts` CREAR
**Migración**:
- Agregar columnas: `emailVerified`, `emailVerificationToken`, `emailVerificationExpires`

---

## 🔄 Flujo Detallado Paso a Paso

### PASO 1: Frontend - UI del Registro

#### 1.1 Modificar LoginForm.tsx
```tsx
// Al final del formulario, agregar:
<div className="text-center text-sm">
  <span>¿No tienes cuenta? </span>
  <Button 
    variant="text"
    className="text-primary p-0"
    onClick={() => onRegisterClick?.()} 
  >
    Registrarse aquí
  </Button>
</div>
```

#### 1.2 Modificar PortalTopBar.tsx
```tsx
// Agregar nuevo state
const [showRegisterForm, setShowRegisterForm] = useState(false);

// En el Dialog, agregar segunda para Register
<Dialog
  open={registerDialogOpen}
  onClose={() => setRegisterDialogOpen(false)}
  title="Crear Cuenta"
>
  <RegisterForm 
    onClose={() => setRegisterDialogOpen(false)}
    onRegisterClick={() => setLoginDialogOpen(true)}
  />
</Dialog>

// Pasar callback a LoginForm
<LoginForm
  onRegisterClick={() => setRegisterDialogOpen(true)}
  ...
/>
```

### PASO 2: Frontend - Lógica de Registro

#### 2.1 Crear `frontend/app/actions/auth.ts`
```typescript
'use server'

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { env } from '@/lib/env';

export async function registerUserAction(formData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  try {
    const response = await fetch(
      `${env.backendApiUrl}/auth/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Error al registrar usuario',
      };
    }

    return {
      success: true,
      message: data.message || 'Registro exitoso. Revisa tu email para verificar tu cuenta.',
    };
  } catch (error) {
    console.error('Register error:', error);
    return {
      success: false,
      error: 'Error de conexión. Intenta de nuevo.',
    };
  }
}
```

#### 2.2 Modificar `frontend/app/portal/ui/RegisterForm.tsx`
```tsx
'use client'

import { useState, FormEvent } from 'react';
import { useAlert } from '@/app/hooks/useAlert';
import { TextField } from '@/components/TextField/TextField';
import { Button } from '@/components/Button/Button';
import { registerUserAction } from '@/app/actions/auth';

export default function RegisterForm({ onClose, onRegisterClick }: RegisterFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showAlert } = useAlert();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Validaciones
    if (!firstName.trim() || !lastName.trim()) {
      showAlert({ message: 'Nombre y apellido requeridos', type: 'error' });
      return;
    }
    
    if (password.length < 8) {
      showAlert({ message: 'La contraseña debe tener al menos 8 caracteres', type: 'error' });
      return;
    }
    
    if (password !== confirmPassword) {
      showAlert({ message: 'Las contraseñas no coinciden', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await registerUserAction({
        firstName,
        lastName,
        email,
        password,
      });

      if (result.success) {
        showAlert({ message: result.message, type: 'success', duration: 5000 });
        if (onClose) onClose();
      } else {
        showAlert({ message: result.error, type: 'error' });
      }
    } catch (error) {
      showAlert({ message: 'Error inesperado', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <TextField
        label="Nombre"
        required
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        disabled={isSubmitting}
      />
      <TextField
        label="Apellido"
        required
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        disabled={isSubmitting}
      />
      <TextField
        label="Correo electrónico"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isSubmitting}
      />
      <TextField
        label="Contraseña"
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isSubmitting}
      />
      <TextField
        label="Confirmar contraseña"
        type="password"
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        disabled={isSubmitting}
      />
      <Button
        variant="primary"
        type="submit"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Registrando...' : 'Registrarse'}
      </Button>
    </form>
  );
}
```

### PASO 3: Backend - Crear Endpoints

#### 3.1 Crear `backend/src/modules/users/dto/create-user-community.dto.ts`
```typescript
import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

export class CreateUserCommunityDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;
}
```

#### 3.2 Modificar `backend/src/entities/user.entity.ts`
Agregar campos:
```typescript
@Column({ default: false })
emailVerified: boolean;

@Column({ nullable: true })
emailVerificationToken: string;

@Column({ nullable: true })
emailVerificationExpires: Date;
```

#### 3.3 Crear migración
`backend/database/migrations/AddEmailVerificationToUsers.ts`

#### 3.4 Modificar `backend/src/modules/users/users.service.ts`
Agregar método:
```typescript
async createCommunityUser(
  createUserCommunityDto: CreateUserCommunityDto,
): Promise<User> {
  // 1. Validar email único
  const existingUser = await this.userRepository.findOne({
    where: { email: createUserCommunityDto.email },
  });

  if (existingUser) {
    throw new ConflictException('Este correo ya está registrado');
  }

  // 2. Generar token de verificación (válido por 24 horas)
  const verificationToken = this.generateEmailVerificationToken(
    createUserCommunityDto.email,
  );
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  // 3. Crear usuario
  const user = this.userRepository.create({
    username: createUserCommunityDto.email, // Usar email como username
    email: createUserCommunityDto.email,
    password: createUserCommunityDto.password,
    role: UserRole.COMMUNITY,
    status: UserStatus.ACTIVE,
    emailVerified: false,
    emailVerificationToken: verificationToken,
    emailVerificationExpires: expiresAt,
    personalInfo: {
      firstName: createUserCommunityDto.firstName,
      lastName: createUserCommunityDto.lastName,
    },
  });

  // 4. Hash contraseña
  await user.setPassword(createUserCommunityDto.password);

  // 5. Guardar en BD
  const savedUser = await this.userRepository.save(user);

  // 6. Crear Person asociada
  const person = this.personRepository.create({
    verified: false,
    user: savedUser,
  });
  await this.personRepository.save(person);

  return savedUser;
}
```

#### 3.5 Modificar `backend/src/modules/auth/auth.service.ts`
Agregar:
```typescript
async register(
  createUserCommunityDto: CreateUserCommunityDto,
): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    const user = await this.usersService.createCommunityUser(
      createUserCommunityDto,
    );

    // Enviar email de verificación
    const verificationLink = `${process.env.FRONTEND_URL}/portal/verify-email?token=${user.emailVerificationToken}`;
    await this.mailService.sendEmailVerification(
      user.email,
      user.personalInfo?.firstName || 'Usuario',
      verificationLink,
    );

    return {
      success: true,
      message: 'Usuario registrado. Verifica tu correo para activar tu cuenta.',
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error: error.message,
    };
  }
}
```

#### 3.6 Modificar `backend/src/modules/auth/auth.controller.ts`
Agregar endpoint:
```typescript
@Post('register')
@ApiOperation({ summary: 'Register new community user' })
async register(
  @Body(ValidationPipe) createUserCommunityDto: CreateUserCommunityDto,
) {
  return await this.authService.register(createUserCommunityDto);
}
```

#### 3.7 Modificar `backend/src/modules/mail/mail.service.ts`
Agregar:
```typescript
async sendEmailVerification(
  email: string,
  firstName: string,
  verificationLink: string,
): Promise<void> {
  try {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Verifica tu correo electrónico - Real Estate Platform',
      template: 'email-verification',
      context: {
        firstName,
        verificationLink,
        companyName: 'Real Estate Platform',
      },
    });
    console.log(`✅ Email de verificación enviado a ${email}`);
  } catch (error) {
    console.error(`❌ Error enviando email de verificación a ${email}:`, error);
    throw error;
  }
}
```

### PASO 4: Email Template

Crear `backend/src/modules/mail/templates/email-verification.hbs`:
```html
<h2>Bienvenido {{firstName}}!</h2>
<p>Gracias por registrarte en {{companyName}}.</p>
<p>Para completar tu registro, haz clic en el siguiente enlace para verificar tu correo:</p>
<a href="{{verificationLink}}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
  Verificar Correo
</a>
<p style="margin-top: 20px; color: #666; font-size: 12px;">
  Este enlace expira en 24 horas.
</p>
<p style="color: #666; font-size: 12px;">
  Si no solicitaste esta cuenta, por favor ignora este correo.
</p>
```

---

## 🎯 Checklist de Implementación

### Frontend
- [ ] Modificar `LoginForm.tsx` - agregar botón "Registrarse"
- [ ] Modificar `PortalTopBar.tsx` - estado para mostrar registro
- [ ] Crear `frontend/app/actions/auth.ts` - server action para registro
- [ ] Modificar `RegisterForm.tsx` - lógica completa
- [ ] Crear `frontend/app/portal/verify-email/page.tsx` - página de verificación
- [ ] Crear `frontend/app/actions/email-verification.ts` - actions para verificación

### Backend
- [ ] Crear DTO `CreateUserCommunityDto`
- [ ] Modificar `User.entity.ts` - agregar campos de verificación
- [ ] Crear migración de BD
- [ ] Modificar `UsersService` - método `createCommunityUser()`
- [ ] Modificar `AuthService` - método `register()`
- [ ] Modificar `AuthController` - endpoint POST `/auth/register`
- [ ] Modificar `MailService` - método `sendEmailVerification()`
- [ ] Crear template `email-verification.hbs`

### Testing
- [ ] Probar registro completo en portal
- [ ] Validar email recibido
- [ ] Verificar click en link funciona
- [ ] Comprobar login post-verificación
- [ ] Validar error si email duplicado

---

## 🔒 Consideraciones de Seguridad

1. **Hash de contraseña**: Ya existe en User entity con bcrypt
2. **Token de verificación**: JWT con expiración de 24 horas
3. **Validación de email**: Usar decorador `@IsEmail()`
4. **Rate limiting**: Considerar agregar más adelante
5. **SQL Injection**: TypeORM maneja esto automáticamente
6. **HTTPS**: En producción, siempre usar HTTPS

---

## 🚀 Orden de Implementación Recomendado

1. **Paso 1**: Crear DTOs y modificar entidades
2. **Paso 2**: Crear migración de BD
3. **Paso 3**: Implementar métodos en backend (service + controller)
4. **Paso 4**: Configurar email template
5. **Paso 5**: Crear server actions en frontend
6. **Paso 6**: Implementar UI en RegisterForm y LoginForm
7. **Paso 7**: Crear página de verificación
8. **Paso 8**: Testing end-to-end

---

## 📊 Diagrama de Estados

```
┌─────────────┐
│   CREATED   │  Usuario creado, email no verificado
└──────┬──────┘
       │ (click en link de email)
       ↓
┌─────────────────┐
│ EMAIL_VERIFIED  │  Usuario puede hacer login
└──────┬──────────┘
       │ (login con email + password)
       ↓
┌─────────────┐
│   LOGGED_IN │  Usuario en sesión
└─────────────┘
```

---

## 🛠️ Stack Tecnológico Utilizado

**Frontend**:
- Next.js 15.3.3
- React Server Actions
- NextAuth.js (para auth context)
- Alert hook personalizado

**Backend**:
- NestJS 11
- TypeORM
- Nodemailer + Mailer module
- JWT (JWE)
- bcrypt

**Base de Datos**:
- MySQL
- TypeORM Migrations

**Email**:
- Nodemailer/Gmail
- Handlebars templates
