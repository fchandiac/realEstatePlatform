# Multimedia Entity Documentation

## Overview
The Multimedia entity manages file uploads and storage for the real estate platform. It supports various file types including images and videos, organized by specific categories for different platform features like property images, documents, staff photos, and web assets.

## Entity Structure

### Multimedia Entity (`multimedia.entity.ts`)
```typescript
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
```typescript
export enum MultimediaFormat {
  IMG = 'IMG',    // Image files
  VIDEO = 'VIDEO', // Video files
}
```

#### MultimediaType
```typescript
export enum MultimediaType {
  DNI_FRONT = 'DNI_FRONT',           // Front of ID document
  DNI_REAR = 'DNI_REAR',             // Back of ID document
  SLIDE = 'SLIDE',                   // Website slides/carousel images
  LOGO = 'LOGO',                     // Company logos
  STAFF = 'STAFF',                   // Staff member photos
  PROPERTY_IMG = 'PROPERTY_IMG',     // Property images
  PROPERTY_VIDEO = 'PROPERTY_VIDEO', // Property videos
  PARTNERSHIP = 'PARTNERSHIP',       // Partnership/company logos
  DOCUMENT = 'DOCUMENT',             // General documents
  TESTIMONIAL_IMG = 'TESTIMONIAL_IMG', // Testimonial images
}
```

## Service Layer

### MultimediaService (CRUD) (`multimedia.service.ts`)

#### Constructor Dependencies
- `multimediaRepository: Repository<Multimedia>`

#### Core Methods

##### `create(createMultimediaDto: CreateMultimediaDto): Promise<Multimedia>`
Creates a new multimedia record.

##### `findAll(): Promise<Multimedia[]>`
Retrieves all non-deleted multimedia records.

##### `findOne(id: string): Promise<Multimedia>`
Retrieves a specific multimedia record by ID. Throws NotFoundException if not found.

##### `update(id: string, updateMultimediaDto: UpdateMultimediaDto): Promise<Multimedia>`
Updates multimedia information.

##### `softDelete(id: string): Promise<void>`
Soft deletes a multimedia record.

##### `getUrl(id: string): Promise<string>`
Returns the URL of a multimedia file.

##### `setSeoTitle(id: string, seoTitle: string): Promise<Multimedia>`
Updates the SEO title of a multimedia file.

### MultimediaService (Upload) (`services/multimedia.service.ts`)

#### Constructor Dependencies
- `multimediaRepository: Repository<Multimedia>`
- `staticFilesService: StaticFilesService`

#### Core Methods

##### `uploadFile(file: Express.Multer.File, metadata: MultimediaUploadMetadata, userId: string): Promise<Multimedia>`
Uploads a file to the server and creates a multimedia record.

##### `serveFile(filepath: string): Promise<Buffer>`
Serves a file from the upload directory.

##### `deleteFile(id: string): Promise<void>`
Deletes a file from both filesystem and database.

#### Private Methods

##### `initializeUploadDirectories(): Promise<void>`
Creates necessary upload directories for different multimedia types.

##### `getUploadPath(type: MultimediaType): string`
Returns the upload path based on multimedia type:
- DNI_FRONT: 'docs/dni/front'
- DNI_REAR: 'docs/dni/rear'
- SLIDE: 'web/slides'
- LOGO: 'web/logos'
- STAFF: 'web/staff'
- PARTNERSHIP: 'web/partnerships'
- PROPERTY_IMG: 'properties/images'
- PROPERTY_VIDEO: 'properties/videos'
- TESTIMONIAL_IMG: 'web/testimonials'
- DOCUMENT: 'documents'

##### `generateUniqueFilename(originalName: string, type: MultimediaType): string`
Generates a unique filename with format: `{typePrefix}_{timestamp}_{randomString}.{extension}`

##### `getFormatFromMimeType(mimeType: string): MultimediaFormat`
Determines format (IMG/VIDEO) based on MIME type.

## Controller Layer

### MultimediaController (CRUD) (`multimedia.controller.ts`)

#### Endpoints

##### `POST /multimedia`
Creates a new multimedia record.
- Body: `CreateMultimediaDto`

##### `GET /multimedia`
Retrieves all multimedia records.

##### `GET /multimedia/:id`
Retrieves a specific multimedia record by ID.

##### `PATCH /multimedia/:id`
Updates a multimedia record.
- Body: `UpdateMultimediaDto`

##### `DELETE /multimedia/:id`
Soft deletes a multimedia record.

##### `GET /multimedia/:id/url`
Gets the URL of a multimedia file.

##### `PATCH /multimedia/:id/seo-title`
Updates the SEO title of a multimedia file.
- Body: `{ seoTitle: string }`

### MultimediaController (Upload) (`controllers/multimedia.controller.ts`)

#### Endpoints

##### `POST /multimedia/upload`
Uploads a file (multipart/form-data).
- File: `file`
- Body: `MultimediaUploadMetadata`

##### `GET /multimedia/*filepath`
Serves a file by filepath.

##### `DELETE /multimedia/:id`
Deletes a multimedia file and record.

## DTOs

### CreateMultimediaDto
```typescript
export class CreateMultimediaDto {
  @IsEnum(MultimediaFormat) @IsNotEmpty() format: MultimediaFormat;
  @IsEnum(MultimediaType) @IsNotEmpty() type: MultimediaType;
  @IsUrl() @IsNotEmpty() url: string;
  @IsString() @IsOptional() seoTitle?: string;
  @IsString() @IsNotEmpty() filename: string;
  @IsNumber() @IsPositive() @IsNotEmpty() fileSize: number;
}
```

### UpdateMultimediaDto
Similar to CreateMultimediaDto but all fields are optional.

## Interfaces

### MultimediaUploadMetadata
```typescript
export interface MultimediaUploadMetadata {
  type: string;
  seoTitle?: string;
  description?: string;
}
```

### MultimediaResponse
```typescript
export interface MultimediaResponse {
  id: string;
  format: MultimediaFormat;
  type: MultimediaType;
  url: string;
  filename: string;
  fileSize: number;
  seoTitle?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Module Configuration

### MultimediaModule (`multimedia.module.ts`)
```typescript
@Module({
  imports: [TypeOrmModule.forFeature([Multimedia])],
  controllers: [MultimediaController, UploadMultimediaController],
  providers: [MultimediaService, UploadMultimediaService, StaticFilesService],
  exports: [MultimediaService, UploadMultimediaService],
})
export class MultimediaModule {}
```

### Dependencies
- **TypeOrmModule**: For Multimedia entity repository
- **StaticFilesService**: For file system operations

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
`{typePrefix}_{YYYYMMDD_HHMMSS}_{randomString}.{extension}`

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

## Security Considerations
- Files are stored in organized directories based on type
- Unique filenames prevent enumeration attacks
- User association through userId field
- Soft delete allows recovery of accidentally deleted files</content>
<parameter name="filePath">/Users/felipe/dev/realEstatePlatform/project/Multimedia.md