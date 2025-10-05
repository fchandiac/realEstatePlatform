import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Identity } from '../../entities/identity.entity';
import { CreateIdentityDto, UpdateIdentityDto } from './dto/identity.dto';

@Injectable()
export class IdentitiesService {
  constructor(
    @InjectRepository(Identity)
    private readonly identityRepository: Repository<Identity>,
  ) {}

  async create(createIdentityDto: CreateIdentityDto): Promise<Identity> {
    const identity = this.identityRepository.create(createIdentityDto);
    return await this.identityRepository.save(identity);
  }

  async findAll(): Promise<Identity[]> {
    return await this.identityRepository.find({
      where: { deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Identity> {
    const identity = await this.identityRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!identity) {
      throw new NotFoundException('Identidad corporativa no encontrada.');
    }

    return identity;
  }

  async update(id: string, updateIdentityDto: UpdateIdentityDto): Promise<Identity> {
    const identity = await this.findOne(id);
    Object.assign(identity, updateIdentityDto);
    return await this.identityRepository.save(identity);
  }

  async softDelete(id: string): Promise<void> {
    const identity = await this.findOne(id);
    await this.identityRepository.softDelete(id);
  }
}