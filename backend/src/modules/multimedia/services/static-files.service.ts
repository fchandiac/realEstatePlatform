import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import * as path from 'path';
import {
  MultimediaType,
  MultimediaFormat,
} from '../../../entities/multimedia.entity';

@Injectable()
export class StaticFilesService implements OnModuleInit {
  private readonly uploadBasePath: string;

  constructor(private configService: ConfigService) {
    // Obtiene la ruta base de uploads desde la configuración o usa el valor por defecto
    this.uploadBasePath = this.configService.get('UPLOAD_PATH') || 'public';
  }

  // Se ejecuta cuando el módulo se inicializa
  async onModuleInit() {
    await this.ensureDirectoriesExist();
  }

  // Asegura que existan todos los directorios necesarios
  private async ensureDirectoriesExist() {
    const directories = [
      // Documentos
      'docs/dni/front',
      'docs/dni/rear',
      // Web
      'web/slides',
      'web/logos',
      'web/staff',
      'web/partnerships',
      // Propiedades (consistente con PropertyController)
      'properties/img',
      'properties/video',
      'docs',
    ];

    for (const dir of directories) {
      const fullPath = path.join(this.uploadBasePath, dir);
      await fs.mkdir(fullPath, { recursive: true });
    }
  }

  // Obtiene la ruta completa para un tipo de archivo específico
  getUploadPath(type: MultimediaType): string {
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
      [MultimediaType.DOCUMENT]: 'docs',
      [MultimediaType.SLIDER]: 'web/sliders',
    };

    return path.join(this.uploadBasePath, paths[type] || '');
  }

  // Genera una URL pública relativa para un archivo
  getPublicUrl(relativePath: string): string {
    // Retornar URL relativa que apunte a /public/ en lugar de URL absoluta
    return `/public/${relativePath}`;
  }

  // Obtiene la ruta completa del sistema de archivos para un archivo
  getFullPath(relativePath: string): string {
    return path.join(this.uploadBasePath, relativePath);
  }

  // Guarda un archivo en el sistema de archivos
  async saveFile(buffer: Buffer, relativePath: string): Promise<void> {
    const fullPath = this.getFullPath(relativePath);
    await fs.writeFile(fullPath, buffer);
  }

  // Determina el formato del archivo basado en su tipo MIME
  getFormatFromMimeType(mimeType: string): MultimediaFormat {
    return mimeType.startsWith('image/')
      ? MultimediaFormat.IMG
      : MultimediaFormat.VIDEO;
  }

  // Verifica si un archivo existe
  async fileExists(relativePath: string): Promise<boolean> {
    try {
      await fs.access(this.getFullPath(relativePath));
      return true;
    } catch {
      return false;
    }
  }

  // Elimina un archivo
  async deleteFile(relativePath: string): Promise<void> {
    const fullPath = this.getFullPath(relativePath);
    try {
      await fs.unlink(fullPath);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        // Ignora error si el archivo no existe
        throw error;
      }
    }
  }

  // Obtiene el tamaño de un archivo
  async getFileSize(relativePath: string): Promise<number> {
    const stats = await fs.stat(this.getFullPath(relativePath));
    return stats.size;
  }
}
