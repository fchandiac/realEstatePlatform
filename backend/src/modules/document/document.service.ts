import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Document } from '../../entities/document.entity';
import { CreateDocumentDto, UpdateDocumentDto, UploadDocumentDto } from './dto/document.dto';
import { MultimediaService } from '../multimedia/services/multimedia.service';
import { MultimediaType, Multimedia } from '../../entities/multimedia.entity';
import { DocumentType } from '../../entities/document-type.entity';
import { User } from '../../entities/user.entity';
import type { Express } from 'express';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    @InjectRepository(DocumentType)
    private readonly documentTypeRepository: Repository<DocumentType>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Multimedia)
    private readonly multimediaRepository: Repository<Multimedia>,
    private readonly multimediaService: MultimediaService,
  ) {}

  async create(createDocumentDto: CreateDocumentDto): Promise<Document> {
    // Buscar las entidades relacionadas
    const documentType = await this.documentTypeRepository.findOne({
      where: { id: createDocumentDto.documentTypeId },
    });
    if (!documentType) {
      throw new NotFoundException('Tipo de documento no encontrado');
    }

    const uploadedBy = await this.userRepository.findOne({
      where: { id: createDocumentDto.uploadedById },
    });
    if (!uploadedBy) {
      throw new NotFoundException('Usuario no encontrado');
    }

    let multimedia: Multimedia | undefined;
    if (createDocumentDto.multimediaId) {
      const foundMultimedia = await this.multimediaRepository.findOne({
        where: { id: createDocumentDto.multimediaId },
      });
      if (!foundMultimedia) {
        throw new NotFoundException('Multimedia no encontrado');
      }
      multimedia = foundMultimedia;
    }

    // Crear el documento con las relaciones
    const { documentTypeId, multimediaId, uploadedById, ...documentData } = createDocumentDto;
    const document = this.documentRepository.create({
      ...documentData,
      documentType,
      multimedia,
      uploadedBy,
    });
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

    // Actualizar campos directos
    const { documentTypeId, multimediaId, uploadedById, ...directFields } = updateDocumentDto;
    Object.assign(document, directFields);

    // Actualizar relaciones si se proporcionan
    if (documentTypeId) {
      const documentType = await this.documentTypeRepository.findOne({
        where: { id: documentTypeId },
      });
      if (!documentType) {
        throw new NotFoundException('Tipo de documento no encontrado');
      }
      document.documentType = documentType;
    }

    if (uploadedById) {
      const uploadedBy = await this.userRepository.findOne({
        where: { id: uploadedById },
      });
      if (!uploadedBy) {
        throw new NotFoundException('Usuario no encontrado');
      }
      document.uploadedBy = uploadedBy;
    }

    if (multimediaId !== undefined) {
      if (multimediaId) {
        const multimedia = await this.multimediaRepository.findOne({
          where: { id: multimediaId },
        });
        if (!multimedia) {
          throw new NotFoundException('Multimedia no encontrado');
        }
        document.multimedia = multimedia;
      } else {
        document.multimedia = undefined;
      }
    }

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