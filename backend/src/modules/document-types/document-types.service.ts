import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { DocumentType } from '../../entities/document-type.entity';
import { CreateDocumentTypeDto, UpdateDocumentTypeDto } from './dto/document-type.dto';

@Injectable()
export class DocumentTypesService {
  constructor(
    @InjectRepository(DocumentType)
    private readonly documentTypeRepository: Repository<DocumentType>,
  ) {}

  async create(createDocumentTypeDto: CreateDocumentTypeDto): Promise<DocumentType> {
    // Check if name already exists
    const existingDocumentType = await this.documentTypeRepository.findOne({
      where: { name: createDocumentTypeDto.name, deletedAt: IsNull() }
    });
    if (existingDocumentType) {
      throw new ConflictException('El nombre del tipo de documento ya está registrado');
    }

    const documentType = this.documentTypeRepository.create({
      ...createDocumentTypeDto,
      available: createDocumentTypeDto.available ?? true,
    });
    return await this.documentTypeRepository.save(documentType);
  }

  async findAll(): Promise<DocumentType[]> {
    return await this.documentTypeRepository.find({
      where: { deletedAt: IsNull() },
    });
  }

  async findOne(id: string): Promise<DocumentType> {
    const documentType = await this.documentTypeRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!documentType) {
      throw new NotFoundException('Tipo de documento no encontrado');
    }

    return documentType;
  }

  async update(id: string, updateDocumentTypeDto: UpdateDocumentTypeDto): Promise<DocumentType> {
    const documentType = await this.findOne(id);

    // Check if name already exists (if being updated)
    if (updateDocumentTypeDto.name && updateDocumentTypeDto.name !== documentType.name) {
      const existingDocumentType = await this.documentTypeRepository.findOne({
        where: { name: updateDocumentTypeDto.name, deletedAt: IsNull() }
      });
      if (existingDocumentType) {
        throw new ConflictException('El nombre del tipo de documento ya está registrado');
      }
    }

    Object.assign(documentType, updateDocumentTypeDto);
    return await this.documentTypeRepository.save(documentType);
  }

  async softDelete(id: string): Promise<void> {
    const documentType = await this.findOne(id);
    await this.documentTypeRepository.softDelete(id);
  }

  async setAvailable(id: string, available: boolean): Promise<DocumentType> {
    const documentType = await this.findOne(id);
    documentType.available = available;
    return await this.documentTypeRepository.save(documentType);
  }
}