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
  constructor(
    @InjectRepository(Multimedia)
    private readonly multimediaRepository: Repository<Multimedia>,
    private readonly staticFilesService: StaticFilesService,
  ) {}


  private getUploadPath(type: MultimediaType): string {
    const paths = {
      [MultimediaType.DNI_FRONT]: 'docs/dni/front',
      [MultimediaType.DNI_REAR]: 'docs/dni/rear',
      [MultimediaType.SLIDE]: 'web/slides',
      [MultimediaType.LOGO]: 'web/logos',
      [MultimediaType.STAFF]: 'web/staff',
      [MultimediaType.PARTNERSHIP]: 'web/partnerships',
      [MultimediaType.PROPERTY_IMG]: 'properties/img',
      [MultimediaType.PROPERTY_VIDEO]: 'properties/video',
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
    // Directorio relativo bajo la carpeta de uploads (ej: PROPERTY_IMG)
    const relativeDir = this.getUploadPath(metadata.type as MultimediaType);

    // Generar nombre único
    const uniqueFilename = this.generateUniqueFilename(
      file.originalname,
      metadata.type as MultimediaType,
    );
  let relativePath = path.join(relativeDir, uniqueFilename);

    try {
      // If multer used memoryStorage, file.buffer will be available and we should save it
      if (file.buffer && file.buffer.length) {
        await this.staticFilesService.saveFile(file.buffer, relativePath);
      } else {
        // If diskStorage was used, multer already saved the file to disk.
        // We'll attempt to use the existing saved file. Multer's diskStorage typically
        // places files under the configured destination with `file.filename`.
        // We'll derive a relative path under 'properties' using the filename if present.
        const existingFilename = (file as any).filename || path.basename((file as any).path || '');
        if (existingFilename) {
          // Prefer to use the existing location under ./public/properties
          // Build relative path as 'properties/<filename>' so getPublicUrl returns the correct URL
          const existingRelative = path.join('properties', existingFilename);
          // If the file isn't in the expected final folder, we could move it here.
          // For now assume controller saved to ./public/properties and leave it as is.
          // Override relativePath so URL points to existing file
          // Note: relativePath variable is still the intended destination when buffer is used
          // but when buffer is absent we'll use existingRelative for the public URL.
          // Set relativePath to existingRelative so the saved metadata matches actual file.
          // (no file write performed)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const _usePath = existingRelative;
          // We will set multimedia.url using existingRelative below
          relativePath = existingRelative;
        }
      }

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
      multimedia.filename = uniqueFilename; // Use the unique filename when buffer path used
      // If multer provided a filename (diskStorage) prefer that value
      if ((file as any).filename) {
        multimedia.filename = (file as any).filename;
      }
      multimedia.fileSize = file.size;

      return await this.multimediaRepository.save(multimedia);
    } catch (error) {
      console.error('❌ [MultimediaService.uploadFile] Error saving file metadata:', error);
      throw new HttpException(
        'Error uploading file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async serveFile(filepath: string): Promise<Buffer> {
    const fullPath = this.staticFilesService.getFullPath(filepath);
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
      // Construir la ruta relativa a partir del tipo y el nombre del archivo
      const relativePath = path.join(
        this.getUploadPath(multimedia.type),
        multimedia.filename,
      );
      const fullPath = this.staticFilesService.getFullPath(relativePath);

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
    const fullUploadPath = this.staticFilesService.getFullPath(uploadPath);

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
