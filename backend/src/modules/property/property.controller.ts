
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ValidationPipe,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { PropertyService } from './property.service';
import { CreatePropertyDto, UpdatePropertyDto } from './dto/property.dto';
import { CreatePropertyDto as CreatePropertyPayloadDto } from './dto/create-property.dto';
import { GridSaleQueryDto } from './dto/grid-sale.dto';
import { GetFullPropertyDto } from './dto/get-full-property.dto';
import { Audit } from '../../common/interceptors/audit.interceptor';
import { AuditAction, AuditEntityType } from '../../common/enums/audit.enums';

@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get('grid-sale/excel')
  @Audit(AuditAction.READ, AuditEntityType.PROPERTY, 'Sale properties Excel exported')
  async exportSaleGridExcel(
    @Query(ValidationPipe) query: GridSaleQueryDto,
    @Res() res: Response,
  ) {
    const buffer = await this.propertyService.exportSalePropertiesExcel(query);
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="propiedades-en-venta.xlsx"',
    });
    res.send(buffer);
  }

  @Post()
  @Audit(AuditAction.CREATE, AuditEntityType.PROPERTY, 'Property created')
  create(@Body(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } })) createPropertyDto: CreatePropertyPayloadDto) {
    return this.propertyService.createProperty(createPropertyDto);
  }

  @Get()
  @Audit(AuditAction.READ, AuditEntityType.PROPERTY, 'Properties listed')
  findAll(@Query() filters: any) {
    return this.propertyService.findAll(filters);
  }

  @Get('grid-sale')
  @Audit(AuditAction.READ, AuditEntityType.PROPERTY, 'Sale properties grid viewed')
  gridSale(@Query(ValidationPipe) query: GridSaleQueryDto) {
    return this.propertyService.gridSaleProperties(query);
  }

  @Get(':id')
  @Audit(AuditAction.READ, AuditEntityType.PROPERTY, 'Property viewed')
  findOne(@Param('id') id: string) {
    return this.propertyService.findOne(id);
  }

  /**
   * Devuelve todos los detalles de la propiedad, incluyendo relaciones y datos agregados.
   */
  @Get(':id/full')
  @Audit(AuditAction.READ, AuditEntityType.PROPERTY, 'Full property details viewed')
  async getFullProperty(@Param('id') id: string): Promise<GetFullPropertyDto> {
    return await this.propertyService.getFullProperty(id);
  }

  @Patch(':id')
  @Audit(AuditAction.UPDATE, AuditEntityType.PROPERTY, 'Property updated')
    // No changes needed; description is handled by DTOs in create and update endpoints.
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updatePropertyDto: UpdatePropertyDto,
  ) {
    return this.propertyService.update(id, updatePropertyDto);
  }

  @Delete(':id')
  @Audit(AuditAction.DELETE, AuditEntityType.PROPERTY, 'Property deleted')
  remove(@Param('id') id: string) {
    return this.propertyService.remove(id);
  }

    /**
   * Total de propiedades en venta
   */
  @Get('count-sale')
  @Audit(AuditAction.READ, AuditEntityType.PROPERTY, 'Count sale properties')
  async countSaleProperties() {
    return { total: await this.propertyService.countSaleProperties() };
  }

  /**
   * Total de propiedades publicadas
   */
  @Get('count-published')
  @Audit(AuditAction.READ, AuditEntityType.PROPERTY, 'Count published properties')
  async countPublishedProperties() {
    return { total: await this.propertyService.countPublishedProperties() };
  }

  /**
   * Total de propiedades destacadas
   */
  @Get('count-featured')
  @Audit(AuditAction.READ, AuditEntityType.PROPERTY, 'Count featured properties')
  async countFeaturedProperties() {
    return { total: await this.propertyService.countFeaturedProperties() };
  }
}
