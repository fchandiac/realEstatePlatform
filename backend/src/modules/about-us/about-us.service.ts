import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { AboutUs } from '../../entities/about-us.entity';
import { CreateAboutUsDto, UpdateAboutUsDto } from './dto/about-us.dto';

@Injectable()
export class AboutUsService {
  constructor(
    @InjectRepository(AboutUs)
    private readonly aboutUsRepository: Repository<AboutUs>,
  ) {}

  async create(createAboutUsDto: CreateAboutUsDto): Promise<AboutUs> {
    const aboutUs = this.aboutUsRepository.create(createAboutUsDto);
    return await this.aboutUsRepository.save(aboutUs);
  }

  async findAll(): Promise<AboutUs[]> {
    return await this.aboutUsRepository.find({
      where: { deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<AboutUs> {
    const aboutUs = await this.aboutUsRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!aboutUs) {
      throw new NotFoundException('Información corporativa no encontrada.');
    }

    return aboutUs;
  }

  async update(id: string, updateAboutUsDto: UpdateAboutUsDto): Promise<AboutUs> {
    const aboutUs = await this.findOne(id);
    Object.assign(aboutUs, updateAboutUsDto);
    return await this.aboutUsRepository.save(aboutUs);
  }

  async softDelete(id: string): Promise<void> {
    const aboutUs = await this.findOne(id);
    await this.aboutUsRepository.softDelete(id);
  }
}