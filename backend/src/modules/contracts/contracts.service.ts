import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import {
  Contract,
  ContractOperationType,
  ContractStatus,
  ContractRole,
} from '../../entities/contract.entity';
import { Payment } from '../../entities/payment.entity';
import {
  CreateContractDto,
  UpdateContractDto,
  AddPaymentDto,
  AddPersonDto,
  CloseContractDto,
  UploadContractDocumentDto,
} from './dto/contract.dto';
import { DocumentTypesService } from '../document-types/document-types.service';
import { DocumentStatus } from '../../entities/document.entity';
import type { Express } from 'express';

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>,
    private readonly documentTypesService: DocumentTypesService,
  ) {}

  async create(createContractDto: CreateContractDto): Promise<Contract> {
    // Validate user and property exist (would be done with actual repositories)
    // For now, we'll assume they exist

    const contract = this.contractRepository.create({
      operation: createContractDto.operation,
      status: createContractDto.status || ContractStatus.IN_PROCESS,
      amount: createContractDto.amount,
      commissionPercent: createContractDto.commissionPercent,
      commissionAmount:
        createContractDto.amount * createContractDto.commissionPercent,
      description: createContractDto.description,
      people: createContractDto.people as any[],
      payments: createContractDto.payments as any[],
      documents: createContractDto.documents as any[],
      // set relations by id
      property: createContractDto.propertyId
        ? ({ id: createContractDto.propertyId } as any)
        : undefined,
      user: createContractDto.userId
        ? ({ id: createContractDto.userId } as any)
        : undefined,
    });

    return await this.contractRepository.save(contract);
  }

  async findAll(): Promise<Contract[]> {
    return await this.contractRepository.find({
      where: { deletedAt: IsNull() },
      relations: ['user', 'property'],
    });
  }

  async findOne(id: string): Promise<Contract> {
    const contract = await this.contractRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['user', 'property'],
    });

    if (!contract) {
      throw new NotFoundException('Contrato no encontrado');
    }

    return contract;
  }

  async update(
    id: string,
    updateContractDto: UpdateContractDto,
  ): Promise<Contract> {
    const contract = await this.findOne(id);

    Object.assign(contract, updateContractDto);
    return await this.contractRepository.save(contract);
  }

  async softDelete(id: string): Promise<void> {
    const contract = await this.findOne(id);
    await this.contractRepository.softDelete(id);
  }

  async close(
    id: string,
    closeContractDto: CloseContractDto,
  ): Promise<Contract> {
    const contract = await this.findOne(id);

    if (
      contract.status === ContractStatus.CLOSED ||
      contract.status === ContractStatus.FAILED
    ) {
      throw new BadRequestException('El contrato ya está cerrado o fallido');
    }

    // Validate required roles
    await this.validateRequiredRoles(contract);

    // Validate required documents are uploaded
    this.validateRequiredDocuments(contract, closeContractDto.documents);

    contract.status = ContractStatus.CLOSED;
    contract.endDate = new Date(closeContractDto.endDate);

    // Do not assign DTO documents directly to relation; documents should already be uploaded via uploadContractDocument
    return await this.contractRepository.save(contract);
  }

  async fail(id: string, endDate: Date): Promise<Contract> {
    const contract = await this.findOne(id);

    if (
      contract.status === ContractStatus.CLOSED ||
      contract.status === ContractStatus.FAILED
    ) {
      throw new BadRequestException('El contrato ya está cerrado o fallido');
    }

    // Mark as failed
    contract.status = ContractStatus.FAILED;
    contract.endDate = endDate;

    return await this.contractRepository.save(contract);
  }

  async addPayment(
    id: string,
    addPaymentDto: AddPaymentDto,
  ): Promise<Contract> {
    const contract = await this.findOne(id);

    const payment = {
      amount: addPaymentDto.amount,
      date: new Date(addPaymentDto.date),
      description: addPaymentDto.description,
    };

    if (!contract.payments) {
      contract.payments = [];
    }

    // create a Payment partial and push; cascade will persist it
    const paymentEntity: Partial<Payment> = {
      amount: payment.amount,
      date: payment.date,
      description: payment.description,
      contract: { id: contract.id } as any,
    };

    contract.payments.push(paymentEntity as Payment);
    return await this.contractRepository.save(contract);
  }

  async addPerson(id: string, addPersonDto: AddPersonDto): Promise<Contract> {
    const contract = await this.findOne(id);

    const person = {
      personId: addPersonDto.personId,
      role: addPersonDto.role,
    };

    if (!contract.people) {
      contract.people = [];
    }

    contract.people.push(person);
    return await this.contractRepository.save(contract);
  }

  async getPeopleByRole(id: string, role: ContractRole): Promise<any[]> {
    const contract = await this.findOne(id);
    return (contract.people || []).filter((person) => person.role === role);
  }

  async validateRequiredRoles(contract: Contract): Promise<void> {
    const requiredRoles = this.getRequiredRolesForOperation(
      contract.operation as any,
    );
    const existingRoles = (contract.people || []).map((person) => person.role);

    const missingRoles = requiredRoles.filter(
      (role) => !existingRoles.includes(role),
    );

    if (missingRoles.length > 0) {
      throw new BadRequestException(
        `Faltan roles obligatorios para este tipo de contrato: ${missingRoles.join(', ')}`,
      );
    }
  }

  private getRequiredRolesForOperation(
    operation: ContractOperationType,
  ): ContractRole[] {
    switch (operation) {
      case ContractOperationType.COMPRAVENTA:
        return [ContractRole.SELLER, ContractRole.BUYER];
      case ContractOperationType.ARRIENDO:
        return [ContractRole.LANDLORD, ContractRole.TENANT];
      default:
        return [];
    }
  }

  async uploadContractDocument(
    file: Express.Multer.File,
    uploadContractDocumentDto: UploadContractDocumentDto,
  ): Promise<any> {
    // Verificar que el contrato existe
    const contract = await this.findOne(uploadContractDocumentDto.contractId);

    // Verificar que el tipo de documento existe y está disponible
    const documentType = await this.documentTypesService.findOne(
      uploadContractDocumentDto.documentTypeId,
    );

    if (!documentType.available) {
      throw new BadRequestException(
        'El tipo de documento no está disponible para uso',
      );
    }

    // Subir el documento usando el servicio de tipos de documento
    const uploadResult = await this.documentTypesService.uploadDocument(file, {
      title: uploadContractDocumentDto.title,
      documentTypeId: uploadContractDocumentDto.documentTypeId,
      uploadedById: uploadContractDocumentDto.uploadedById,
      status: DocumentStatus.UPLOADED,
      notes: uploadContractDocumentDto.notes,
      seoTitle: uploadContractDocumentDto.seoTitle,
    });

    // Actualizar el contrato con el documento subido
    // Add the uploaded Document entity to the contract.documents relation
    contract.documents = contract.documents || [];

    const existingDoc = contract.documents.find(
      (d) => d.documentTypeId === uploadContractDocumentDto.documentTypeId,
    );

    if (!existingDoc) {
      contract.documents.push(uploadResult.document);
    }

    await this.contractRepository.save(contract);

    return {
      contract: contract,
      document: uploadResult.document,
      multimedia: uploadResult.multimedia,
    };
  }

  private validateRequiredDocuments(
    contract: Contract,
    documents: any[],
  ): void {
    const requiredDocuments = documents.filter((doc) => doc.required);
    const uploadedDocuments = documents.filter((doc) => doc.uploaded);

    if (requiredDocuments.length !== uploadedDocuments.length) {
      throw new BadRequestException(
        'Faltan documentos obligatorios para cerrar el contrato',
      );
    }
  }
}
