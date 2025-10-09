# Person Entity - Backend Implementation

## Entity Structure

### Person Entity (`person.entity.ts`)

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
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Multimedia } from './multimedia.entity';

@Entity('people')
export class Person {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ unique: true, nullable: true })
  dni: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ type: 'date', nullable: true })
  verificationRequest: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // Relations
  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Multimedia)
  @JoinColumn({ name: 'dniCardFrontId' })
  dniCardFront: Multimedia;

  @ManyToOne(() => Multimedia)
  @JoinColumn({ name: 'dniCardRearId' })
  dniCardRear: Multimedia;
}
```

### Relationships

- **User** (One-to-One): Associated user account
- **Multimedia** (Many-to-One): Front of ID card (dniCardFront)
- **Multimedia** (Many-to-One): Back of ID card (dniCardRear)

### Database Table: `people`

## Service Characteristics

### PersonService (`person.service.ts`)

**Dependencies:**
- `Person` repository (TypeORM)

**Methods:**

#### `create(createPersonDto: CreatePersonDto): Promise<Person>`
Creates a new person record.

#### `findAll(): Promise<Person[]>`
Retrieves all non-deleted person records.

#### `findOne(id: string): Promise<Person>`
Retrieves a specific person by ID. Throws NotFoundException if not found.

#### `update(id: string, updatePersonDto: UpdatePersonDto): Promise<Person>`
Updates person information.

#### `softDelete(id: string): Promise<void>`
Soft deletes a person record.

#### `findByDni(dni: string): Promise<Person>`
Finds a person by DNI number.

#### `verifyPerson(id: string): Promise<Person>`
Marks a person as verified.

## Controller Characteristics

### PersonController (`person.controller.ts`)

**API Endpoints:**

#### `POST /person`
Creates a new person.
- **Body:** `CreatePersonDto`

#### `GET /person`
Retrieves all persons.

#### `GET /person/:id`
Retrieves a specific person by ID.

#### `PATCH /person/:id`
Updates a person.
- **Body:** `UpdatePersonDto`

#### `DELETE /person/:id`
Soft deletes a person.

#### `GET /person/dni/:dni`
Finds person by DNI.

#### `POST /person/:id/verify`
Verifies a person.

## DTOs

### CreatePersonDto
```typescript
{
  name?: string;
  dni?: string;
  address?: string;
  phone?: string;
  email?: string;
  userId?: string;
  dniCardFrontId?: string;
  dniCardRearId?: string;
}
```

### UpdatePersonDto
Similar to CreatePersonDto but all fields are optional.

## Business Logic

### Person Verification
- Persons can be marked as verified with a verification request date
- Verification status affects contract processing and document validation

### DNI Uniqueness
- DNI field is unique and nullable
- Used for person identification and duplicate prevention

### Multimedia Integration
- ID card front and back are stored as separate multimedia records
- Supports document verification processes

## Error Handling
- **NotFoundException**: Person not found
- **ConflictException**: DNI already exists

## Module Configuration

### PersonModule (`person.module.ts`)
```typescript
@Module({
  imports: [TypeOrmModule.forFeature([Person])],
  controllers: [PersonController],
  providers: [PersonService],
  exports: [PersonService],
})
```

**Dependencies:**
- TypeOrmModule for Person entity</content>
<parameter name="filePath">/Users/felipe/dev/realEstatePlatform/project/backEnd/backendImplementation/Person.md