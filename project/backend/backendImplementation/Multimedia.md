# Multimedia Entity - Backend Implementation

## Entity Structure

### Multimedia Entity (`multimedia.entity.ts`)

```typescript
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export enum MultimediaFormat {
  IMG = 'IMG',
  VIDEO = 'VIDEO',
}

export enum MultimediaType {
  DNI_FRONT = 'DNI_FRONT',
  DNI_REAR = 'DNI_REAR',
  SLIDE = 'SLIDE',
  LOGO = 'LOGO',
  STAFF = 'STAFF',
  PROPERTY_IMG = 'PROPERTY_IMG',
  PROPERTY_VIDEO = 'PROPERTY_VIDEO',
  PARTNERSHIP = 'PARTNERSHIP',
  DOCUMENT = 'DOCUMENT',
  TESTIMONIAL_IMG = 'TESTIMONIAL_IMG',
}

@Entity('multimedia')
export class Multimedia {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: MultimediaFormat,
  })
  format: MultimediaFormat;

  @Column({
    type: 'enum',
    enum: MultimediaType,
  })
  type: MultimediaType;

  @Column()
  url: string;

  @Column({ nullable: true })
  seoTitle?: string;

  @Column()
  filename: string;

  @Column('int')
  fileSize: number;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  userId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
```

### Enums

#### MultimediaFormat
- `IMG`: Image files
- `VIDEO`: Video files

#### MultimediaType
- `DNI_FRONT`: Front of ID document
- `DNI_REAR`: Back of ID document
- `SLIDE`: Website slides/carousel images
- `LOGO`: Company logos
- `STAFF`: Staff member photos
- `PROPERTY_IMG`: Property images
- `PROPERTY_VIDEO`: Property videos
- `PARTNERSHIP`: Partnership/company logos
- `DOCUMENT`: General documents
- `TESTIMONIAL_IMG`: Testimonial images

### Database Table: `multimedia`

## Service Characteristics

### MultimediaService (CRUD) (`multimedia.service.ts`)

**Dependencies:**
- `Multimedia` repository (TypeORM)

**Methods:**

#### `create(createMultimediaDto: CreateMultimediaDto): Promise<Multimedia>`
Creates a new multimedia record.

#### `findAll(): Promise<Multimedia[]>`
Retrieves all non-deleted multimedia records.

#### `findOne(id: string): Promise<Multimedia>`
Retrieves a specific multimedia record by ID. Throws NotFoundException if not found.

#### `update(id: string, updateMultimediaDto: UpdateMultimediaDto): Promise<Multimedia>`
Updates multimedia information.

#### `softDelete(id: string): Promise<void>`
Soft deletes a multimedia record.

#### `getUrl(id: string): Promise<string>`
Returns the URL of a multimedia file.

#### `setSeoTitle(id: string, seoTitle: string): Promise<Multimedia>`
Updates the SEO title of a multimedia file.

### MultimediaService (Upload) (`services/multimedia.service.ts`)

**Dependencies:**
- `Multimedia` repository (TypeORM)
- `StaticFilesService` (for file system operations)

**Methods:**

#### `uploadFile(file: Express.Multer.File, metadata: MultimediaUploadMetadata, userId: string): Promise<Multimedia>`
Uploads a file to the server and creates a multimedia record.

#### `serveFile(filepath: string): Promise<Buffer>`
Serves a file from the upload directory.

#### `deleteFile(id: string): Promise<void>`
Deletes a file from both filesystem and database.

## Controller Characteristics

### MultimediaController (CRUD) (`multimedia.controller.ts`)

**API Endpoints:**

#### `POST /multimedia`
Creates a new multimedia record.
- **Body:** `CreateMultimediaDto`

#### `GET /multimedia`
Retrieves all multimedia records.

#### `GET /multimedia/:id`
Retrieves a specific multimedia record by ID.

#### `PATCH /multimedia/:id`
Updates a multimedia record.
- **Body:** `UpdateMultimediaDto`

#### `DELETE /multimedia/:id`
Soft deletes a multimedia record.

#### `GET /multimedia/:id/url`
Gets the URL of a multimedia file.

#### `PATCH /multimedia/:id/seo-title`
Updates the SEO title of a multimedia file.
- **Body:** `{ seoTitle: string }`

### MultimediaController (Upload) (`controllers/multimedia.controller.ts`)

**API Endpoints:**

#### `POST /multimedia/upload`
Uploads a file (multipart/form-data).
- **File:** `file`
- **Body:** `MultimediaUploadMetadata`

#### `GET /multimedia/*filepath`
Serves a file by filepath.

#### `DELETE /multimedia/:id`
Deletes a multimedia file and record.

## DTOs

### CreateMultimediaDto
```typescript
{
  format: MultimediaFormat;
  type: MultimediaType;
  url: string;
  seoTitle?: string;
  filename: string;
  fileSize: number;
}
```

### UpdateMultimediaDto
Similar to CreateMultimediaDto but all fields are optional.

### MultimediaUploadMetadata
```typescript
{
  type: string;
  seoTitle?: string;
  description?: string;
}
```

## File Storage Structure

The system organizes uploaded files in the following directory structure under `uploads/`:

```
uploads/
├── docs/
│   ├── dni/
│   │   ├── front/
│   │   └── rear/
├── web/
│   ├── slides/
│   ├── logos/
│   ├── staff/
│   ├── partnerships/
│   └── testimonials/
├── properties/
│   ├── images/
│   └── videos/
└── documents/
```

## File Naming Convention

Files are renamed upon upload using the pattern:
`{typePrefix}_{timestamp}_{randomString}.{extension}`

Example: `property-img_20231201_143052_A1B2C3D4.jpg`

## Business Logic

### File Upload Process
1. **Directory Creation**: Ensures upload directory exists
2. **Unique Naming**: Generates unique filename to prevent conflicts
3. **File Storage**: Saves file to filesystem
4. **Database Record**: Creates multimedia record with metadata
5. **Format Detection**: Automatically determines IMG/VIDEO based on MIME type

### File Serving
- Files are served through GET endpoints with filepath parameter
- Supports direct file access for web integration

### File Deletion
- Removes both filesystem file and database record
- Cascading cleanup ensures no orphaned files

## Error Handling
- **NotFoundException**: Multimedia record not found
- **HttpException**: File system errors (upload, serve, delete failures)

## Module Configuration

### MultimediaModule (`multimedia.module.ts`)
```typescript
@Module({
  imports: [TypeOrmModule.forFeature([Multimedia])],
  controllers: [MultimediaController, UploadMultimediaController],
  providers: [MultimediaService, UploadMultimediaService, StaticFilesService],
  exports: [MultimediaService, UploadMultimediaService],
})
```

**Dependencies:**
- TypeOrmModule for Multimedia entity
- StaticFilesService for file system operations</content>
<parameter name="filePath">/Users/felipe/dev/realEstatePlatform/project/backEnd/backendImplementation/Multimedia.md