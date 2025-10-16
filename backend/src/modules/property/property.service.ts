import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Property } from '../../entities/property.entity';
import { User } from '../../entities/user.entity';
import { CreatePropertyDto, UpdatePropertyDto } from './dto/property.dto';
import { PropertyStatus } from '../../common/enums/property-status.enum';
import { PropertyOperationType } from '../../common/enums/property-operation-type.enum';
import { ChangeHistoryEntry, ViewEntry, LeadEntry } from '../../common/interfaces/property.interfaces';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
  ) {}

  async create(createPropertyDto: CreatePropertyDto, creatorId?: string): Promise<Property> {
    // Validate business rules
    this.validatePropertyData(createPropertyDto);

    // Create property with proper relationships
    const property = this.propertyRepository.create({
      ...createPropertyDto,
      creatorUserId: creatorId || createPropertyDto.creatorUserId,
      status: createPropertyDto.status || PropertyStatus.REQUEST,
      createdAt: new Date(),
      lastModifiedAt: new Date(),
    });

    // Add creation history entry
    if (property.changeHistory) {
      property.changeHistory = [];
    }
    
    const historyEntry: ChangeHistoryEntry = {
      timestamp: new Date(),
      changedBy: creatorId || 'system',
      field: 'creation',
      previousValue: null,
      newValue: 'Created',
      reason: 'Property created',
    };
    
    property.changeHistory = [historyEntry];

    return await this.propertyRepository.save(property);
  }

  async findAll(filters: any = {}): Promise<Property[]> {
    const query = this.propertyRepository
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.creatorUser', 'creatorUser')
      .leftJoinAndSelect('property.assignedAgent', 'assignedAgent')
      .where({ deletedAt: IsNull() });

    // Apply filters
    if (filters.operationType) {
      query.andWhere('property.operationType = :operationType', {
        operationType: filters.operationType,
      });
    }

    if (filters.status) {
      query.andWhere('property.status = :status', { status: filters.status });
    }

    if (filters.propertyType) {
      query.andWhere('property.propertyType = :propertyType', {
        propertyType: filters.propertyType,
      });
    }

    if (filters.city) {
      query.andWhere('property.city = :city', { city: filters.city });
    }

    if (filters.minPrice) {
      query.andWhere('property.priceCLP >= :minPrice', { minPrice: filters.minPrice });
    }

    if (filters.maxPrice) {
      query.andWhere('property.priceCLP <= :maxPrice', { maxPrice: filters.maxPrice });
    }

    if (filters.bedrooms) {
      query.andWhere('property.bedrooms >= :bedrooms', { bedrooms: filters.bedrooms });
    }

    if (filters.bathrooms) {
      query.andWhere('property.bathrooms >= :bathrooms', { bathrooms: filters.bathrooms });
    }

    if (filters.isFeatured !== undefined) {
      query.andWhere('property.isFeatured = :isFeatured', { isFeatured: filters.isFeatured });
    }

    // Sorting
    if (filters.sortBy) {
      const direction = filters.sortDirection || 'ASC';
      query.orderBy(`property.${filters.sortBy}`, direction);
    } else {
      query.orderBy('property.priority', 'DESC')
           .addOrderBy('property.isFeatured', 'DESC')
           .addOrderBy('property.createdAt', 'DESC');
    }

    // Pagination
    if (filters.limit) {
      query.limit(filters.limit);
    }

    if (filters.offset) {
      query.offset(filters.offset);
    }

    return await query.getMany();
  }

  async findOne(id: string, trackView: boolean = true, viewData?: any): Promise<Property> {
    const property = await this.propertyRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['creatorUser', 'assignedAgent'],
    });

    if (!property) {
      throw new NotFoundException('Propiedad no encontrada.');
    }

    // Track view if requested
    if (trackView) {
      await this.addView(id, viewData);
    }

    return property;
  }

  async update(
    id: string,
    updatePropertyDto: UpdatePropertyDto,
    updatedBy?: string,
  ): Promise<Property> {
    const property = await this.findOne(id, false);

    // Validate update data
    this.validatePropertyUpdate(updatePropertyDto);

    // Track changes for history
    const changes: ChangeHistoryEntry[] = [];
    
    for (const [key, newValue] of Object.entries(updatePropertyDto)) {
      if (key in property && property[key] !== newValue) {
        changes.push({
          timestamp: new Date(),
          changedBy: updatedBy || 'system',
          field: key,
          previousValue: property[key],
          newValue: newValue,
          reason: `Updated ${key}`,
        });
      }
    }

    // Update property
    Object.assign(property, updatePropertyDto);
    property.lastModifiedAt = new Date();

    // Add change history
    if (changes.length > 0) {
      property.changeHistory = [...(property.changeHistory || []), ...changes];
    }

    return await this.propertyRepository.save(property);
  }

  async updateStatus(
    id: string, 
    status: PropertyStatus, 
    updatedBy?: string, 
    reason?: string
  ): Promise<Property> {
    const property = await this.findOne(id, false);

    const historyEntry: ChangeHistoryEntry = {
      timestamp: new Date(),
      changedBy: updatedBy || 'system',
      field: 'status',
      previousValue: property.status,
      newValue: status,
      reason: reason || `Status changed to ${status}`,
    };

    property.status = status;
    property.lastModifiedAt = new Date();
    property.changeHistory = [...(property.changeHistory || []), historyEntry];

    // Set publication date if publishing
    if (status === PropertyStatus.PUBLISHED && !property.publishedAt) {
      property.publishedAt = new Date();
    }

    return await this.propertyRepository.save(property);
  }

  async addView(id: string, viewData: any = {}): Promise<void> {
    const property = await this.findOne(id, false);

    const viewEntry: ViewEntry = {
      timestamp: new Date(),
      sessionId: viewData.sessionId || 'anonymous',
      userId: viewData.userId,
      ip: viewData.ip,
      userAgent: viewData.userAgent,
      platform: viewData.platform,
      source: viewData.source,
    };

    property.views = [...(property.views || []), viewEntry];
    property.viewCount = (property.viewCount || 0) + 1;

    await this.propertyRepository.save(property);
  }

  async addLead(id: string, leadData: LeadEntry): Promise<void> {
    const property = await this.findOne(id, false);

    leadData.timestamp = new Date();
    leadData.status = leadData.status || 'new';

    property.leads = [...(property.leads || []), leadData];
    property.contactCount = (property.contactCount || 0) + 1;

    await this.propertyRepository.save(property);
  }

  async remove(id: string, deletedBy?: string): Promise<void> {
    const property = await this.findOne(id, false);

    // Add deletion to history
    const historyEntry: ChangeHistoryEntry = {
      timestamp: new Date(),
      changedBy: deletedBy || 'system',
      field: 'deletion',
      previousValue: 'active',
      newValue: 'deleted',
      reason: 'Property deleted',
    };

    property.changeHistory = [...(property.changeHistory || []), historyEntry];
    await this.propertyRepository.save(property);
    
    await this.propertyRepository.softDelete(id);
  }

  private validatePropertyData(dto: CreatePropertyDto): void {
    // Validate operation type and pricing
    if (dto.operationType === PropertyOperationType.SALE && !dto.priceCLP && !dto.priceUF) {
      throw new BadRequestException('Properties for sale must have either CLP or UF price');
    }

    if (dto.operationType === PropertyOperationType.RENT && !dto.rentPriceCLP && !dto.rentPriceUF) {
      throw new BadRequestException('Properties for rent must have either CLP or UF rent price');
    }

    if (dto.operationType === PropertyOperationType.SALE_AND_RENT) {
      if ((!dto.priceCLP && !dto.priceUF) || (!dto.rentPriceCLP && !dto.rentPriceUF)) {
        throw new BadRequestException('Properties for sale and rent must have both sale and rent prices');
      }
    }

    // Validate required fields based on status
    if (dto.status === PropertyStatus.PUBLISHED) {
      if (!dto.title || !dto.description) {
        throw new BadRequestException('Published properties must have title and description');
      }
    }
  }

  private validatePropertyUpdate(dto: UpdatePropertyDto): void {
    // Similar validation logic for updates
    if (dto.operationType) {
      // Add validation logic for operation type updates
    }
  }
}
