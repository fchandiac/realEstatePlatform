import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Slider } from '../../entities/slider.entity';
import { CreateSliderDto, UpdateSliderDto } from './dto';
import { MultimediaService } from '../multimedia/services/multimedia.service';
import { MultimediaType } from '../../entities/multimedia.entity';

@Injectable()
export class SlidersService {
  constructor(
    @InjectRepository(Slider)
    private sliderRepository: Repository<Slider>,
    private multimediaService: MultimediaService,
  ) {}

  async create(createSliderDto: CreateSliderDto, image?: Express.Multer.File): Promise<Slider> {
    if (image) {
      const uploaded = await this.multimediaService.uploadFile(image, {
        type: MultimediaType.SLIDER,
        seoTitle: createSliderDto.title,
        description: createSliderDto.description,
      }, ''); // userId can be empty for now
      createSliderDto.imageUrl = uploaded.url;
    }
    const slider = this.sliderRepository.create(createSliderDto);
    return this.sliderRepository.save(slider);
  }

  async findAll(): Promise<Slider[]> {
    return this.sliderRepository.find({ order: { order: 'ASC' } });
  }

  async findOne(id: string): Promise<Slider> {
    const slider = await this.sliderRepository.findOne({ where: { id } });
    if (!slider) throw new NotFoundException('Slider not found');
    return slider;
  }

  async update(id: string, updateSliderDto: UpdateSliderDto, image?: Express.Multer.File): Promise<Slider> {
    const slider = await this.findOne(id);
    if (image) {
      const uploaded = await this.multimediaService.uploadFile(image, {
        type: MultimediaType.SLIDER,
        seoTitle: updateSliderDto.title || slider.title,
        description: updateSliderDto.description || slider.description,
      }, '');
      updateSliderDto.imageUrl = uploaded.url;
    }
    Object.assign(slider, updateSliderDto);
    return this.sliderRepository.save(slider);
  }

  async remove(id: string): Promise<void> {
    const slider = await this.findOne(id);
    await this.sliderRepository.remove(slider);
  }

  async reorder(ids: string[]): Promise<void> {
    for (let i = 0; i < ids.length; i++) {
      await this.sliderRepository.update(ids[i], { order: i });
    }
  }
}