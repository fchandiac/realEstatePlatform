import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Multimedia } from '../../entities/multimedia.entity';
import { CreateMultimediaDto, UpdateMultimediaDto } from './dto/multimedia.dto';

@Injectable()
export class MultimediaService {
  constructor(
    @InjectRepository(Multimedia)
    private readonly multimediaRepository: Repository<Multimedia>,
  ) {}

  async create(createMultimediaDto: CreateMultimediaDto): Promise<Multimedia> {
    const multimedia = this.multimediaRepository.create(createMultimediaDto);
    return await this.multimediaRepository.save(multimedia);
  }

  async findAll(): Promise<Multimedia[]> {
    return await this.multimediaRepository.find({
      where: { deletedAt: IsNull() },
    });
  }

  async findOne(id: string): Promise<Multimedia> {
    const multimedia = await this.multimediaRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!multimedia) {
      throw new NotFoundException('Archivo multimedia no encontrado');
    }

    return multimedia;
  }

  async update(id: string, updateMultimediaDto: UpdateMultimediaDto): Promise<Multimedia> {
    const multimedia = await this.findOne(id);

    Object.assign(multimedia, updateMultimediaDto);
    return await this.multimediaRepository.save(multimedia);
  }

  async softDelete(id: string): Promise<void> {
    const multimedia = await this.findOne(id);
    await this.multimediaRepository.softDelete(id);
  }

  async getUrl(id: string): Promise<string> {
    const multimedia = await this.findOne(id);
    return multimedia.url;
  }

  async setSeoTitle(id: string, seoTitle: string): Promise<Multimedia> {
    const multimedia = await this.findOne(id);
    multimedia.seoTitle = seoTitle;
    return await this.multimediaRepository.save(multimedia);
  }

  // TODO: Implement linkToEntity and unlinkFromEntity methods
  // These would require additional entity relationships
}