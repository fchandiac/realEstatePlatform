# Property Entity - Backend Implementation

## Entity Structure

### Property Entity (`property.entity.ts`)

```typescript
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsUUID,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Min } from 'class-validator';
import { Type } from 'class-transformer';
import { User } from './user.entity';

export enum PropertyStatus {
  REQUEST = 'REQUEST',
  PRE_APPROVED = 'PRE-APPROVED',
  PUBLISHED = 'PUBLISHED',
  INACTIVE = 'INACTIVE',
  SOLD = 'SOLD',
  RENTED = 'RENTED',
}

export enum PropertyOperationType {
  SALE = 'SALE',
  RENT = 'RENT',
}

export enum PropertyType {
  HOUSE = 'HOUSE',
  APARTMENT = 'APARTMENT',
  OFFICE = 'OFFICE',
  COMMERCIAL = 'COMMERCIAL',
  LAND = 'LAND',
  WAREHOUSE = 'WAREHOUSE',
}

export class RegionCommune {
  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  communes?: string[];
}

export class MultimediaItem {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class PostRequest {
  @IsOptional()
  @IsString()
  origin?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  valuationAmount?: number;
}

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ nullable: true })
  zipCode?: string;

  @Column({ nullable: true })
  country?: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('int', { nullable: true })
  bedrooms?: number;

  @Column('int', { nullable: true })
  bathrooms?: number;

  @Column('int')
  area: number;

  @Column({
    type: 'enum',
    enum: PropertyType,
  })
  type: PropertyType;

  @Column({
    type: 'enum',
    enum: PropertyStatus,
    default: PropertyStatus.REQUEST,
  })
  status: PropertyStatus;

  @Column({
    type: 'enum',
    enum: PropertyOperationType,
  })
  operation: PropertyOperationType;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'creatorUserId' })
  creatorUser: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assignedAgentId' })
  assignedAgent?: User;

  @Column({ type: 'json', nullable: true })
  multimedia?: MultimediaItem[];

  @Column({ type: 'json', nullable: true })
  regionCommune?: RegionCommune;

  @Column({ type: 'json', nullable: true })
  postRequest?: PostRequest;

  @Column({ type: 'decimal', { precision: 10, scale: 7 }, nullable: true })
  latitude?: number;

  @Column({ type: 'decimal', { precision: 10, scale: 7 }, nullable: true })
  longitude?: number;

  @Column({ type: 'text', nullable: true })
  features?: string;

  @Column({ type: 'text', nullable: true })
  restrictions?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
```

### Enums

#### PropertyStatus
- `REQUEST`: Initial property request
- `PRE_APPROVED`: Property pre-approved
- `PUBLISHED`: Property published and available
- `INACTIVE`: Property inactive
- `SOLD`: Property sold
- `RENTED`: Property rented

#### PropertyOperationType
- `SALE`: Property for sale
- `RENT`: Property for rent

#### PropertyType
- `HOUSE`: Single family house
- `APARTMENT`: Apartment/condo
- `OFFICE`: Office space
- `COMMERCIAL`: Commercial property
- `LAND`: Land parcel
- `WAREHOUSE`: Warehouse/industrial

### Relationships

- **User (creatorUser)** (Many-to-One): User who created the property
- **User (assignedAgent)** (Many-to-One, optional): Agent assigned to the property

### Database Table: `properties`

## Service Characteristics

### PropertiesService (`properties.service.ts`)

**Dependencies:**
- `Property` repository (TypeORM)

**Module Imports:**
- None (basic CRUD operations)

**Methods:**

#### `create(createPropertyDto: CreatePropertyDto): Promise<Property>`
- Creates a new property listing
- Input: `CreatePropertyDto` with all property details
- Returns: Created Property entity

#### `findAll(): Promise<Property[]>`
- Retrieves all non-deleted properties
- Includes relations: creatorUser, assignedAgent
- Ordered by creation date (DESC)
- Returns: Array of Property entities

#### `findOne(id: string): Promise<Property>`
- Retrieves a specific property by ID
- Includes all relations
- Throws: `NotFoundException` if property not found or deleted
- Returns: Property entity

#### `update(id: string, updatePropertyDto: UpdatePropertyDto): Promise<Property>`
- Updates property information
- Input: Property ID and `UpdatePropertyDto` with optional fields
- Returns: Updated Property entity

#### `softDelete(id: string): Promise<void>`
- Soft deletes a property
- Input: Property ID

#### `findByCreator(creatorUserId: string): Promise<Property[]>`
- Finds properties created by a specific user
- Returns: Array of Property entities

#### `findByAgent(agentId: string): Promise<Property[]>`
- Finds properties assigned to a specific agent
- Returns: Array of Property entities

## Controller Characteristics

### PropertiesController (`properties.controller.ts`)

**Decorators:**
- `@Controller('properties')`

**Endpoints:**

#### `POST /properties`
- **Method:** `create()`
- **Body:** `CreatePropertyDto` (validated)
- **Response:** Created Property entity

#### `GET /properties`
- **Method:** `findAll()`
- **Response:** Array of Property entities with relations

#### `GET /properties/creator/:creatorUserId`
- **Method:** `findByCreator()`
- **Params:** `creatorUserId` (string)
- **Response:** Array of Property entities created by the user

#### `GET /properties/agent/:agentId`
- **Method:** `findByAgent()`
- **Params:** `agentId` (string)
- **Response:** Array of Property entities assigned to the agent

#### `GET /properties/:id`
- **Method:** `findOne()`
- **Params:** `id` (string)
- **Response:** Property entity with relations

#### `PATCH /properties/:id`
- **Method:** `update()`
- **Params:** `id` (string)
- **Body:** `UpdatePropertyDto` (validated)
- **Response:** Updated Property entity

#### `DELETE /properties/:id`
- **Method:** `softDelete()`
- **Params:** `id` (string)
- **Response:** void (204 No Content)

## DTOs

### CreatePropertyDto
```typescript
{
  code: string;
  title: string;
  description?: string;
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  type: PropertyType;
  status?: PropertyStatus;
  operation: PropertyOperationType;
  userId: string;
  creatorUserId: string;
  assignedAgentId?: string;
  multimedia?: MultimediaItem[];
  regionCommune?: RegionCommune;
  postRequest?: PostRequest;
  latitude?: number;
  longitude?: number;
  features?: string;
  restrictions?: string;
}
```

### UpdatePropertyDto
```typescript
{
  code?: string;
  title?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  type?: PropertyType;
  status?: PropertyStatus;
  operation?: PropertyOperationType;
  assignedAgentId?: string;
  multimedia?: MultimediaItem[];
  regionCommune?: RegionCommune;
  postRequest?: PostRequest;
  latitude?: number;
  longitude?: number;
  features?: string;
  restrictions?: string;
}
```

## Module Configuration

### PropertiesModule
- **Imports:** `TypeOrmModule.forFeature([Property])`
- **Controllers:** `PropertiesController`
- **Providers:** `PropertiesService`
- **Exports:** `PropertiesService`</content>
<parameter name="filePath">/Users/felipe/dev/realEstatePlatform/project/backEnd/backendImplementation/Property.md