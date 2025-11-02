import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { promises as fs } from 'fs';
import * as path from 'path';
import {
  Multimedia,
  MultimediaType,
  MultimediaFormat,
} from '../../../entities/multimedia.entity';
import {
  MultimediaUploadMetadata,
  MultimediaResponse,
} from '../interfaces/multimedia.interface';
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
      'web/testimonials',
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
      [MultimediaType.TESTIMONIAL_IMG]: 'web/testimonials',
      [MultimediaType.DOCUMENT]: 'documents',
      [MultimediaType.SLIDER]: 'web/sliders',
    };

    return paths[type] || '';
  }

  private generateUniqueFilename(
    originalName: string,
    type: MultimediaType,
  ): string {
    // Obtener la extensión del archivo original
    const extension = path.extname(originalName);

    // Crear prefijo basado en el tipo
    const typePrefix = type.toLowerCase().replace('_', '-');

    // Generar timestamp en formato YYYYMMDD_HHMMSS
    const now = new Date();
    const timestamp = now
      .toISOString()
      .replace(/[-:]/g, '') // Remover guiones y dos puntos
      .replace('T', '_') // Reemplazar T con underscore
      .split('.')[0]; // Remover milisegundos

    // Generar string aleatorio de 8 caracteres
    const randomString = Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase();

    // Combinar todo: prefijo_tipo_timestamp_random.ext
    return `${typePrefix}_${timestamp}_${randomString}${extension}`;
  }

  async uploadFile(
    file: Express.Multer.File,
    metadata: MultimediaUploadMetadata,
    userId: string,
  ): Promise<Multimedia> {
    const uploadDir = this.getUploadPath(metadata.type as MultimediaType);

    // Ensure the directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const uniqueFilename = this.generateUniqueFilename(
      file.originalname,
      metadata.type as MultimediaType,
    );
    const filePath = path.join(uploadDir, uniqueFilename);
    const relativePath = path.relative(this.baseUploadPath, filePath);

    try {
      // Save the file to the upload directory
      await fs.writeFile(filePath, file.buffer);

      // Save metadata to the database
      const multimedia = new Multimedia();
      multimedia.type = metadata.type as MultimediaType;
      multimedia.seoTitle = metadata.seoTitle;
      multimedia.description = metadata.description;
      multimedia.url = this.staticFilesService.getPublicUrl(relativePath);
      multimedia.userId = userId || undefined; // Ensure userId is undefined if not provided
      multimedia.format = file.mimetype.startsWith('image')
        ? MultimediaFormat.IMG
        : MultimediaFormat.VIDEO; // Infer format
      multimedia.filename = uniqueFilename; // Use the unique filename instead of original
      multimedia.fileSize = file.size;

      return await this.multimediaRepository.save(multimedia);
    } catch (error) {
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
    const multimedia = await this.multimediaRepository.findOne({
      where: { id },
    });
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
    return mimeType.startsWith('image/')
      ? MultimediaFormat.IMG
      : MultimediaFormat.VIDEO;
  }

  /**
   * Uploads a file to a specific path without creating a Multimedia entity
   * Useful for logos, documents, etc. that don't need database records
   */
  async uploadFileToPath(file: Express.Multer.File, uploadPath: string): Promise<string> {
    const fullUploadPath = path.join(this.baseUploadPath, uploadPath);

    // Ensure the directory exists
    await fs.mkdir(fullUploadPath, { recursive: true });

    // Generate unique filename
    const extension = path.extname(file.originalname);
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:]/g, '')
      .replace('T', '_')
      .split('.')[0];
    const randomString = Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase();
    const uniqueFilename = `${uploadPath.toLowerCase().replace('/', '_')}_${timestamp}_${randomString}${extension}`;

    const filePath = path.join(fullUploadPath, uniqueFilename);

    try {
      // Save the file to the upload directory
      await fs.writeFile(filePath, file.buffer);

      // Return the relative path for URL generation
      return path.join(uploadPath, uniqueFilename);
    } catch (error) {
      throw new HttpException(
        'Error uploading file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
