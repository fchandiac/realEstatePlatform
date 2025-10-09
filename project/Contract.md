# Contract Entity Documentation

## Overview
The Contract entity manages real estate contracts in the platform, supporting both sales (COMPRAVENTA) and rental (ARRIENDO) operations. It handles contract lifecycle management, document tracking, payment recording, and role-based participant management.

## Entity Structure

### Contract Entity (`contract.entity.ts`)
```typescript
@Entity('contracts')
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  propertyId: string;

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
```typescript
export enum ContractOperationType {
  COMPRAVENTA = 'COMPRAVENTA', // Sales contract
  ARRIENDO = 'ARRIENDO',      // Rental contract
}
```

#### ContractStatus
```typescript
export enum ContractStatus {
  IN_PROCESS = 'IN_PROCESS', // Contract in progress
  CLOSED = 'CLOSED',         // Contract successfully completed
  FAILED = 'FAILED',         // Contract failed/terminated
  ON_HOLD = 'ON_HOLD',       // Contract on hold
}
```

#### ContractRole
```typescript
export enum ContractRole {
  SELLER = 'SELLER',     // Property seller
  BUYER = 'BUYER',       // Property buyer
  LANDLORD = 'LANDLORD', // Property landlord
  TENANT = 'TENANT',     // Property tenant
  GUARANTOR = 'GUARANTOR', // Contract guarantor
  AGENT = 'AGENT',       // Real estate agent
}
```

#### ContractPerson Interface
```typescript
export interface ContractPerson {
  personId: string;
  role: ContractRole;
}
```

#### ContractPayment Interface
```typescript
export interface ContractPayment {
  amount: number;
  date: Date;
  description?: string;
}
```

#### ContractDocument Interface
```typescript
export interface ContractDocument {
  documentTypeId: string;
  documentId?: string;
  required: boolean;
  uploaded: boolean;
}
```

## Service Layer

### ContractsService (`contracts.service.ts`)

#### Constructor Dependencies
- `contractRepository: Repository<Contract>`
- `documentTypesService: DocumentTypesService`

#### Core Methods

##### `create(createContractDto: CreateContractDto): Promise<Contract>`
Creates a new contract with IN_PROCESS status and calculates commission amount.

##### `findAll(): Promise<Contract[]>`
Retrieves all non-deleted contracts with user and property relations.

##### `findOne(id: string): Promise<Contract>`
Retrieves a specific contract by ID with relations. Throws NotFoundException if not found.

##### `update(id: string, updateContractDto: UpdateContractDto): Promise<Contract>`
Updates contract information, recalculating commission if percentage changes.

##### `softDelete(id: string): Promise<void>`
Soft deletes a contract by setting deletedAt timestamp.

##### `close(id: string, closeContractDto: CloseContractDto): Promise<Contract>`
Closes a contract after validating required roles and documents.

##### `fail(id: string, endDate: Date): Promise<Contract>`
Marks a contract as failed with end date.

##### `addPayment(id: string, addPaymentDto: AddPaymentDto): Promise<Contract>`
Adds a payment record to the contract.

##### `addPerson(id: string, addPersonDto: AddPersonDto): Promise<Contract>`
Adds a person with a specific role to the contract.

##### `getPeopleByRole(id: string, role: ContractRole): Promise<any[]>`
Retrieves all people with a specific role in the contract.

##### `validateRequiredRoles(contract: Contract): Promise<void>`
Validates that all required roles for the operation type are present.

##### `uploadContractDocument(file: Express.Multer.File, uploadContractDocumentDto: UploadContractDocumentDto): Promise<any>`
Uploads a document for the contract and updates the contract's document tracking.

#### Private Methods

##### `getRequiredRolesForOperation(operation: ContractOperationType): ContractRole[]`
Returns required roles based on operation type:
- COMPRAVENTA: [SELLER, BUYER]
- ARRIENDO: [LANDLORD, TENANT]

##### `validateRequiredDocuments(contract: Contract, documents: any[]): void`
Validates that all required documents are uploaded before closing contract.

## Controller Layer

### ContractsController (`contracts.controller.ts`)

#### Endpoints

##### `POST /contracts`
Creates a new contract.
- Body: `CreateContractDto`

##### `GET /contracts`
Retrieves all contracts.

##### `GET /contracts/:id`
Retrieves a specific contract by ID.

##### `PATCH /contracts/:id`
Updates a contract.
- Body: `UpdateContractDto`

##### `DELETE /contracts/:id`
Soft deletes a contract.

##### `POST /contracts/:id/close`
Closes a contract.
- Body: `CloseContractDto`

##### `POST /contracts/:id/fail`
Marks contract as failed.
- Body: `{ endDate: Date }`

##### `POST /contracts/:id/payments`
Adds a payment to the contract.
- Body: `AddPaymentDto`

##### `POST /contracts/:id/people`
Adds a person to the contract.
- Body: `AddPersonDto`

##### `GET /contracts/:id/people`
Retrieves people by role.
- Query: `role: ContractRole`

##### `POST /contracts/:id/validate-roles`
Validates required roles for the contract.

##### `POST /contracts/upload-document`
Uploads a document for a contract (multipart/form-data).
- File: `file`
- Body: `UploadContractDocumentDto`

## DTOs

### CreateContractDto
```typescript
export class CreateContractDto {
  @IsUUID() @IsNotEmpty() userId: string;
  @IsUUID() @IsNotEmpty() propertyId: string;
  @IsEnum(ContractOperationType) @IsNotEmpty() operation: ContractOperationType;
  @IsNumber() @IsPositive() amount: number;
  @IsNumber() @IsPositive() commissionPercent: number;
  @IsNumber() @IsPositive() commissionAmount: number;
  @IsArray() @ValidateNested({ each: true }) @Type(() => ContractPersonDto) people: ContractPersonDto[];
  @IsDateString() @IsOptional() endDate?: string;
  @IsArray() @ValidateNested({ each: true }) @Type(() => ContractPaymentDto) @IsOptional() payments?: ContractPaymentDto[];
  @IsArray() @ValidateNested({ each: true }) @Type(() => ContractDocumentDto) @IsOptional() documents?: ContractDocumentDto[];
  @IsString() @IsOptional() description?: string;
}
```

### UpdateContractDto
Similar to CreateContractDto but all fields are optional.

### AddPaymentDto
```typescript
export class AddPaymentDto {
  @IsNumber() @IsPositive() amount: number;
  @IsDateString() date: string;
  @IsString() @IsOptional() description?: string;
}
```

### AddPersonDto
```typescript
export class AddPersonDto {
  @IsUUID() @IsNotEmpty() personId: string;
  @IsEnum(ContractRole) @IsNotEmpty() role: ContractRole;
}
```

### CloseContractDto
```typescript
export class CloseContractDto {
  @IsDateString() endDate: string;
  @IsArray() @ValidateNested({ each: true }) @Type(() => ContractDocumentDto) documents: ContractDocumentDto[];
}
```

### UploadContractDocumentDto
```typescript
export class UploadContractDocumentDto {
  @IsNotEmpty() @IsString() title: string;
  @IsNotEmpty() @IsUUID() documentTypeId: string;
  @IsNotEmpty() @IsUUID() contractId: string;
  @IsNotEmpty() @IsUUID() uploadedById: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsString() seoTitle?: string;
}
```

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
export class ContractsModule {}
```

### Dependencies
- **TypeOrmModule**: For Contract entity repository
- **DocumentTypesModule**: For document type validation and upload functionality

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

## Relations
- **User**: Contract creator/manager (ManyToOne)
- **Property**: Associated property (ManyToOne)
- **Documents**: Referenced through document IDs (JSON field)
- **People**: Referenced through person IDs (JSON field)</content>
<parameter name="filePath">/Users/felipe/dev/realEstatePlatform/project/Contract.md