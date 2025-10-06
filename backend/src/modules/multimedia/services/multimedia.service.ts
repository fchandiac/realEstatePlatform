import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { promises as fs } from 'fs';
import * as path from 'path';
import { Multimedia, MultimediaType, MultimediaFormat } from '../../../entities/multimedia.entity';
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
    metadata: MultimediaUploadMetadata,
    userId: string,
  ): Promise<Multimedia> {
    const uploadDir = path.join(this.baseUploadPath, metadata.type);

    // Ensure the directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, file.originalname);

    try {
      // Save the file to the upload directory
      await fs.writeFile(filePath, file.buffer);

      // Save metadata to the database
      const multimedia = new Multimedia();
      multimedia.type = metadata.type as MultimediaType;
      multimedia.seoTitle = metadata.seoTitle;
      multimedia.description = metadata.description;
      multimedia.url = filePath;
      multimedia.userId = userId || undefined; // Ensure userId is undefined if not provided
      multimedia.format = file.mimetype.startsWith('image') ? MultimediaFormat.IMG : MultimediaFormat.VIDEO; // Infer format
      multimedia.filename = file.originalname;
      multimedia.fileSize = file.size;

      return await this.multimediaRepository.save(multimedia);
    } catch (error) {
      throw new HttpException('Error uploading file', HttpStatus.INTERNAL_SERVER_ERROR);
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