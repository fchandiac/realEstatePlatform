
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Property } from '../../entities/property.entity';
import { User } from '../../entities/user.entity';
import { CreatePropertyDto, UpdatePropertyDto, UpdatePropertyCharacteristicsDto } from './dto/property.dto';
import { UpdatePropertyLocationDto } from './dto/update-property-location.dto';
import { CreatePropertyDto as NewCreatePropertyDto } from './dto/create-property.dto';
import { UpdateMainImageDto } from './dto/create-property.dto';
import { UpdatePropertyPriceDto } from './dto/update-property-price.dto';
import { PropertyStatus } from '../../common/enums/property-status.enum';
import { PropertyOperationType } from '../../common/enums/property-operation-type.enum';
import { ChangeHistoryEntry, ViewEntry, LeadEntry } from '../../common/interfaces/property.interfaces';
import { GridSaleQueryDto } from './dto/grid-sale.dto';
import { GetFullPropertyDto } from './dto/get-full-property.dto';
import { plainToClass } from 'class-transformer';
import * as ExcelJS from 'exceljs';
import { NotificationsService } from '../notifications/notifications.service';
import { PropertyType } from '../../entities/property-type.entity';
import { Multimedia, MultimediaType, MultimediaFormat } from '../../entities/multimedia.entity';
import { RegionEnum } from '../../common/regions/regions.enum';
import { ComunaEnum } from '../../common/regions/comunas.enum';
import { CurrencyPriceEnum } from '../../entities/property.entity';
import { MultimediaService as UploadMultimediaService } from '../multimedia/services/multimedia.service';
import { MultimediaUploadMetadata } from '../multimedia/interfaces/multimedia.interface';
import { ConfigService } from '@nestjs/config';
import { UploadPropertyMultimediaDto } from './dto/upload-property-multimedia.dto';
import { FileUploadService } from '../../common/services/file-upload.service';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    private readonly notificationsService: NotificationsService,
    private readonly multimediaService: UploadMultimediaService,
      private readonly config: ConfigService,
    private readonly fileUploadService: FileUploadService,
    ) {
      this.publicBaseUrl = (
        this.config.get<string>('BACKEND_PUBLIC_URL') ||
        process.env.BACKEND_PUBLIC_URL ||
        ''
      ).replace(/\/$/, '');
    }

    private readonly publicBaseUrl: string;

  /**
   * Devuelve el total de propiedades en venta
   */
  async countSaleProperties(): Promise<number> {
    return await this.propertyRepository.count({
      where: { operationType: PropertyOperationType.SALE, deletedAt: IsNull() },
    });
  }

  /**
   * Devuelve el total de propiedades publicadas
   */
  async countPublishedProperties(): Promise<number> {
    return await this.propertyRepository.count({
      where: { status: PropertyStatus.PUBLISHED, deletedAt: IsNull() },
    });
  }

  /**
   * Devuelve el total de propiedades destacadas
   */
  async countFeaturedProperties(): Promise<number> {
    return await this.propertyRepository.count({
      where: { isFeatured: true, deletedAt: IsNull() },
    });
  }

  /**
   * Lista de propiedades publicadas para el portal (público, sin token)
   * Devuelve campos esenciales y relaciones mínimas.
   */
  async listPublishedPublic(): Promise<any[]> {
    const qb = this.propertyRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.propertyType', 'pt')
      .where('p.deletedAt IS NULL')
      .andWhere('p.status = :status', { status: PropertyStatus.PUBLISHED })
      .orderBy('p.publishedAt', 'DESC')
      .addOrderBy('p.createdAt', 'DESC');

    // Selección de campos compatibles con el PortalProperty
    qb.select([
      'p.id',
      'p.title',
      'p.description',
      'p.status',
      'p.operationType',
      'p.price',
      'p.currencyPrice',
      'p.city',
      'p.state',
      'p.mainImageUrl',
      'p.publishedAt',
      'p.bedrooms',
      'p.bathrooms',
      'p.builtSquareMeters',
      'p.landSquareMeters',
      'p.parkingSpaces',
      'p.isFeatured',
      'pt.id',
      'pt.name',
    ]);

    const items = await qb.getMany();

    // Propiedades que necesitan fallback de imagen principal
    const idsNeedingFallback = items
      .filter(p => !p.mainImageUrl || p.mainImageUrl.trim() === '')
      .map(p => p.id);

    // Buscar primera imagen por propiedad (PROPERTY_IMG) para fallback
    let firstUrlMap: Record<string, string> = {};
    if (idsNeedingFallback.length > 0) {
      const raws = await this.multimediaRepository
        .createQueryBuilder('m')
        .select(['m.propertyId AS propertyId', 'm.url AS url', 'm.createdAt AS createdAt'])
        .where('m.propertyId IN (:...ids)', { ids: idsNeedingFallback })
        .andWhere('m.type = :type', { type: MultimediaType.PROPERTY_IMG })
        .orderBy('m.propertyId', 'ASC')
        .addOrderBy('m.createdAt', 'ASC')
        .getRawMany<{ propertyId: string; url: string }>();

      const map: Record<string, string> = {};
      for (const r of raws) {
        if (!map[r.propertyId] && r.url) {
          map[r.propertyId] = r.url.replace('/../', '/');
        }
      }
      firstUrlMap = map;
    }

    const normalize = (u?: string | null) => (u && u.trim() !== '' ? u.replace('/../', '/') : null);
    const toAbsoluteMediaUrl = (u?: string | null): string | null => {
      if (!u) return null;
      const cleaned = u.replace('/../', '/');
      // Si ya es absoluta, retornar tal cual
      try {
        new URL(cleaned);
        return cleaned;
      } catch {
        // Si es relativa bajo /uploads, prefijar BACKEND_PUBLIC_URL si está configurada
        if (cleaned.startsWith('/uploads/')) {
          if (this.publicBaseUrl) return `${this.publicBaseUrl}${cleaned}`;
          return cleaned; // Último recurso: devolver relativa
        }
        return cleaned;
      }
    };

    // Mapear a la forma esperada por el portal (PortalProperty)
    return items.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description ?? null,
      status: p.status,
      operationType: p.operationType,
      price: p.price,
      currencyPrice: p.currencyPrice,
      state: p.state ?? null,
      city: p.city ?? null,
      propertyType: p.propertyType ? { id: p.propertyType.id, name: p.propertyType.name } : null,
      // Usa mainImageUrl si existe; si no, toma la primera imagen de multimedia y devuelve ABSOLUTA (canónica)
      mainImageUrl: toAbsoluteMediaUrl(normalize(p.mainImageUrl) ?? firstUrlMap[p.id] ?? null),
      // multimedia opcional: omitimos el arreglo para payload liviano
      bedrooms: p.bedrooms ?? null,
      bathrooms: p.bathrooms ?? null,
      builtSquareMeters: p.builtSquareMeters ?? null,
      landSquareMeters: p.landSquareMeters ?? null,
      parkingSpaces: p.parkingSpaces ?? null,
      isFeatured: !!p.isFeatured,
    }));
  }

  /**
   * Devuelve toda la información relevante de una propiedad, incluyendo relaciones y datos agregados.
   */
  async getFullProperty(id: string): Promise<GetFullPropertyDto> {
    const property = await this.propertyRepository.findOne({
      where: { id },
      relations: [
        'creatorUser',      // Usuario creador
        'assignedAgent',    // Agente asignado
        'propertyType',     // Tipo de propiedad
        'multimedia',       // Imágenes, videos, documentos
      ],
      select: [
        'id', 'title', 'description', 'status', 'operationType',
        'creatorUserId', 'assignedAgentId', 'propertyTypeId',
        'price', 'currencyPrice', 'seoTitle', 'seoDescription',
        'publicationDate', 'isFeatured', 'builtSquareMeters', 'landSquareMeters',
        'bedrooms', 'bathrooms', 'parkingSpaces', 'floors', 'constructionYear',
        'state', 'city', 'address', 'latitude', 'longitude',
        'internalNotes', 'createdAt', 'updatedAt', 'deletedAt', 'publishedAt',
        'changeHistory', 'views', 'leads' // Incluir campos JSON
      ]
    });

    if (!property) throw new NotFoundException('Property not found');

    // Datos agregados
    const favoritesCount = await this.getFavoritesCount(id);
    const leadsCount = await this.getLeadsCount(id);
    const viewsCount = await this.getViewsCount(id);

    // Crear objeto con datos agregados
    const fullProperty = {
      ...property,
      favoritesCount,
      leadsCount,
      viewsCount,
    };

    // Transformar a DTO
    return plainToClass(GetFullPropertyDto, fullProperty, { excludeExtraneousValues: true });
  }

  /**
   * Devuelve cuántas veces la propiedad ha sido marcada como favorita.
   * Si tienes una tabla/relación de favoritos, ajusta el query.
   */
  async getFavoritesCount(propertyId: string): Promise<number> {
    // Si tienes una relación property.favorites, ajusta aquí
    // Ejemplo: contar favoritos en una tabla 'favorites' con propertyId
    // Aquí se asume que no existe, así que retorna 0
    return 0;
  }

  /**
   * Devuelve cuántos leads/interesados tiene la propiedad.
   */
  async getLeadsCount(propertyId: string): Promise<number> {
    const property = await this.propertyRepository.findOne({ where: { id: propertyId } });
    if (!property || !property.leads) return 0;
    return Array.isArray(property.leads) ? property.leads.length : 0;
  }

  /**
   * Devuelve cuántas veces ha sido vista la propiedad.
   */
  async getViewsCount(propertyId: string): Promise<number> {
    const property = await this.propertyRepository.findOne({ where: { id: propertyId } });
    if (!property || !property.views) return 0;
    return Array.isArray(property.views) ? property.views.length : 0;
  }

  // ...existing methods...

  // Exporta Excel para el grid de propiedades en venta
  async exportSalePropertiesExcel(query: GridSaleQueryDto): Promise<Buffer> {
    // Columnas del DataGrid de sale (deben coincidir con el frontend)
    const columns = [
      { key: 'id', header: 'ID' },
      { key: 'title', header: 'Título' },
      { key: 'status', header: 'Estado' },
      { key: 'operationType', header: 'Operación' },
      { key: 'typeName', header: 'Tipo' },
      { key: 'assignedAgentName', header: 'Agente' },
      { key: 'city', header: 'Ciudad' },
      { key: 'state', header: 'Región' },
      { key: 'price', header: 'Precio' },
      { key: 'createdAt', header: 'Creado' },
    ];

    // Forzar siempre el parámetro fields para que gridSaleProperties devuelva todos los datos necesarios
    const fields = columns.map(c => c.key).join(',');
    const gridResult = await this.gridSaleProperties({ ...query, fields, pagination: 'false' });
    const rows = Array.isArray(gridResult) ? gridResult : gridResult.data;

    // Crear workbook y hoja
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Propiedades en Venta');

    // Definir columnas
    sheet.columns = columns.map(col => ({ key: col.key, header: col.header, width: 22 }));

    // Agregar filas
    rows.forEach(row => {
      const excelRow: Record<string, any> = {};
      columns.forEach(col => {
        excelRow[col.key] = row[col.key] ?? '';
      });
      sheet.addRow(excelRow);
    });

    // Estilo: bordes en todas las celdas
    sheet.eachRow({ includeEmpty: true }, (row) => {
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    // Generar buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }



  async create(
    createPropertyDto: CreatePropertyDto,
    creatorId?: string,
  ): Promise<Property> {
    // Validate business rules
    this.validatePropertyData(createPropertyDto);

    // Create property with proper relationships
    const property = this.propertyRepository.create({
      ...createPropertyDto,
      description: createPropertyDto.description ?? undefined,
      address: createPropertyDto.address ?? undefined,
      creatorUserId: creatorId || createPropertyDto.creatorUserId,
      propertyTypeId:
        (createPropertyDto as any).propertyTypeId ||
        (createPropertyDto as any).propertyType ||
        undefined,
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

    if (filters.propertyTypeId || filters.propertyType) {
      const pTypeId = filters.propertyTypeId || filters.propertyType;
      query.andWhere('property.propertyTypeId = :propertyTypeId', {
        propertyTypeId: pTypeId,
      });
    }

    if (filters.state) {
      query.andWhere('property.state = :state', {
        state: filters.state,
      });
    }

    if (filters.city) {
      query.andWhere('property.city = :city', {
        city: filters.city,
      });
    }

    if (filters.minPrice) {
      query.andWhere('property.price >= :minPrice', {
        minPrice: filters.minPrice,
      });
    }

    if (filters.maxPrice) {
      query.andWhere('property.price <= :maxPrice', {
        maxPrice: filters.maxPrice,
      });
    }

    if (filters.bedrooms) {
      query.andWhere('property.bedrooms >= :bedrooms', {
        bedrooms: filters.bedrooms,
      });
    }

    if (filters.bathrooms) {
      query.andWhere('property.bathrooms >= :bathrooms', {
        bathrooms: filters.bathrooms,
      });
    }

    if (filters.isFeatured !== undefined) {
      query.andWhere('property.isFeatured = :isFeatured', {
        isFeatured: filters.isFeatured,
      });
    }

    // Sorting
    if (filters.sortBy) {
      const direction = filters.sortDirection || 'ASC';
      query.orderBy(`property.${filters.sortBy}`, direction);
    } else {
      // priority removed from model; order by featured and creation date
      query
        .orderBy('property.isFeatured', 'DESC')
        .addOrderBy('property.publishedAt', 'DESC')
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

  async findOne(
    id: string,
    trackView: boolean = true,
    viewData?: any,
  ): Promise<Property> {
    const property = await this.propertyRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: [
        'creatorUser',
        'assignedAgent', 
        'propertyType',
        'multimedia'
      ],
    });

    if (!property) {
      console.log('❌ [PropertyService.findOne] Propiedad no encontrada con ID:', id);
      throw new NotFoundException('Propiedad no encontrada.');
    }

    console.log('✅ [PropertyService.findOne] Propiedad encontrada:', {
      id: property.id,
      title: property.title,
      hasMultimedia: property.multimedia ? property.multimedia.length : 0,
      hasPropertyType: !!property.propertyType,
      propertyTypeId: property.propertyType?.id,
      propertyTypeName: property.propertyType?.name,
      multimediaItems: property.multimedia?.map(m => ({ id: m.id, type: m.type, filename: m.filename })) || []
    });

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
    const oldAssignedAgentId = property.assignedAgentId;

    // Validate update data
    this.validatePropertyUpdate(updatePropertyDto);

    // Track changes for history with improved comparison logic
    const changes: ChangeHistoryEntry[] = [];

    for (const [key, newValue] of Object.entries(updatePropertyDto)) {
      // Skip undefined values (fields not being updated)
      if (newValue === undefined) continue;

      const currentValue = property[key];

      // Improved comparison that handles different data types
      let hasChanged = false;

      if (currentValue !== newValue) {
        // Handle null/undefined comparisons
        if ((currentValue == null && newValue != null) ||
            (currentValue != null && newValue == null)) {
          hasChanged = true;
        }
        // Handle string/number comparisons
        else if (typeof currentValue !== typeof newValue) {
          hasChanged = true;
        }
        // Handle boolean comparisons
        else if (typeof newValue === 'boolean') {
          hasChanged = Boolean(currentValue) !== Boolean(newValue);
        }
        // Handle string comparisons (case sensitive)
        else if (typeof newValue === 'string') {
          hasChanged = String(currentValue || '').trim() !== String(newValue).trim();
        }
        // Handle number comparisons
        else if (typeof newValue === 'number') {
          hasChanged = Number(currentValue || 0) !== Number(newValue);
        }
        // Default comparison for other types
        else {
          hasChanged = currentValue !== newValue;
        }
      }

      if (hasChanged) {
        changes.push({
          timestamp: new Date(),
          changedBy: updatedBy || 'system',
          field: key,
          previousValue: currentValue,
          newValue: newValue,
        });
      }
    }

    // Update property
    Object.assign(property, updatePropertyDto);
    if ('description' in updatePropertyDto) {
      property.description = updatePropertyDto.description ?? undefined;
    }
    if ('address' in updatePropertyDto) {
      property.address = updatePropertyDto.address ?? undefined;
    }
    property.lastModifiedAt = new Date();

    // Add change history only if there are actual changes
    if (changes.length > 0) {
      property.changeHistory = [...(property.changeHistory || []), ...changes];
    }

    const savedProperty = await this.propertyRepository.save(property);

    // Send notification for agent assignment
    if (updatePropertyDto.assignedAgentId && oldAssignedAgentId !== updatePropertyDto.assignedAgentId) {
      try {
        // Load the assigned agent
        const agent = await this.propertyRepository.manager.findOne(User, {
          where: { id: updatePropertyDto.assignedAgentId },
        });
        if (agent) {
          await this.notificationsService.notifyAgentAssigned(savedProperty, agent);
        }
      } catch (error) {
        // Log error but don't fail the operation
        console.error('Failed to send agent assignment notification:', error);
      }
    }

    return savedProperty;
  }

  async updateStatus(
    id: string,
    status: PropertyStatus,
    updatedBy?: string,
  ): Promise<Property> {
    const property = await this.findOne(id, false);
    const oldStatus = property.status;

    const historyEntry: ChangeHistoryEntry = {
      timestamp: new Date(),
      changedBy: updatedBy || 'system',
      field: 'status',
      previousValue: property.status,
      newValue: status,
    };

    property.status = status;
    property.lastModifiedAt = new Date();
    property.changeHistory = [...(property.changeHistory || []), historyEntry];

    // Set publication date if publishing
    if (status === PropertyStatus.PUBLISHED && !property.publishedAt) {
      property.publishedAt = new Date();
    }

    const savedProperty = await this.propertyRepository.save(property);

    // Send notification for status change
    if (oldStatus !== status) {
      try {
        await this.notificationsService.notifyPropertyStatusChange(savedProperty, oldStatus, status);
      } catch (error) {
        // Log error but don't fail the operation
        console.error('Failed to send property status change notification:', error);
      }
    }

    return savedProperty;
  }

  async addView(id: string, viewData: any = {}): Promise<void> {
    const property = await this.findOne(id, false);

    const viewEntry: ViewEntry = {
      timestamp: new Date(),
      userId: viewData.userId,
    };

    property.views = [...(property.views || []), viewEntry];

    await this.propertyRepository.save(property);
  }

  async addLead(id: string, leadData: LeadEntry): Promise<void> {
    const property = await this.findOne(id, false);

    leadData.timestamp = new Date();
    leadData.status = leadData.status || 'new';

    property.leads = [...(property.leads || []), leadData];

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
    };

    property.changeHistory = [...(property.changeHistory || []), historyEntry];
    await this.propertyRepository.save(property);

    await this.propertyRepository.softDelete(id);
  }

  private validatePropertyData(dto: CreatePropertyDto): void {
    // Validate operation type and pricing
    // Require a price for sale or rent operations
    if (
      (dto.operationType === PropertyOperationType.SALE ||
        dto.operationType === PropertyOperationType.RENT) &&
      (dto.price === undefined || dto.price === null)
    ) {
      throw new BadRequestException(
        'Properties must include a price for the selected operation',
      );
    }

    // Validate required fields based on status
    if (dto.status === PropertyStatus.PUBLISHED) {
      if (!dto.title || !dto.description) {
        throw new BadRequestException(
          'Published properties must have title and description',
        );
      }
    }
  }

  private validatePropertyUpdate(dto: UpdatePropertyDto): void {
    // Similar validation logic for updates
    if (dto.operationType) {
      // Add validation logic for operation type updates
    }
  }

  // Grid for SALE properties compatible with DataGrid
  async gridSaleProperties(query: GridSaleQueryDto) {
    console.log('gridSaleProperties called with query:', query);
    // Allowed fields and mappings
    const availableFields = [
      'id',
      'title',
      'status',
      'operationType',
      'typeName',
      'characteristics',
      'assignedAgentName',
      'city',
      'state',
      'priceDisplay',
      'price',
      'currencyPrice',
      'createdAt',
      'updatedAt',
    ];

    const fieldMappings: Record<string, string> = {
      id: 'p.id',
      title: 'p.title',
      status: 'p.status',
      operationType: 'p.operationType',
      typeName: 'pt.name AS typeName',
      city: 'p.city',
      state: 'p.state',
      price: 'p.price',
      currencyPrice: 'p.currencyPrice',
      createdAt: 'p.createdAt',
      updatedAt: 'p.updatedAt',
      // assignedAgentName should sort by agent username
      assignedAgentName: 'a.username',
      // characteristics and priceDisplay are derived post-query
    };

    const textSearchFields = [
      'LOWER(p.title)',
      'LOWER(pt.name)',
      'LOWER(a.username)',
      'LOWER(p.city)',
      'LOWER(p.state)',
    ];

    // Parse fields
    const requested = (query.fields || '')
      .split(',')
      .map((f) => f.trim())
      .filter((f) => f);
    const fields = requested.length
      ? requested.filter((f) => availableFields.includes(f))
      : availableFields;

    if (fields.length === 0) {
      if (query.pagination === 'true') {
        return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
      }
      return [];
    }

    // Build select (raw) for non-derived fields, usando alias exactos para cada campo
    const rawSelects = fields
      .filter((f) => !['characteristics', 'priceDisplay', 'assignedAgentName'].includes(f))
      .map((f) => {
        // Si el mapping ya tiene un alias (AS ...), úsalo tal cual
        if (fieldMappings[f] && fieldMappings[f].includes(' AS ')) return fieldMappings[f];
        // Si es un campo directo, forzar alias igual al nombre esperado
        if (fieldMappings[f]) return `${fieldMappings[f]} AS ${f}`;
        return `p.${f} AS ${f}`;
      });

    // Always include needed base fields for derivations if requested
    const needCharacteristics = fields.includes('characteristics');
    const needPriceDisplay = fields.includes('priceDisplay');
    if (needCharacteristics) {
      rawSelects.push(
        'p.bedrooms',
        'p.bathrooms',
        'p.landSquareMeters',
        'p.builtSquareMeters',
        'p.parkingSpaces',
        'p.floors',
      );
    }
    if (needPriceDisplay) {
      rawSelects.push('p.price', 'p.currencyPrice');
    }

    // assignedAgentName derivation needs agent personalInfo and username
    const needAgentName = fields.includes('assignedAgentName');
    if (needAgentName) {
      rawSelects.push('a.personalInfo AS assignedPersonalInfo');
      rawSelects.push('a.username AS assignedUsername');
    }

    // Fallback: ensure id exists in selection for identity mapping
    if (!rawSelects.find((s) => s.startsWith('p.id'))) rawSelects.unshift('p.id');

    const qb = this.propertyRepository
      .createQueryBuilder('p')
      .leftJoin('p.propertyType', 'pt')
      .leftJoin('p.assignedAgent', 'a')
      .where('p.deletedAt IS NULL')
      .andWhere('p.operationType = :op', { op: PropertyOperationType.SALE });

        // Column filters
    const filtration = query.filtration === 'true';
    console.log('[DEBUG] gridSaleProperties - filtration enabled:', filtration);
    if (filtration && query.filters) {
      const items = query.filters
        .split(',')
        .map((f) => f.trim())
        .filter((f) => f.includes('-'))
        .map((f) => {
          const dash = f.indexOf('-');
          return {
            column: f.substring(0, dash).trim(),
            value: decodeURIComponent(f.substring(dash + 1).trim()),
          };
        })
        .filter((f) => f.column && f.value && availableFields.includes(f.column));

      console.log('[DEBUG] gridSaleProperties - Parsed filter items:', items);

      for (const f of items) {
        if (f.column === 'assignedAgentName') {
          // Filtrar por username o por nombre en personalInfo (JSON)
          const param = `%${f.value.toLowerCase()}%`;
          // Busca en username y en personalInfo (firstName, lastName)
          qb.andWhere(
            `(
              LOWER(a.username) LIKE :f_assignedAgentName
              OR LOWER(JSON_UNQUOTE(JSON_EXTRACT(a.personalInfo, '$.firstName'))) LIKE :f_assignedAgentName
              OR LOWER(JSON_UNQUOTE(JSON_EXTRACT(a.personalInfo, '$.lastName'))) LIKE :f_assignedAgentName
            )`,
            { f_assignedAgentName: param }
          );
          console.log('[DEBUG] gridSaleProperties - Applying filter: assignedAgentName LIKE', param);
        } else {
          const mapping = fieldMappings[f.column] || `p.${f.column}`;
          const dbField = mapping.split(' AS ')[0];
          console.log(`[DEBUG] gridSaleProperties - Applying filter: ${f.column} LIKE '%${f.value}%' on field ${dbField}`);
          const param = `%${f.value.toLowerCase()}%`;
          qb.andWhere(`LOWER(${dbField}) LIKE :f_${f.column}`, {
            [`f_${f.column}`]: param,
          });
        }
      }
    }

    // Global search
    if (query.search && query.search.trim() !== '') {
      const needle = query.search.trim().toLowerCase();
      const orExpr = textSearchFields
        .map((f, idx) => `${f} LIKE :s${idx}`)
        .join(' OR ');
      const params = Object.fromEntries(
        textSearchFields.map((_, idx) => [`s${idx}`, `%${needle}%`]),
      );
      qb.andWhere(`(${orExpr})`, params);
    }

    // Sorting
    const sortDir = query.sort === 'desc' ? 'DESC' : 'ASC';
    const sortField = query.sortField && availableFields.includes(query.sortField)
      ? query.sortField
      : undefined;
    if (sortField) {
      const mapping = fieldMappings[sortField] || `p.${sortField}`;
      const dbField = mapping.split(' AS ')[0];
      qb.orderBy(dbField, sortDir as 'ASC' | 'DESC');
    } else {
      qb.orderBy('p.publishedAt', 'DESC').addOrderBy('p.createdAt', 'DESC');
    }

    // Selects
    qb.select(rawSelects);

    // Pagination
    const doPaginate = query.pagination === 'true';
    let total = 0;
    let page = Math.max(1, query.page || 1);
    let limit = Math.min(Math.max(1, query.limit || 10), 100);

    if (doPaginate) {
      total = await qb.getCount();
      console.log('Total properties with operationType SALE:', total);
      const totalPages = Math.ceil(total / limit);
      const offset = (page - 1) * limit;
      qb.limit(limit).offset(offset);
      const rows = await qb.getRawMany();
      console.log('Raw rows from query:', rows.length);
      const data = rows.map((r: any) => this.mapGridRow(r, fields));
      console.log('Mapped data:', data.length);
      return { data, total, page, limit, totalPages };
    }

    const rows = await qb.getRawMany();
    console.log('Raw rows from non-paginated query:', rows.length);
    return rows.map((r: any) => this.mapGridRow(r, fields));
  }

  private mapGridRow(raw: any, fields: string[]) {
    // Normalize aliases from getRawMany: use column names from mappings or fall back
    const row: any = { ...raw };

    // Derived: assignedAgentName from personalInfo or username
    if (fields.includes('assignedAgentName')) {
      let name = '';
      const rawPI = row.assignedPersonalInfo;
      try {
        const pi = typeof rawPI === 'string' ? JSON.parse(rawPI) : rawPI;
        const fn = (pi?.firstName || '').toString().trim();
        const ln = (pi?.lastName || '').toString().trim();
        name = `${fn} ${ln}`.trim();
      } catch (_) {
        // ignore JSON parse errors
      }
      if (!name) name = (row.assignedUsername || '').toString();
      row.assignedAgentName = name.trim();
    }

    // Derived: characteristics
    if (fields.includes('characteristics')) {
      const parts: string[] = [];
      const bedrooms = toInt(row.bedrooms);
      const bathrooms = toInt(row.bathrooms);
      const land = toNumber(row.landSquareMeters);
      const built = toNumber(row.builtSquareMeters);
      const parking = toInt(row.parkingSpaces);
      const floors = toInt(row.floors);

      if (bedrooms > 0) parts.push(`${bedrooms}D`);
      if (bathrooms > 0) parts.push(`${bathrooms}B`);
      if (isFiniteNumber(land) && land > 0) parts.push(`${Math.round(land)}m²T`);
      if (isFiniteNumber(built) && built > 0) parts.push(`${Math.round(built)}m²C`);
      if (parking > 0) parts.push(`${parking}E`);
      if (floors > 0) parts.push(`${floors}P`);
      row.characteristics = parts.join('/');
    }

    // Derived: priceDisplay
    if (fields.includes('priceDisplay')) {
      const price = toNumber(row.price);
      const currency = row.currencyPrice;
      row.priceDisplay = formatPrice(price, currency);
    }

    // Remove base fields used only for derivations if they were not explicitly requested
    const baseFieldsForChar = ['bedrooms', 'bathrooms', 'landSquareMeters', 'builtSquareMeters', 'parkingSpaces', 'floors'];
    for (const bf of baseFieldsForChar) {
      if (!fields.includes(bf) && bf in row) delete row[bf];
    }
  if (!fields.includes('price') && 'price' in row) delete row.price;
  if (!fields.includes('currencyPrice') && 'currencyPrice' in row) delete row.currencyPrice;
  if (!fields.includes('assignedPersonalInfo') && 'assignedPersonalInfo' in row) delete row.assignedPersonalInfo;
  if (!fields.includes('assignedUsername') && 'assignedUsername' in row) delete row.assignedUsername;

    return row;
  }

  @InjectRepository(Multimedia)
  private readonly multimediaRepository: Repository<Multimedia>;

  @InjectRepository(PropertyType)
  private readonly propertyTypeRepository: Repository<PropertyType>;

  async createPropertyWithFiles(
    createPropertyDto: NewCreatePropertyDto, 
    creatorId: string, 
    multimediaFiles: Express.Multer.File[]
  ): Promise<Property> {
    console.log('🚀 [PropertyService.createPropertyWithFiles] ===== METHOD CALLED =====');
    console.log('📋 [PropertyService.createPropertyWithFiles] DTO received:', {
      title: createPropertyDto.title,
      hasMultimedia: !!createPropertyDto.multimedia,
      multimediaCount: createPropertyDto.multimedia?.length || 0
    });
    console.log('📁 [PropertyService.createPropertyWithFiles] Multimedia files received separately:', {
      filesCount: multimediaFiles.length,
      filesDetails: multimediaFiles.map(f => ({
        originalname: f.originalname,
        filename: f.filename,
        size: f.size,
        path: f.path
      }))
    });
    console.log('👤 [PropertyService.createPropertyWithFiles] Creator user ID:', creatorId);

    // 1. Crear propiedad base
    console.log('🔨 [PropertyService] Step 1: Creating property base...');
    const property = await this.createPropertyBase(createPropertyDto, creatorId);
    console.log('✅ [PropertyService] Property base created');

    // 2. Asignar ubicación
    console.log('🗺️ [PropertyService] Step 2: Assigning location...');
    await this.assignPropertyLocation(property, createPropertyDto);
    console.log('✅ [PropertyService] Location assigned');

    // 3. Procesar multimedia si existe
    if (createPropertyDto.multimedia?.length) {
      console.log('📸 [PropertyService] Step 3: Processing multimedia metadata...');
      await this.processPropertyMultimedia(property, createPropertyDto.multimedia);
      console.log('✅ [PropertyService] Multimedia metadata processed');
    } else {
      console.log('📭 [PropertyService] Step 3: No multimedia metadata to process');
    }

    // 4. Guardar propiedad PRIMERO para obtener ID válido
    console.log('💾 [PropertyService] Step 4: Saving property to get ID...');
    const savedProperty = await this.propertyRepository.save(property);
    console.log('✅ [PropertyService] Property saved with ID:', savedProperty.id);

    // 5. Procesar archivos multimedia si existen (después de tener ID)
    if (multimediaFiles && multimediaFiles.length > 0) {
      console.log('📁 [PropertyService] Step 5: Processing multimedia FILES...');
      console.log('📸 [PropertyService] Files to process:', multimediaFiles.length);
      await this.processPropertyMultimediaFiles(savedProperty, multimediaFiles);
      console.log('✅ [PropertyService] Multimedia files processed');
    } else {
      console.log('📭 [PropertyService] Step 5: No multimedia FILES to process');
    }

    // 6. Retornar propiedad con multimedia procesado
    console.log('🔄 [PropertyService] Step 6: Loading property with relations...');
    const finalProperty = await this.propertyRepository.findOne({
      where: { id: savedProperty.id },
      relations: ['multimedia', 'propertyType', 'creatorUser']
    });
    
    console.log('🎉 [PropertyService] ===== PROPERTY CREATION COMPLETED =====');
    console.log('📊 [PropertyService] Final result:', {
      id: finalProperty?.id,
      title: finalProperty?.title,
      multimediaCount: finalProperty?.multimedia?.length || 0,
      multimediaItems: finalProperty?.multimedia?.map(m => ({
        id: m.id,
        filename: m.filename,
        propertyId: m.propertyId
      })) || []
    });
    
    return finalProperty || savedProperty;
  }

  async createProperty(createPropertyDto: NewCreatePropertyDto, creatorId?: string): Promise<Property> {
    console.log('🏗️ [PropertyService] ===== STARTING PROPERTY CREATION =====');
    console.log('📋 [PropertyService] DTO received:', {
      title: createPropertyDto.title,
      hasMultimediaFiles: !!createPropertyDto.multimediaFiles,
      multimediaFilesCount: createPropertyDto.multimediaFiles?.length || 0,
      hasMultimedia: !!createPropertyDto.multimedia,
      multimediaCount: createPropertyDto.multimedia?.length || 0
    });
    console.log('👤 [PropertyService] Creator user ID:', creatorId);

    // 1. Crear propiedad base
    console.log('🔨 [PropertyService] Step 1: Creating property base...');
    const property = await this.createPropertyBase(createPropertyDto, creatorId);
    console.log('✅ [PropertyService] Property base created');

    // 2. Asignar ubicación
    console.log('🗺️ [PropertyService] Step 2: Assigning location...');
    await this.assignPropertyLocation(property, createPropertyDto);
    console.log('✅ [PropertyService] Location assigned');

    // 3. Procesar multimedia si existe
    if (createPropertyDto.multimedia?.length) {
      console.log('📸 [PropertyService] Step 3: Processing multimedia metadata...');
      await this.processPropertyMultimedia(property, createPropertyDto.multimedia);
      console.log('✅ [PropertyService] Multimedia metadata processed');
    } else {
      console.log('📭 [PropertyService] Step 3: No multimedia metadata to process');
    }

    // 4. Guardar propiedad PRIMERO para obtener ID válido
    console.log('💾 [PropertyService] Step 4: Saving property to get ID...');
    const savedProperty = await this.propertyRepository.save(property);
    console.log('✅ [PropertyService] Property saved with ID:', savedProperty.id);

    // 5. Procesar archivos multimedia si existen (después de tener ID)
    if (createPropertyDto.multimediaFiles?.length) {
      console.log('📁 [PropertyService] Step 5: Processing multimedia FILES...');
      console.log('📸 [PropertyService] Files to process:', createPropertyDto.multimediaFiles.length);
      await this.processPropertyMultimediaFiles(savedProperty, createPropertyDto.multimediaFiles);
      console.log('✅ [PropertyService] Multimedia files processed');
    } else {
      console.log('📭 [PropertyService] Step 5: No multimedia FILES to process');
    }

    // 6. Retornar propiedad con multimedia procesado
    console.log('🔄 [PropertyService] Step 6: Loading property with relations...');
    const finalProperty = await this.propertyRepository.findOne({
      where: { id: savedProperty.id },
      relations: ['multimedia', 'propertyType', 'creatorUser']
    });
    
    console.log('🎉 [PropertyService] ===== PROPERTY CREATION COMPLETED =====');
    console.log('📊 [PropertyService] Final result:', {
      id: finalProperty?.id,
      title: finalProperty?.title,
      multimediaCount: finalProperty?.multimedia?.length || 0,
      multimediaItems: finalProperty?.multimedia?.map(m => ({
        id: m.id,
        filename: m.filename,
        propertyId: m.propertyId
      })) || []
    });
    
    return finalProperty || savedProperty;
  }

  // Sub-método 1: Crear propiedad base
  private async createPropertyBase(dto: NewCreatePropertyDto, creatorId?: string): Promise<Property> {
    const property = new Property();

    // Datos básicos
    property.title = dto.title;
    property.description = dto.description;
    // ✅ @Transform in DTO already converts numbers to correct enum strings
    property.status = dto.status as PropertyStatus;
    property.operationType = dto.operationType as PropertyOperationType;

    // Usuario creador
    property.creatorUserId = creatorId;

    // Relaciones básicas
    if (dto.propertyTypeId) {
      property.propertyTypeId = dto.propertyTypeId;
    }

    // Características (todas opcionales ahora)
    property.bedrooms = dto.bedrooms;
    property.bathrooms = dto.bathrooms;
    property.parkingSpaces = dto.parkingSpaces;
    property.floors = dto.floors;
    property.builtSquareMeters = dto.builtSquareMeters;
    property.landSquareMeters = dto.landSquareMeters;
    property.constructionYear = dto.constructionYear;

    // Precio (con valor por defecto si no se proporciona)
    property.price = dto.price !== undefined && dto.price !== null ? dto.price : 0;
    
    // Currency con valor por defecto
    property.currencyPrice = dto.currencyPrice === 'UF' ? CurrencyPriceEnum.UF : CurrencyPriceEnum.CLP;

    // SEO
    property.seoTitle = dto.seoTitle;
    property.seoDescription = dto.seoDescription;

    // Ubicación básica
    property.address = dto.address;
    if (dto.location) {
      property.latitude = dto.location.lat;
      property.longitude = dto.location.lng;
    }

    // Notas internas
    property.internalNotes = dto.internalNotes;

    // Historial de cambios
    property.changeHistory = [{
      timestamp: new Date(),
      changedBy: creatorId || 'system',
      field: 'creation',
      previousValue: null,
      newValue: 'Created',
    }];

    return property;
  }

  // Sub-método 2: Asignar ubicación
  private async assignPropertyLocation(property: Property, dto: NewCreatePropertyDto): Promise<void> {
    // Los campos ya vienen como strings después del @Transform en el DTO
    if (dto.state) {
      property.state = dto.state as RegionEnum;
    }
    if (dto.city) {
      property.city = dto.city as ComunaEnum;
    }
  }

  // Sub-método 3: Procesar multimedia
  private async processPropertyMultimedia(
    property: Property,
    multimedia: any[]
  ): Promise<void> {
    const multimediaEntities: Multimedia[] = [];

    for (const mediaDto of multimedia) {
      const media = new Multimedia();
      media.propertyId = property.id; // Se asignará después de guardar la propiedad
      media.url = mediaDto.url;
      media.filename = mediaDto.filename;
      media.type = mediaDto.type === 'image' ? MultimediaType.PROPERTY_IMG : MultimediaType.PROPERTY_VIDEO;
      media.format = mediaDto.type === 'image' ? MultimediaFormat.IMG : MultimediaFormat.VIDEO;

      multimediaEntities.push(media);
    }

    // Nota: Los archivos multimedia se guardarán después de que la propiedad tenga ID
    property.multimedia = multimediaEntities;
  }

  // Sub-método 4: Procesar archivos multimedia (nuevo - para un solo paso)
  private async processPropertyMultimediaFiles(
    property: Property,
    files: Express.Multer.File[]
  ): Promise<void> {
    console.log('📁 [PropertyService.processFiles] ===== PROCESSING MULTIMEDIA FILES =====');
    console.log('📊 [PropertyService.processFiles] Property ID:', property.id);
    console.log('📊 [PropertyService.processFiles] Property title:', property.title);
    console.log('📊 [PropertyService.processFiles] Files count:', files.length);
    console.log('📋 [PropertyService.processFiles] Files details:', files.map(f => ({
      originalname: f.originalname,
      filename: f.filename,
      mimetype: f.mimetype,
      size: f.size,
      path: f.path
    })));
    
    if (!property.id) {
      console.error('❌ [PropertyService.processFiles] CRITICAL ERROR: Property ID is null/undefined!');
      throw new Error('Property ID is required to associate multimedia');
    }
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(`\n📸 [PropertyService.processFiles] Processing file ${i + 1}/${files.length}: ${file.originalname}`);
      
      try {
        // Determinar el tipo de multimedia basado en el mimetype
        const isImage = file.mimetype.startsWith('image/');
        const multimediaType = isImage ? MultimediaType.PROPERTY_IMG : MultimediaType.PROPERTY_VIDEO;

        console.log('🏷️ [PropertyService.processFiles] File type determined:', {
          isImage,
          multimediaType,
          mimetype: file.mimetype
        });

        // Crear metadata para el upload
        const metadata: MultimediaUploadMetadata = {
          type: multimediaType,
          seoTitle: file.originalname,
          description: `Multimedia for property ${property.title}`,
        };

        console.log('📋 [PropertyService.processFiles] Metadata created:', metadata);
        console.log('🚀 [PropertyService.processFiles] Calling multimediaService.uploadFile...');

        // Usar el servicio de multimedia para subir el archivo
        const multimedia = await this.multimediaService.uploadFile(
          file,
          metadata,
          property.creatorUserId || 'system'
        );

        console.log('✅ [PropertyService.processFiles] File uploaded via service:', {
          id: multimedia.id,
          filename: multimedia.filename,
          currentPropertyId: multimedia.propertyId,
          targetPropertyId: property.id
        });

        // Asignar la propiedad al archivo multimedia
        console.log('🔗 [PropertyService.processFiles] Associating with property...');
        multimedia.propertyId = property.id;
        
        console.log('💾 [PropertyService.processFiles] Saving multimedia with propertyId:', {
          multimediaId: multimedia.id,
          propertyId: multimedia.propertyId,
          filename: multimedia.filename
        });
        
        const savedMultimedia = await this.multimediaRepository.save(multimedia);
        
        console.log('✅ [PropertyService.processFiles] Multimedia saved successfully:', {
          id: savedMultimedia.id,
          filename: savedMultimedia.filename,
          propertyId: savedMultimedia.propertyId,
          url: savedMultimedia.url
        });

      } catch (error) {
        console.error(`❌ [PropertyService.processFiles] ERROR processing file ${file.originalname}:`, {
          error: error.message,
          stack: error.stack,
          file: {
            originalname: file.originalname,
            filename: file.filename,
            path: file.path
          }
        });
        // Continuar con el siguiente archivo en caso de error
        console.log('⚠️ [PropertyService.processFiles] Continuing with next file...');
      }
    }
    
    console.log('🏁 [PropertyService.processFiles] ===== MULTIMEDIA PROCESSING COMPLETED =====');
  }

  // Sub-método 4: Asignar agente
  private async assignPropertyAgent(property: Property, agentId: string): Promise<void> {
    const agent = await this.propertyRepository.manager.findOne(User, {
      where: { id: agentId }
    });
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }
    property.assignedAgentId = agentId;
  }

  // Método auxiliar para parsear precio
  private parsePrice(priceString: string): number {
    // Convertir formato currency (ej: "1.500.000") a número
    return parseFloat(priceString.replace(/\./g, '').replace(',', '.'));
  }

  async updateMainImage(id: string, mainImageUrl: string, updatedBy?: string): Promise<Property> {
    const property = await this.propertyRepository.findOne({ where: { id } });
    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const oldMainImageUrl = property.mainImageUrl;

    // Add change to history
    const historyEntry: ChangeHistoryEntry = {
      timestamp: new Date(),
      changedBy: updatedBy || 'system',
      field: 'mainImageUrl',
      previousValue: oldMainImageUrl,
      newValue: mainImageUrl,
    };

    property.mainImageUrl = mainImageUrl;
    property.lastModifiedAt = new Date();
    property.changeHistory = [...(property.changeHistory || []), historyEntry];

    return this.propertyRepository.save(property);
  }

  /**
   * Actualiza la información de precio y SEO de una propiedad
   */
  async updatePrice(
    id: string,
    dto: UpdatePropertyPriceDto,
    updatedBy?: string
  ): Promise<Property> {
    const property = await this.propertyRepository.findOne({ where: { id } });
    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const changes: ChangeHistoryEntry[] = [];

    // Actualizar precio si se proporciona
    if (dto.price !== undefined && dto.price !== property.price) {
      changes.push({
        timestamp: new Date(),
        changedBy: updatedBy || 'system',
        field: 'price',
        previousValue: property.price?.toString() || null,
        newValue: dto.price.toString(),
      });
      property.price = dto.price;
    }

    // Actualizar moneda si se proporciona
    if (dto.currencyPrice !== undefined && dto.currencyPrice !== property.currencyPrice) {
      changes.push({
        timestamp: new Date(),
        changedBy: updatedBy || 'system',
        field: 'currencyPrice',
        previousValue: property.currencyPrice || null,
        newValue: dto.currencyPrice,
      });
      property.currencyPrice = dto.currencyPrice;
    }

    // Actualizar título SEO si se proporciona
    if (dto.seoTitle !== undefined && dto.seoTitle !== property.seoTitle) {
      changes.push({
        timestamp: new Date(),
        changedBy: updatedBy || 'system',
        field: 'seoTitle',
        previousValue: property.seoTitle || null,
        newValue: dto.seoTitle,
      });
      property.seoTitle = dto.seoTitle;
    }

    // Actualizar descripción SEO si se proporciona
    if (dto.seoDescription !== undefined && dto.seoDescription !== property.seoDescription) {
      changes.push({
        timestamp: new Date(),
        changedBy: updatedBy || 'system',
        field: 'seoDescription',
        previousValue: property.seoDescription || null,
        newValue: dto.seoDescription,
      });
      property.seoDescription = dto.seoDescription;
    }

    // Agregar cambios al historial si hay cambios
    if (changes.length > 0) {
      property.changeHistory = [...(property.changeHistory || []), ...changes];
      property.lastModifiedAt = new Date();
    }

    return this.propertyRepository.save(property);
  }

  // ===== FIN DEL NUEVO MÉTODO =====

  /**
   * Actualiza las características de una propiedad
   */
  async updateCharacteristics(
    id: string,
    dto: UpdatePropertyCharacteristicsDto,
    updatedBy?: string
  ): Promise<Property> {
    const property = await this.propertyRepository.findOne({ where: { id } });
    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const changes: ChangeHistoryEntry[] = [];

    // Campos de características a actualizar
    const characteristicFields = [
      'builtSquareMeters',
      'landSquareMeters',
      'bedrooms',
      'bathrooms',
      'parkingSpaces',
      'floors',
      'constructionYear'
    ];

    // Trackear cambios para cada campo de características
    for (const field of characteristicFields) {
      const newValue = dto[field];
      if (newValue !== undefined) {
        const currentValue = property[field];
        if (currentValue !== newValue) {
          changes.push({
            timestamp: new Date(),
            changedBy: updatedBy || 'system',
            field,
            previousValue: currentValue?.toString() || null,
            newValue: newValue?.toString() || null,
          });
          property[field] = newValue;
        }
      }
    }

    // Agregar cambios al historial si hay cambios
    if (changes.length > 0) {
      property.changeHistory = [...(property.changeHistory || []), ...changes];
      property.lastModifiedAt = new Date();
    }

    return this.propertyRepository.save(property);
  }

  /**
   * Actualiza la ubicación de una propiedad
   */
  async updateLocation(
    id: string,
    dto: UpdatePropertyLocationDto,
    updatedBy?: string
  ): Promise<Property> {
    const property = await this.propertyRepository.findOne({ where: { id } });
    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const changes: ChangeHistoryEntry[] = [];

    // Campos de ubicación a actualizar
    const locationFields = [
      'address',
      'state',
      'city',
      'latitude',
      'longitude'
    ];

    // Trackear cambios para cada campo de ubicación
    for (const field of locationFields) {
      const newValue = dto[field];
      if (newValue !== undefined) {
        const currentValue = property[field];
        if (currentValue !== newValue) {
          changes.push({
            timestamp: new Date(),
            changedBy: updatedBy || 'system',
            field,
            previousValue: currentValue?.toString() || null,
            newValue: newValue?.toString() || null,
          });
          property[field] = newValue;
        }
      }
    }

    // Agregar cambios al historial si hay cambios
    if (changes.length > 0) {
      property.changeHistory = [...(property.changeHistory || []), ...changes];
      property.lastModifiedAt = new Date();
    }

    return this.propertyRepository.save(property);
  }

  /**
   * Sube multimedia a una propiedad existente
   */
  async uploadMultimedia(
    propertyId: string,
    files: Express.Multer.File[],
    dto: UploadPropertyMultimediaDto,
    uploadedBy?: string
  ): Promise<Multimedia[]> {
    console.log('📁 [PropertyService.uploadMultimedia] ===== UPLOADING MULTIMEDIA TO EXISTING PROPERTY =====');
    console.log('📊 [PropertyService.uploadMultimedia] Property ID:', propertyId);
    console.log('📊 [PropertyService.uploadMultimedia] Files count:', files.length);
    console.log('📋 [PropertyService.uploadMultimedia] Files details:', files.map(f => ({
      originalname: f.originalname,
      filename: f.filename,
      mimetype: f.mimetype,
      size: f.size,
      path: f.path
    })));
    console.log('📋 [PropertyService.uploadMultimedia] DTO:', dto);

    // Verificar que la propiedad existe
    const property = await this.propertyRepository.findOne({ where: { id: propertyId } });
    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const uploadedMultimedia: Multimedia[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(`\n📸 [PropertyService.uploadMultimedia] Processing file ${i + 1}/${files.length}: ${file.originalname}`);

      try {
        // Determinar el tipo de multimedia basado en el mimetype
        const isImage = file.mimetype.startsWith('image/');
        const multimediaType = dto.type || (isImage ? MultimediaType.PROPERTY_IMG : MultimediaType.PROPERTY_VIDEO);

        console.log('🏷️ [PropertyService.uploadMultimedia] File type determined:', {
          isImage,
          multimediaType,
          mimetype: file.mimetype
        });

        // Crear metadata para el upload
        const metadata: MultimediaUploadMetadata = {
          type: multimediaType,
          seoTitle: dto.seoTitle || file.originalname,
          description: dto.description || `Multimedia for property ${property.title}`,
        };

        console.log('📋 [PropertyService.uploadMultimedia] Metadata created:', metadata);
        console.log('🚀 [PropertyService.uploadMultimedia] Creating multimedia entity...');

        // Crear multimedia directamente con URL correcta
        const multimedia = new Multimedia();
        multimedia.filename = file.originalname;
        
        // Generar URL correcta basada en tipo de archivo
        const mimetype = file.mimetype;
        let urlPath = '/public/';
        if (mimetype.startsWith('image/')) {
          urlPath += 'properties/img/';
        } else if (mimetype.startsWith('video/')) {
          urlPath += 'properties/video/';
        } else {
          urlPath += 'docs/';
        }
        multimedia.url = urlPath + file.filename;
        
        multimedia.format = file.mimetype.startsWith('image/') ? MultimediaFormat.IMG : MultimediaFormat.VIDEO;
        multimedia.type = multimediaType;
        multimedia.propertyId = propertyId;
        multimedia.property = property;

        console.log('✅ [PropertyService.uploadMultimedia] Multimedia entity created:', {
          filename: multimedia.filename,
          url: multimedia.url,
          format: multimedia.format,
          type: multimedia.type,
          propertyId: multimedia.propertyId
        });

        console.log('💾 [PropertyService.uploadMultimedia] Saving multimedia...');

        const savedMultimedia = await this.multimediaRepository.save(multimedia);

        console.log('✅ [PropertyService.uploadMultimedia] Multimedia saved successfully:', {
          id: savedMultimedia.id,
          filename: savedMultimedia.filename,
          propertyId: savedMultimedia.propertyId,
          url: savedMultimedia.url
        });

        uploadedMultimedia.push(savedMultimedia);

      } catch (error) {
        console.error(`❌ [PropertyService.uploadMultimedia] ERROR processing file ${file.originalname}:`, {
          error: error.message,
          stack: error.stack,
          file: {
            originalname: file.originalname,
            filename: file.filename,
            path: file.path
          }
        });
        // Continuar con el siguiente archivo en caso de error
        console.log('⚠️ [PropertyService.uploadMultimedia] Continuing with next file...');
      }
    }

    console.log('🏁 [PropertyService.uploadMultimedia] ===== MULTIMEDIA UPLOAD COMPLETED =====');
    console.log('📊 [PropertyService.uploadMultimedia] Final result:', {
      uploadedCount: uploadedMultimedia.length,
      totalFiles: files.length,
      uploadedItems: uploadedMultimedia.map(m => ({
        id: m.id,
        filename: m.filename,
        propertyId: m.propertyId
      }))
    });

    return uploadedMultimedia;
  }

}

function toInt(v: any): number { const n = parseInt(v, 10); return isNaN(n) ? 0 : n; }
function toNumber(v: any): number { const n = typeof v === 'number' ? v : parseFloat(v); return isNaN(n) ? 0 : n; }
function isFiniteNumber(n: any): boolean { return typeof n === 'number' && isFinite(n); }
function formatPrice(price: number, currency?: string): string {
  if (!isFiniteNumber(price) || price <= 0) return '';
  if (currency === 'UF') {
    return `${new Intl.NumberFormat('es-CL').format(Math.round(price))} UF`;
  }
  return `$ ${new Intl.NumberFormat('es-CL').format(Math.round(price))}`;
}

