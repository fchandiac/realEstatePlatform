# Contract Entity - Backend Implementation

## Entity Structure

### Contract Entity (`contract.entity.ts`)

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
import { User } from './user.entity';
import { Property } from './property.entity';

export enum ContractOperationType {
  COMPRAVENTA = 'COMPRAVENTA',
  ARRIENDO = 'ARRIENDO',
}

export enum ContractStatus {
  IN_PROCESS = 'IN_PROCESS',
  CLOSED = 'CLOSED',
  FAILED = 'FAILED',
  ON_HOLD = 'ON_HOLD',
}

export enum ContractRole {
  SELLER = 'SELLER',
  BUYER = 'BUYER',
  LANDLORD = 'LANDLORD',
  TENANT = 'TENANT',
  GUARANTOR = 'GUARANTOR',
  AGENT = 'AGENT',
}

export interface ContractPerson {
  personId: string;
  role: ContractRole;
}

export interface ContractPayment {
  amount: number;
  date: Date;
  description?: string;
}

export interface ContractDocument {
  documentTypeId: string;
  documentId?: string;
  required: boolean;
  uploaded: boolean;
}

@Entity('contracts')
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ContractOperationType,
  })
  operation: ContractOperationType;

  @Column({
    type: 'enum',
    enum: ContractStatus,
    default: ContractStatus.IN_PROCESS,
  })
  status: ContractStatus;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column('int')
  amount: number;

  @Column('float')
  commissionPercent: number;

  @Column('float')
  commissionAmount: number;

  @Column({ type: 'json', nullable: true })
  payments: ContractPayment[];

  @Column({ type: 'json', nullable: true })
  documents: ContractDocument[];

  @Column({ type: 'json' })
  people: ContractPerson[];

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Property)
  @JoinColumn({ name: 'propertyId' })
  property: Property;
}
```

### Enums and Interfaces

#### ContractOperationType
- `COMPRAVENTA`: Sales contract
- `ARRIENDO`: Rental contract

#### ContractStatus
- `IN_PROCESS`: Contract in progress (default)
- `CLOSED`: Contract successfully completed
- `FAILED`: Contract failed/terminated
- `ON_HOLD`: Contract on hold

#### ContractRole
- `SELLER`: Property seller
- `BUYER`: Property buyer
- `LANDLORD`: Property landlord
- `TENANT`: Property tenant
- `GUARANTOR`: Contract guarantor
- `AGENT`: Real estate agent

#### ContractPerson Interface
```typescript
{
  personId: string;
  role: ContractRole;
}
```

#### ContractPayment Interface
```typescript
{
  amount: number;
  date: Date;
  description?: string;
}
```

#### ContractDocument Interface
```typescript
{
  documentTypeId: string;
  documentId?: string;
  required: boolean;
  uploaded: boolean;
}
```

### Relationships

- **User** (Many-to-One): Contract creator/manager
- **Property** (Many-to-One): Associated property

### Database Table: `contracts`

## Service Characteristics

### ContractService (`contracts.service.ts`)

**Dependencies:**
- `Contract` repository (TypeORM)
- `DocumentTypesService` (for document validation)

**Module Imports:**
- `DocumentTypesModule` (for document type validation and upload)

**Methods:**

#### `create(createContractDto: CreateContractDto): Promise<Contract>`
Creates a new contract with IN_PROCESS status and calculates commission amount.

#### `findAll(): Promise<Contract[]>`
Retrieves all non-deleted contracts with user and property relations.

#### `findOne(id: string): Promise<Contract>`
Retrieves a specific contract by ID with relations. Throws NotFoundException if not found.

#### `update(id: string, updateContractDto: UpdateContractDto): Promise<Contract>`
Updates contract information, recalculating commission if percentage changes.

#### `softDelete(id: string): Promise<void>`
Soft deletes a contract by setting deletedAt timestamp.

#### `close(id: string, closeContractDto: CloseContractDto): Promise<Contract>`
Closes a contract after validating required roles and documents.

#### `fail(id: string, endDate: Date): Promise<Contract>`
Marks a contract as failed with end date.

#### `addPayment(id: string, addPaymentDto: AddPaymentDto): Promise<Contract>`
Adds a payment record to the contract.

#### `addPerson(id: string, addPersonDto: AddPersonDto): Promise<Contract>`
Adds a person with a specific role to the contract.

#### `getPeopleByRole(id: string, role: ContractRole): Promise<any[]>`
Retrieves all people with a specific role in the contract.

#### `validateRequiredRoles(contract: Contract): Promise<void>`
Validates that all required roles for the operation type are present.

#### `uploadContractDocument(file: Express.Multer.File, uploadContractDocumentDto: UploadContractDocumentDto): Promise<any>`
Uploads a document for the contract and updates the contract's document tracking.

## Controller Characteristics

### ContractsController (`contracts.controller.ts`)

**API Endpoints:**

#### `POST /contracts`
Creates a new contract.
- **Body:** `CreateContractDto`

#### `GET /contracts`
Retrieves all contracts.

#### `GET /contracts/:id`
Retrieves a specific contract by ID.

#### `PATCH /contracts/:id`
Updates a contract.
- **Body:** `UpdateContractDto`

#### `DELETE /contracts/:id`
Soft deletes a contract.

#### `POST /contracts/:id/close`
Closes a contract.
- **Body:** `CloseContractDto`

#### `POST /contracts/:id/fail`
Marks contract as failed.
- **Body:** `{ endDate: Date }`

#### `POST /contracts/:id/payments`
Adds a payment to the contract.
- **Body:** `AddPaymentDto`

#### `POST /contracts/:id/people`
Adds a person to the contract.
- **Body:** `AddPersonDto`

#### `GET /contracts/:id/people`
Retrieves people by role.
- **Query:** `role: ContractRole`

#### `POST /contracts/upload-document`
Uploads a document for a contract (multipart/form-data).
- **File:** `file`
- **Body:** `UploadContractDocumentDto`

## DTOs

### CreateContractDto
```typescript
{
  userId: string;
  propertyId: string;
  operation: ContractOperationType;
  amount: number;
  commissionPercent: number;
  commissionAmount: number;
  people: ContractPersonDto[];
  endDate?: string;
  payments?: ContractPaymentDto[];
  documents?: ContractDocumentDto[];
  description?: string;
}
```

### UpdateContractDto
Similar to CreateContractDto but all fields are optional.

### AddPaymentDto
```typescript
{
  amount: number;
  date: string;
  description?: string;
}
```

### AddPersonDto
```typescript
{
  personId: string;
  role: ContractRole;
}
```

### CloseContractDto
```typescript
{
  endDate: string;
  documents: ContractDocumentDto[];
}
```

### UploadContractDocumentDto
```typescript
{
  title: string;
  documentTypeId: string;
  contractId: string;
  uploadedById: string;
  notes?: string;
  seoTitle?: string;
}
```

## Business Logic

### Contract Lifecycle
1. **Creation**: Contract created with IN_PROCESS status
2. **Management**: People, payments, and documents added throughout process
3. **Validation**: Required roles and documents validated before closing
4. **Closure**: Contract marked as CLOSED or FAILED with end date

### Role Validation
- Sales contracts require SELLER and BUYER roles
- Rental contracts require LANDLORD and TENANT roles
- Additional roles (GUARANTOR, AGENT) are optional

### Document Management
- Documents are tracked by type and upload status
- Required documents must be uploaded before contract closure
- Integration with DocumentTypesService for upload handling

### Payment Tracking
- Payments stored as JSON array in contract
- Each payment includes amount, date, and optional description
- No automatic calculation of remaining amounts

## Error Handling
- **NotFoundException**: Contract not found
- **BadRequestException**: Invalid operations (closing already closed contract, missing required roles/documents)

## Module Configuration

### ContractsModule (`contracts.module.ts`)
```typescript
@Module({
  imports: [
    TypeOrmModule.forFeature([Contract]),
    DocumentTypesModule,
  ],
  controllers: [ContractsController],
  providers: [ContractsService],
  exports: [ContractsService],
})
```

**Dependencies:**
- TypeOrmModule for Contract entity
- DocumentTypesModule for document validation</content>
<parameter name="filePath">/Users/felipe/dev/realEstatePlatform/project/backEnd/backendImplementation/Contract.md