
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Property } from '../../entities/property.entity';
import { User } from '../../entities/user.entity';
import { CreatePropertyDto, UpdatePropertyDto } from './dto/property.dto';
import { PropertyStatus } from '../../common/enums/property-status.enum';
import { PropertyOperationType } from '../../common/enums/property-operation-type.enum';
import { ChangeHistoryEntry, ViewEntry, LeadEntry } from '../../common/interfaces/property.interfaces';
import { GridSaleQueryDto } from './dto/grid-sale.dto';
import * as ExcelJS from 'exceljs';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
  ) {}

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
   * Devuelve toda la información relevante de una propiedad, incluyendo relaciones y datos agregados.
   */
  async getFullProperty(id: string) {
    // Obtener la propiedad con todas las relaciones relevantes
    const property = await this.propertyRepository.findOne({
      where: { id },
      relations: [
        'propertyType',      // Tipo de propiedad
        'assignedAgent',     // Agente asignado
        'multimedia',        // Imágenes, videos, documentos
      ],
    });

    if (!property) throw new NotFoundException('Property not found');

    // Datos agregados
    const favoritesCount = await this.getFavoritesCount(id);
    const leadsCount = await this.getLeadsCount(id);
    const viewsCount = await this.getViewsCount(id);

    // Retornar toda la información
    return {
      ...property,
      favoritesCount,
      leadsCount,
      viewsCount,
    };
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
  ): Promise<Property> {
    const property = await this.findOne(id, false);

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

    return await this.propertyRepository.save(property);
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
      // characteristics and priceDisplay are derived post-query
      // assignedAgentName is also derived using selected JSON personalInfo
      // Special: assignedAgentName will be handled in filter logic
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

