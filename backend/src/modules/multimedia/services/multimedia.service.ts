import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Multimedia, MultimediaType, MultimediaFormat } from '../../../entities/multimedia.entity';
import { promises as fs } from 'fs';
import * as path from 'path';
import { MultimediaUploadMetadata, MultimediaResponse } from '../interfaces/multimedia.interface';
import { StaticFilesService } from './static-files.service';

@Injectable()
export class MultimediaService {
  private readonly baseUploadPath = 'uploads';

  constructor(
    @InjectRepository(Multimedia)
    private readonly multimediaRepository: Repository<Multimedia>,
    private readonly staticFilesService: StaticFilesService,
  ) {}

  private async initializeUploadDirectories(): Promise<void> {
    const directories = [
      // Documentos
      'docs/dni/front',
      'docs/dni/rear',
      // Web
      'web/slides',
      'web/logos',
      'web/staff',
      'web/partnerships',
      // Propiedades
      'properties/images',
      'properties/videos',
    ];

    for (const dir of directories) {
      const fullPath = path.join(this.baseUploadPath, dir);
      await fs.mkdir(fullPath, { recursive: true });
    }
  }

  private getUploadPath(type: MultimediaType): string {
    const paths = {
      [MultimediaType.DNI_FRONT]: 'docs/dni/front',
      [MultimediaType.DNI_REAR]: 'docs/dni/rear',
      [MultimediaType.SLIDE]: 'web/slides',
      [MultimediaType.LOGO]: 'web/logos',
      [MultimediaType.STAFF]: 'web/staff',
      [MultimediaType.PARTNERSHIP]: 'web/partnerships',
      [MultimediaType.PROPERTY_IMG]: 'properties/images',
      [MultimediaType.PROPERTY_VIDEO]: 'properties/videos',
    };

    return paths[type] || '';
  }

  async uploadFile(
    file: Express.Multer.File,
    type: MultimediaType,
    metadata: {
      seoTitle?: string;
      description?: string;
    },
  ): Promise<Multimedia> {
    const uploadPath = this.getUploadPath(type);
    if (!uploadPath) {
      throw new HttpException('Invalid multimedia type', HttpStatus.BAD_REQUEST);
    }

    const filename = `${Date.now()}-${file.originalname}`;
    const fullPath = path.join(this.baseUploadPath, uploadPath, filename);

    try {
      // Guardar archivo
      await fs.writeFile(fullPath, file.buffer);

      // Determinar el formato basado en el tipo MIME
      const format = this.getFormatFromMimeType(file.mimetype);

      // Crear registro en base de datos
      const multimedia = new Multimedia();
      multimedia.type = type;
      multimedia.format = format;
      multimedia.filename = filename;
      multimedia.fileSize = file.size;
      multimedia.url = `/${uploadPath}/${filename}`;
      if (metadata.seoTitle) {
        multimedia.seoTitle = metadata.seoTitle;
      }

      // Guardar en la base de datos
      return await this.multimediaRepository.save(multimedia);
    } catch (error) {
      // Si hay error, intentar eliminar el archivo si se creó
      try {
        await fs.unlink(fullPath);
      } catch {}
      throw new HttpException(
        'Error uploading file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async serveFile(filepath: string): Promise<Buffer> {
    const fullPath = path.join(this.baseUploadPath, filepath);
    try {
      return await fs.readFile(fullPath);
    } catch (error) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }
  }

  async deleteFile(id: string): Promise<void> {
    const multimedia = await this.multimediaRepository.findOne({ where: { id } });
    if (!multimedia) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }

    try {
      const fullPath = path.join(this.baseUploadPath, multimedia.url);
      await fs.unlink(fullPath);
      await this.multimediaRepository.remove(multimedia);
    } catch (error) {
      throw new HttpException(
        'Error deleting file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private getFormatFromMimeType(mimeType: string): MultimediaFormat {
    return mimeType.startsWith('image/') ? MultimediaFormat.IMG : MultimediaFormat.VIDEO;
  }
}