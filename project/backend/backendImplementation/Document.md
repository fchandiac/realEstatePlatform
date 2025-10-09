# Document Entity - Backend Implementation

## Entity Structure

### Document Entity (`document.entity.ts`)

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
import { DocumentType } from './document-type.entity';
import { Multimedia } from './multimedia.entity';
import { User } from './user.entity';

export enum DocumentStatus {
  PENDING = 'PENDING',
  UPLOADED = 'UPLOADED',
  RECIBIDO = 'RECIBIDO',
  REJECTED = 'REJECTED',
}

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;  // Document title

  @ManyToOne(() => DocumentType)
  @JoinColumn({ name: 'documentTypeId' })
  documentType: DocumentType;

  @ManyToOne(() => Multimedia, { nullable: true })
  @JoinColumn({ name: 'multimediaId' })
  multimedia?: Multimedia;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'uploadedById' })
  uploadedBy: User;

  @Column({
    type: 'enum',
    enum: DocumentStatus,
    default: DocumentStatus.PENDING,
  })
  status: DocumentStatus;

  @Column({ nullable: true })
  notes?: string;  // Additional notes

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
```

### Relationships

- **DocumentType** (Many-to-One): References the type of document
- **Multimedia** (Many-to-One, optional): References the uploaded file/multimedia
- **User** (Many-to-One): References the user who uploaded the document

### Database Table: `documents`

## Service Characteristics

### DocumentService (`document.service.ts`)

**Dependencies:**
- `Document` repository (TypeORM)
- `MultimediaService` (imported from MultimediaModule)

**Module Imports:**
- `MultimediaModule` (for file upload functionality)

**Methods:**

#### `create(createDocumentDto: CreateDocumentDto): Promise<Document>`
- Creates a new document record
- Input: `CreateDocumentDto` with title, documentTypeId, multimediaId, uploadedById, status, notes
- Returns: Created Document entity

#### `findAll(): Promise<Document[]>`
- Retrieves all non-deleted documents
- Includes relations: documentType, multimedia, uploadedBy
- Returns: Array of Document entities

#### `findOne(id: string): Promise<Document>`
- Retrieves a specific document by ID
- Includes all relations
- Throws: `NotFoundException` if document not found or deleted
- Returns: Document entity

#### `update(id: string, updateDocumentDto: UpdateDocumentDto): Promise<Document>`
- Updates an existing document
- Input: Document ID and `UpdateDocumentDto` with optional fields
- Returns: Updated Document entity

#### `softDelete(id: string): Promise<void>`
- Soft deletes a document (sets deletedAt timestamp)
- Input: Document ID

#### `uploadDocument(file: Express.Multer.File, uploadDocumentDto: UploadDocumentDto): Promise<Document>`
- Handles file upload and document creation
- Uses `MultimediaService.uploadFile()` to store the file
- Creates document with UPLOADED status
- Returns: Created Document with multimedia reference

## Controller Characteristics

### DocumentController (`document.controller.ts`)

**Decorators:**
- `@ApiTags('document')`
- `@Controller('document')`

**Endpoints:**

#### `POST /document`
- **Method:** `create()`
- **Body:** `CreateDocumentDto` (validated with ValidationPipe)
- **Response:** Created Document entity

#### `GET /document`
- **Method:** `findAll()`
- **Response:** Array of Document entities with relations

#### `GET /document/:id`
- **Method:** `findOne()`
- **Params:** `id` (string)
- **Response:** Document entity with relations

#### `PATCH /document/:id`
- **Method:** `update()`
- **Params:** `id` (string)
- **Body:** `UpdateDocumentDto` (validated with ValidationPipe)
- **Response:** Updated Document entity

#### `DELETE /document/:id`
- **Method:** `softDelete()`
- **Params:** `id` (string)
- **Response:** void (204 No Content)

#### `POST /document/upload`
- **Method:** `uploadDocument()`
- **Interceptors:** `FileInterceptor('file')`
- **Consumes:** `multipart/form-data`
- **Body:** `UploadDocumentDto` + uploaded file
- **ApiBody:** Documented schema for Swagger
- **Response:** Created Document with multimedia

## DTOs

### CreateDocumentDto
```typescript
{
  title: string;
  documentTypeId: string; // UUID
  multimediaId?: string; // UUID, optional
  uploadedById: string; // UUID
  status?: DocumentStatus;
  notes?: string;
}
```

### UpdateDocumentDto
```typescript
{
  title?: string;
  documentTypeId?: string; // UUID
  multimediaId?: string; // UUID
  uploadedById?: string; // UUID
  status?: DocumentStatus;
  notes?: string;
}
```

### UploadDocumentDto
```typescript
{
  title: string;
  documentTypeId: string; // UUID
  uploadedById: string; // UUID
  status?: DocumentStatus;
  notes?: string;
  seoTitle?: string;
}
```

## Module Configuration

### DocumentModule
- **Imports:** `TypeOrmModule.forFeature([Document])`, `MultimediaModule`
- **Controllers:** `DocumentController`
- **Providers:** `DocumentService`
- **Exports:** `DocumentService`</content>
<parameter name="filePath">/Users/felipe/dev/realEstatePlatform/project/backEnd/backendImplementation/Document.md