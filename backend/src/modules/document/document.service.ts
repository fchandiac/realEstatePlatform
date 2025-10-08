import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Document } from '../../entities/document.entity';
import { CreateDocumentDto, UpdateDocumentDto, UploadDocumentDto } from './dto/document.dto';
import { MultimediaService } from '../multimedia/services/multimedia.service';
import { MultimediaType } from '../../entities/multimedia.entity';
import type { Express } from 'express';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    private readonly multimediaService: MultimediaService,
  ) {}

  async create(createDocumentDto: CreateDocumentDto): Promise<Document> {
    const document = this.documentRepository.create(createDocumentDto);
    return await this.documentRepository.save(document);
  }

  async findAll(): Promise<Document[]> {
    return await this.documentRepository.find({
      where: { deletedAt: IsNull() },
      relations: ['documentType', 'multimedia', 'uploadedBy'],
    });
  }

  async findOne(id: string): Promise<Document> {
    const document = await this.documentRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['documentType', 'multimedia', 'uploadedBy'],
    });

    if (!document) {
      throw new NotFoundException('Documento no encontrado');
    }

    return document;
  }

  async update(id: string, updateDocumentDto: UpdateDocumentDto): Promise<Document> {
    const document = await this.findOne(id);
    Object.assign(document, updateDocumentDto);
    return await this.documentRepository.save(document);
  }

  async softDelete(id: string): Promise<void> {
    const document = await this.findOne(id);
    await this.documentRepository.softDelete(id);
  }

  async uploadDocument(
    file: Express.Multer.File,
    uploadDocumentDto: UploadDocumentDto,
  ): Promise<Document> {
    // Subir el archivo usando el servicio de multimedia
    const multimediaMetadata = {
      type: MultimediaType.DOCUMENT,
      seoTitle: uploadDocumentDto.seoTitle || uploadDocumentDto.title,
    };

    const multimedia = await this.multimediaService.uploadFile(
      file,
      multimediaMetadata,
      uploadDocumentDto.uploadedById,
    );

    // Crear el documento con la referencia al multimedia
    const createDocumentDto: CreateDocumentDto = {
      title: uploadDocumentDto.title,
      documentTypeId: uploadDocumentDto.documentTypeId,
      multimediaId: multimedia.id,
      uploadedById: uploadDocumentDto.uploadedById,
      status: uploadDocumentDto.status,
      notes: uploadDocumentDto.notes,
    };

    return await this.create(createDocumentDto);
  }
}