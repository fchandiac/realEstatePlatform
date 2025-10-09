# User Entity - Backend Implementation

## Entity Structure

### User Entity (`user.entity.ts`)

```typescript
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import * as bcrypt from 'bcrypt';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  VACATION = 'VACATION',
  LEAVE = 'LEAVE',
}

export enum UserRole {
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
  AGENT = 'AGENT',
  COMMUNITY = 'COMMUNITY',
}

export enum Permission {
  MANAGE_USERS = 'MANAGE_USERS',
  MANAGE_AGENTS = 'MANAGE_AGENTS',
  MANAGE_ADMINS = 'MANAGE_ADMINS',
  MANAGE_PROPERTIES = 'MANAGE_PROPERTIES',
  ASSIGN_PROPERTY_AGENT = 'ASSIGN_PROPERTY_AGENT',
  MANAGE_CONTRACTS = 'MANAGE_CONTRACTS',
  MANAGE_NOTIFICATIONS = 'MANAGE_NOTIFICATIONS',
  MANAGE_MULTIMEDIA = 'MANAGE_MULTIMEDIA',
  MANAGE_DOCUMENT_TYPES = 'MANAGE_DOCUMENT_TYPES',
  MANAGE_PROPERTY_TYPES = 'MANAGE_PROPERTY_TYPES',
  MANAGE_ARTICLES = 'MANAGE_ARTICLES',
  MANAGE_TESTIMONIALS = 'MANAGE_TESTIMONIALS',
  VIEW_REPORTS = 'VIEW_REPORTS',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.AGENT,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column('simple-array', { nullable: true })
  permissions: Permission[];

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  lastLogin?: Date;

  @Column({ nullable: true })
  setPassword?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // Instance methods
  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

  async setPasswordHash(password: string): Promise<void> {
    this.password = await bcrypt.hash(password, 10);
  }
}
```

### Enums

#### UserStatus
- `ACTIVE`: User is active and can use the system
- `INACTIVE`: User is deactivated
- `VACATION`: User is on vacation
- `LEAVE`: User is on leave

#### UserRole
- `SUPERADMIN`: Super administrator with all permissions
- `ADMIN`: Administrator with management permissions
- `AGENT`: Real estate agent
- `COMMUNITY`: Community user with limited access

#### Permission
- `MANAGE_USERS`: Can manage user accounts
- `MANAGE_AGENTS`: Can manage agents
- `MANAGE_ADMINS`: Can manage administrators
- `MANAGE_PROPERTIES`: Can manage properties
- `ASSIGN_PROPERTY_AGENT`: Can assign agents to properties
- `MANAGE_CONTRACTS`: Can manage contracts
- `MANAGE_NOTIFICATIONS`: Can manage notifications
- `MANAGE_MULTIMEDIA`: Can manage multimedia files
- `MANAGE_DOCUMENT_TYPES`: Can manage document types
- `MANAGE_PROPERTY_TYPES`: Can manage property types
- `MANAGE_ARTICLES`: Can manage articles/blog posts
- `MANAGE_TESTIMONIALS`: Can manage testimonials
- `VIEW_REPORTS`: Can view reports
- `SUPER_ADMIN`: Super administrator permission

### Database Table: `users`

## Service Characteristics

### UsersService (`users.service.ts`)

**Dependencies:**
- `User` repository (TypeORM)
- `AuditService` (for logging user actions)

**Module Imports:**
- `AuditModule` (for audit logging)

**Methods:**

#### `create(createUserDto: CreateUserDto): Promise<User>`
- Creates a new user account
- Validates unique username and email
- Hashes password using bcrypt
- Logs creation in audit trail
- Returns: Created User entity (password excluded from response)

#### `login(loginDto: LoginDto): Promise<{ user: User; token: string }>`
- Authenticates user credentials
- Validates password using bcrypt
- Updates last login timestamp
- Generates JWT token
- Returns: User data and authentication token

