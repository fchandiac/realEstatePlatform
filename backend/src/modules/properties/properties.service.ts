import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Property } from '../../entities/property.entity';
import { CreatePropertyDto, UpdatePropertyDto } from './dto/property.dto';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
  ) {}

  async create(createPropertyDto: CreatePropertyDto): Promise<Property> {
    const property = this.propertyRepository.create(createPropertyDto);
    return await this.propertyRepository.save(property);
  }

  async findAll(): Promise<Property[]> {
    return await this.propertyRepository.find({
      where: { deletedAt: IsNull() },
      relations: ['creatorUser', 'assignedAgent'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Property> {
    const property = await this.propertyRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['creatorUser', 'assignedAgent'],
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

  async softDelete(id: string): Promise<void> {
    const property = await this.findOne(id);
    await this.propertyRepository.softDelete(id);
  }

  async assignAgent(id: string, agentId: string): Promise<Property> {
    const property = await this.findOne(id);
    property.assignedAgentId = agentId;
    return await this.propertyRepository.save(property);
  }

  async findByCreator(creatorUserId: string): Promise<Property[]> {
    return await this.propertyRepository.find({
      where: { creatorUserId, deletedAt: IsNull() },
      relations: ['creatorUser', 'assignedAgent'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByAgent(agentId: string): Promise<Property[]> {
    return await this.propertyRepository.find({
      where: { assignedAgentId: agentId, deletedAt: IsNull() },
      relations: ['creatorUser', 'assignedAgent'],
      order: { createdAt: 'DESC' },
    });
  }
}