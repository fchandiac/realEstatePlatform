# Testimonial Entity - Backend Implementation

## Entity Structure

### Testimonial Entity (`testimonial.entity.ts`)

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
import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';
import { Multimedia } from './multimedia.entity';

@Entity('testimonials')
export class Testimonial {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  @IsNotEmpty()
  @IsString()
  text: string;

  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ManyToOne(() => Multimedia, { nullable: true })
  @JoinColumn({ name: 'multimediaId' })
  multimedia?: Multimedia;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
```

### Relationships

- **Multimedia** (Many-to-One, optional): Associated image for the testimonial

### Database Table: `testimonials`

## Service Characteristics

### TestimonialService (`testimonial.service.ts`)

**Dependencies:**
- `Testimonial` repository (TypeORM)

**Methods:**

#### `create(createTestimonialDto: CreateTestimonialDto): Promise<Testimonial>`
Creates a new testimonial.

#### `findAll(): Promise<Testimonial[]>`
Retrieves all non-deleted testimonials.

#### `findOne(id: string): Promise<Testimonial>`
Retrieves a specific testimonial by ID. Throws NotFoundException if not found.

#### `update(id: string, updateTestimonialDto: UpdateTestimonialDto): Promise<Testimonial>`
Updates testimonial information.

#### `softDelete(id: string): Promise<void>`
Soft deletes a testimonial.

#### `findPublished(): Promise<Testimonial[]>`
Retrieves only published testimonials.

#### `togglePublish(id: string): Promise<Testimonial>`
Toggles the published status of a testimonial.

## Controller Characteristics

### TestimonialController (`testimonial.controller.ts`)

**API Endpoints:**

#### `POST /testimonial`
Creates a new testimonial.
- **Body:** `CreateTestimonialDto`

#### `GET /testimonial`
Retrieves all testimonials.

#### `GET /testimonial/:id`
Retrieves a specific testimonial by ID.

#### `PATCH /testimonial/:id`
Updates a testimonial.
- **Body:** `UpdateTestimonialDto`

#### `DELETE /testimonial/:id`
Soft deletes a testimonial.

#### `GET /testimonial/published`
Retrieves published testimonials.

#### `POST /testimonial/:id/toggle-publish`
Toggles publish status.

## DTOs

### CreateTestimonialDto
```typescript
{
  text: string;
  name: string;
  multimediaId?: string;
}
```

### UpdateTestimonialDto
Similar to CreateTestimonialDto but all fields are optional.

## Business Logic

### Content Management
- Testimonials include customer text and name
- Optional multimedia support for customer photos
- Soft delete for content management

### Publishing Workflow
- Testimonials can be toggled between published/draft states
- Separate endpoints for public vs admin access

### Validation
- Text and name are required fields
- Multimedia is optional for visual testimonials

## Error Handling
- **NotFoundException**: Testimonial not found
- **Validation errors**: Missing required fields

## Module Configuration

### TestimonialModule (`testimonial.module.ts`)
```typescript
@Module({
  imports: [TypeOrmModule.forFeature([Testimonial])],
  controllers: [TestimonialController],
  providers: [TestimonialService],
  exports: [TestimonialService],
})
```

**Dependencies:**
- TypeOrmModule for Testimonial entity</content>
<parameter name="filePath">/Users/felipe/dev/realEstatePlatform/project/backEnd/backendImplementation/Testimonial.md