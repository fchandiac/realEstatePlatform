import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { PropertyTypesService } from './property-types.service';
import {
  CreatePropertyTypeDto,
  UpdatePropertyTypeDto,
} from './dto/property-type.dto';

@Controller('property-types')
export class PropertyTypesController {
  constructor(private readonly propertyTypesService: PropertyTypesService) {}

  @Post()
  create(@Body(ValidationPipe) createPropertyTypeDto: CreatePropertyTypeDto) {
    return this.propertyTypesService.create(createPropertyTypeDto);
  }

  @Get()
  findAll() {
    return this.propertyTypesService.findAll();
  }

  @Get('minimal')
  findAllMinimal() {
    return this.propertyTypesService.findAllMinimal();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertyTypesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updatePropertyTypeDto: UpdatePropertyTypeDto,
  ) {
    return this.propertyTypesService.update(id, updatePropertyTypeDto);
  }

  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.propertyTypesService.softDelete(id);
  }
}
