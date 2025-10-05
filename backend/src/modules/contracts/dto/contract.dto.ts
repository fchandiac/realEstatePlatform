import { IsNotEmpty, IsEnum, IsOptional, IsUUID, IsNumber, IsPositive, IsArray, IsObject, IsString, IsDateString, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ContractOperationType, ContractStatus, ContractRole, ContractPerson, ContractPayment, ContractDocument } from '../../../entities/contract.entity';

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

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsNumber()
  @IsPositive()
  commissionPercent: number;

  @IsNumber()
  @IsPositive()
  commissionAmount: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContractPersonDto)
  people: ContractPersonDto[];

  @IsDateString()
  @IsOptional()
  endDate?: string;

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

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateContractDto {
  @IsEnum(ContractStatus)
  @IsOptional()
  status?: ContractStatus;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  amount?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  commissionPercent?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  commissionAmount?: number;

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

  @IsString()
  @IsOptional()
  description?: string;
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