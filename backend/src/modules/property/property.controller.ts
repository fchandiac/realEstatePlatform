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
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto, UpdatePropertyDto } from './dto/property.dto';
import { GridSaleQueryDto } from './dto/grid-sale.dto';
import { Audit } from '../../common/interceptors/audit.interceptor';
import { AuditAction, AuditEntityType } from '../../common/enums/audit.enums';

@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  @Audit(AuditAction.CREATE, AuditEntityType.PROPERTY, 'Property created')
  create(@Body(ValidationPipe) createPropertyDto: CreatePropertyDto) {
    return this.propertyService.create(createPropertyDto);
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

  @Patch(':id')
  @Audit(AuditAction.UPDATE, AuditEntityType.PROPERTY, 'Property updated')
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
}
