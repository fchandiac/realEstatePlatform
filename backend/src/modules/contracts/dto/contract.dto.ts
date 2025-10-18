import {
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsUUID,
  IsNumber,
  IsPositive,
  IsArray,
  IsObject,
  IsString,
  IsDateString,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ContractOperationType,
  ContractStatus,
  ContractRole,
  ContractPerson,
} from '../../../entities/contract.entity';

export class ContractPersonDto {
  @IsUUID()
  @IsNotEmpty()
  personId: string;

  @IsEnum(ContractRole)
  @IsNotEmpty()
  role: ContractRole;
}

export class ContractPaymentDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsDateString()
  date: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class ContractDocumentDto {
  @IsUUID()
  @IsNotEmpty()
  documentTypeId: string;

  @IsUUID()
  @IsOptional()
  documentId?: string;

  @IsBoolean()
  required: boolean;

  @IsBoolean()
  uploaded: boolean;
}

export class CreateContractDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  propertyId: string;

  @IsEnum(ContractOperationType)
  @IsNotEmpty()
  operation: ContractOperationType;

  @IsEnum(ContractStatus)
  @IsOptional()
  status?: ContractStatus;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsNumber()
  @IsPositive()
  commissionPercent: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContractPersonDto)
  people: ContractPersonDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContractPaymentDto)
  @IsOptional()
  payments?: ContractPaymentDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContractDocumentDto)
  @IsOptional()
  documents?: ContractDocumentDto[];
}

export class UpdateContractDto {
  @IsEnum(ContractStatus)
  @IsOptional()
  status?: ContractStatus;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContractPersonDto)
  @IsOptional()
  people?: ContractPersonDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContractPaymentDto)
  @IsOptional()
  payments?: ContractPaymentDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContractDocumentDto)
  @IsOptional()
  documents?: ContractDocumentDto[];
}

export class AddPaymentDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsDateString()
  date: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class AddPersonDto {
  @IsUUID()
  @IsNotEmpty()
  personId: string;

  @IsEnum(ContractRole)
  @IsNotEmpty()
  role: ContractRole;
}

export class CloseContractDto {
  @IsDateString()
  endDate: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContractDocumentDto)
  documents: ContractDocumentDto[];
}

export class UploadContractDocumentDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsUUID()
  documentTypeId: string;

  @IsNotEmpty()
  @IsUUID()
  contractId: string;

  @IsNotEmpty()
  @IsUUID()
  uploadedById: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  seoTitle?: string;
}
