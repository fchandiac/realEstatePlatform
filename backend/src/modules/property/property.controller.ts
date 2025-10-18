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

@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  create(@Body(ValidationPipe) createPropertyDto: CreatePropertyDto) {
    return this.propertyService.create(createPropertyDto);
  }

  @Get()
  findAll(@Query() filters: any) {
    return this.propertyService.findAll(filters);
  }

  @Get('grid-sale')
  gridSale(@Query(ValidationPipe) query: GridSaleQueryDto) {
    return this.propertyService.gridSaleProperties(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertyService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updatePropertyDto: UpdatePropertyDto,
  ) {
    return this.propertyService.update(id, updatePropertyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertyService.remove(id);
  }
}
