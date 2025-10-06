import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Property } from '../../entities/property.entity';
import { CreatePropertyDto, UpdatePropertyDto } from './dto/property.dto';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
  ) {}

  async create(createPropertyDto: CreatePropertyDto): Promise<Property> {
    const property = this.propertyRepository.create({
      ...createPropertyDto,
      creatorUserId: createPropertyDto.ownerId
    });
    return await this.propertyRepository.save(property);
  }

  async findAll(filters: any): Promise<Property[]> {
    const query = this.propertyRepository.createQueryBuilder('property')
      .where({ deletedAt: IsNull() }) as any;

      if (filters.operationType) {
      query.andWhere('property.operationType = :operationType', { operationType: filters.operationType });
    }

    if (filters.status) {
      query.andWhere('property.status = :status', { status: filters.status });
    }

    if (filters.region) {
      query.andWhere('property.regionCommune->>"$.region" = :region', { region: filters.region });
    }

    if (filters.communes) {
      query.andWhere('JSON_CONTAINS(property.regionCommune->>"$.communes", :communes)', { communes: JSON.stringify(filters.communes) });
    }    if (filters.status) {
      query.andWhere('property.status = :status', { status: filters.status });
    }

    return await query.getMany();
  }

  async findOne(id: string): Promise<Property> {
    const property = await this.propertyRepository.findOne({
      where: { id, deletedAt: IsNull() }
    });

    if (!property) {
      throw new NotFoundException('Propiedad no encontrada.');
    }

    return property;
  }

  async update(id: string, updatePropertyDto: UpdatePropertyDto): Promise<Property> {
    const property = await this.findOne(id);
    
    Object.assign(property, updatePropertyDto);
    return await this.propertyRepository.save(property);
  }

  async remove(id: string): Promise<void> {
    const property = await this.findOne(id);
    await this.propertyRepository.softDelete(id);
  }
}