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
    let multimedia: Multimedia | undefined;

    if (file) {
      const metadata = {
        type: MultimediaType.TESTIMONIAL_IMG,
        seoTitle: '',
        description: '',
      };
      multimedia = await this.uploadMultimediaService.uploadFile(
        file,
        metadata,
        'system',
      ); // Assuming userId is 'system' for now
    }

    const testimonial = this.testimonialRepository.create({
      ...createTestimonialDto,
      multimedia,
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
  ): Promise<Testimonial> {
    const testimonial = await this.findOne(id);
    Object.assign(testimonial, updateTestimonialDto);
    return await this.testimonialRepository.save(testimonial);
  }

  async softDelete(id: string): Promise<void> {
    const testimonial = await this.findOne(id);
    await this.testimonialRepository.softDelete(id);
  }
}
