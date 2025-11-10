import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Testimonial } from '../../entities/testimonial.entity';
import {
  CreateTestimonialDto,
  UpdateTestimonialDto,
} from './dto/testimonial.dto';
import { MultimediaService as UploadMultimediaService } from '../multimedia/services/multimedia.service';
import {
  MultimediaType,
  Multimedia,
  MultimediaFormat,
} from '../../entities/multimedia.entity';
import type { Express } from 'express';

@Injectable()
export class TestimonialsService {
  constructor(
    @InjectRepository(Testimonial)
    private readonly testimonialRepository: Repository<Testimonial>,
    private readonly uploadMultimediaService: UploadMultimediaService,
  ) {}

  async create(
    createTestimonialDto: CreateTestimonialDto,
    file?: Express.Multer.File,
  ): Promise<Testimonial> {
    let imageUrl: string | undefined;

    if (file) {
      // Guardar el archivo y obtener la URL
      const filename = `${Date.now()}-${file.originalname}`;
      const filepath = `uploads/web/testimonials/${filename}`;
      
      // Crear directorio si no existe
      const fs = require('fs').promises;
      const path = require('path');
      await fs.mkdir(path.dirname(filepath), { recursive: true });
      
      // Guardar archivo
      await fs.writeFile(filepath, file.buffer);
      
      // Generar URL pública
      const backendUrl = process.env.BACKEND_PUBLIC_URL || `http://localhost:${process.env.PORT || 3001}`;
      imageUrl = `${backendUrl}/uploads/web/testimonials/${filename}`;
    }

    const testimonial = this.testimonialRepository.create({
      ...createTestimonialDto,
      imageUrl,
      isActive: createTestimonialDto.isActive ?? true,
    });
    return await this.testimonialRepository.save(testimonial);
  }

  async findAll(): Promise<Testimonial[]> {
    return await this.testimonialRepository.find({
      where: { deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Testimonial> {
    const testimonial = await this.testimonialRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!testimonial) {
      throw new NotFoundException('Testimonio no encontrado.');
    }

    return testimonial;
  }

  async update(
    id: string,
    updateTestimonialDto: UpdateTestimonialDto,
    image?: Express.Multer.File,
  ): Promise<Testimonial> {
    const testimonial = await this.findOne(id);
    
    let imageUrl: string | undefined;
    if (image) {
      // Guardar el archivo y obtener la URL
      const filename = `${Date.now()}-${image.originalname}`;
      const filepath = `uploads/web/testimonials/${filename}`;
      
      // Crear directorio si no existe
      const fs = require('fs').promises;
      const path = require('path');
      await fs.mkdir(path.dirname(filepath), { recursive: true });
      
      // Guardar archivo
      await fs.writeFile(filepath, image.buffer);
      
      // Generar URL pública
      const backendUrl = process.env.BACKEND_PUBLIC_URL || `http://localhost:${process.env.PORT || 3001}`;
      imageUrl = `${backendUrl}/uploads/web/testimonials/${filename}`;
    }

    Object.assign(testimonial, {
      ...updateTestimonialDto,
      ...(imageUrl && { imageUrl }),
    });
    
    return await this.testimonialRepository.save(testimonial);
  }

  async softDelete(id: string): Promise<void> {
    const testimonial = await this.findOne(id);
    await this.testimonialRepository.softDelete(id);
  }
}
