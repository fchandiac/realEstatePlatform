import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Slider } from '../../entities/slider.entity';
import { CreateSliderDto, UpdateSliderDto } from './dto';

@Injectable()
export class SlidersService {
  constructor(
    @InjectRepository(Slider)
    private sliderRepository: Repository<Slider>,
  ) {}

  async create(createSliderDto: CreateSliderDto): Promise<Slider> {
    const slider = this.sliderRepository.create({
      slide1: createSliderDto.slide1,
      slide2: createSliderDto.slide2,
      slide3: createSliderDto.slide3,
      slide4: createSliderDto.slide4,
      slide5: createSliderDto.slide5,
      slide6: createSliderDto.slide6,
      slide7: createSliderDto.slide7,
      slide8: createSliderDto.slide8,
    });
    return this.sliderRepository.save(slider);
  }

  async findAll(): Promise<Slider[]> {
    return this.sliderRepository.find();
  }

  async findOne(id: string): Promise<Slider> {
    const slider = await this.sliderRepository.findOne({ where: { id } });
    if (!slider) throw new NotFoundException('Slider not found');
    return slider;
  }

  async update(id: string, updateSliderDto: UpdateSliderDto): Promise<Slider> {
    const slider = await this.findOne(id);
    Object.assign(slider, updateSliderDto);
    return this.sliderRepository.save(slider);
  }

  async remove(id: string): Promise<void> {
    const slider = await this.findOne(id);
    await this.sliderRepository.remove(slider);
  }

  async reorder(ids: string[]): Promise<void> {
    throw new Error('Reordering is not supported for sliders.');
  }
}