import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Slide } from '../../entities/slide.entity';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';

@Injectable()
export class SlideService {
  constructor(
    @InjectRepository(Slide)
    private slideRepository: Repository<Slide>,
  ) {}

  async create(createSlideDto: CreateSlideDto): Promise<Slide> {
    const slide = this.slideRepository.create(createSlideDto);
    return await this.slideRepository.save(slide);
  }

  async findAll(search?: string): Promise<Slide[]> {
    const queryBuilder = this.slideRepository
      .createQueryBuilder('slide')
      .where('slide.deletedAt IS NULL');

    if (search) {
      queryBuilder.andWhere(
        '(slide.title LIKE :search OR slide.description LIKE :search)',
        { search: `%${search}%` }
      );
    }

    return await queryBuilder
      .orderBy('slide.order', 'ASC')
      .addOrderBy('slide.createdAt', 'DESC')
      .getMany();
  }

  async findActive(search?: string): Promise<Slide[]> {
    const queryBuilder = this.slideRepository
      .createQueryBuilder('slide')
      .where('slide.deletedAt IS NULL')
      .andWhere('slide.isActive = :isActive', { isActive: true });

    if (search) {
      queryBuilder.andWhere(
        '(slide.title LIKE :search OR slide.description LIKE :search)',
        { search: `%${search}%` }
      );
    }

    return await queryBuilder
      .orderBy('slide.order', 'ASC')
      .getMany();
  }

  async findOne(id: string): Promise<Slide> {
    const slide = await this.slideRepository.findOne({ where: { id } });
    if (!slide) {
      throw new NotFoundException(`Slide with ID ${id} not found`);
    }
    return slide;
  }

  async update(id: string, updateSlideDto: UpdateSlideDto): Promise<Slide> {
    const slide = await this.findOne(id);
    Object.assign(slide, updateSlideDto);
    return await this.slideRepository.save(slide);
  }

  async remove(id: string): Promise<void> {
    const slide = await this.findOne(id);
    await this.slideRepository.softDelete(id);
  }

  async toggleStatus(id: string): Promise<Slide> {
    const slide = await this.findOne(id);
    slide.isActive = !slide.isActive;
    return await this.slideRepository.save(slide);
  }

  async reorder(slideIds: string[]): Promise<void> {
    for (let i = 0; i < slideIds.length; i++) {
      await this.slideRepository.update(slideIds[i], { order: i + 1 });
    }
  }

  async getMaxOrder(): Promise<number> {
    const result = await this.slideRepository
      .createQueryBuilder('slide')
      .select('MAX(slide.order)', 'maxOrder')
      .getRawOne();
    
    return result?.maxOrder || 0;
  }
}