#### `findAll(): Promise<User[]>`
- Retrieves all non-deleted users
- Returns: Array of User entities

#### `findOne(id: string): Promise<User>`
- Retrieves a specific user by ID
- Throws: `NotFoundException` if user not found
- Returns: User entity

#### `update(id: string, updateUserDto: UpdateUserDto): Promise<User>`
- Updates user information
- Handles password changes with hashing
- Logs updates in audit trail
- Returns: Updated User entity

#### `softDelete(id: string): Promise<void>`
- Soft deletes a user account
- Logs deletion in audit trail

#### `changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<void>`
- Changes user password
- Validates current password
- Hashes new password

#### `assignRole(id: string, assignRoleDto: AssignRoleDto): Promise<User>`
- Assigns a role to a user
- Updates user permissions based on role
- Logs role assignment

#### `updatePermissions(id: string, updatePermissionsDto: UpdatePermissionsDto): Promise<User>`
- Updates user permissions directly
- Validates permission assignments

#### `findByUsername(username: string): Promise<User>`
- Finds user by username
- Used internally for authentication

#### `findByEmail(email: string): Promise<User>`
- Finds user by email
- Used for password recovery, etc.

## Controller Characteristics

### UsersController (`users.controller.ts`)

**Decorators:**
- `@Controller('users')`

**Endpoints:**

#### `POST /users`
- **Method:** `create()`
- **Body:** `CreateUserDto` (validated)
- **Response:** Created User entity (password excluded)

#### `POST /users/login`
- **Method:** `login()`
- **Body:** `LoginDto` (validated)
- **Response:** User data and JWT token

#### `GET /users`
- **Method:** `findAll()`
- **Response:** Array of User entities

#### `GET /users/:id`
- **Method:** `findOne()`
- **Params:** `id` (string)
- **Response:** User entity

#### `PATCH /users/:id`
- **Method:** `update()`
- **Params:** `id` (string)
- **Body:** `UpdateUserDto` (validated)
- **Response:** Updated User entity

#### `DELETE /users/:id`
- **Method:** `softDelete()`
- **Params:** `id` (string)
- **Response:** void (204 No Content)

#### `POST /users/:id/change-password`
- **Method:** `changePassword()`
- **Params:** `id` (string)
- **Body:** `ChangePasswordDto` (validated)
- **Response:** void (204 No Content)

#### `POST /users/:id/assign-role`
- **Method:** `assignRole()`
- **Params:** `id` (string)
- **Body:** `AssignRoleDto` (validated)
- **Response:** Updated User entity

#### `PATCH /users/:id/permissions`
- **Method:** `updatePermissions()`
- **Params:** `id` (string)
- **Body:** `UpdatePermissionsDto` (validated)
- **Response:** Updated User entity

## DTOs

### CreateUserDto
```typescript
{
  username: string;
  email: string;
  password: string;
  role?: UserRole;
  status?: UserStatus;
  permissions?: Permission[];
  firstName?: string;
  lastName?: string;
  phone?: string;
}
```

### UpdateUserDto
```typescript
{
  username?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  status?: UserStatus;
  permissions?: Permission[];
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
}
```

### LoginDto
```typescript
{
  username: string;
  password: string;
}
```

### ChangePasswordDto
```typescript
{
  currentPassword: string;
  newPassword: string;
}
```

### AssignRoleDto
```typescript
{
  role: UserRole;
}
```

### UpdatePermissionsDto
```typescript
{
  permissions: Permission[];
}
```

## Module Configuration

### UsersModule
- **Imports:** `TypeOrmModule.forFeature([User])`, `AuditModule`
- **Controllers:** `UsersController`
- **Providers:** `UsersService`
- **Exports:** `UsersService`</content>
<parameter name="filePath">/Users/felipe/dev/realEstatePlatform/project/backEnd/backendImplementation/User.md