import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DocumentTypesService } from './document-types.service';
import { CreateDocumentTypeDto, UpdateDocumentTypeDto } from './dto/document-type.dto';

@Controller('document-types')
export class DocumentTypesController {
  constructor(private readonly documentTypesService: DocumentTypesService) {}

  @Post()
  create(@Body() createDocumentTypeDto: CreateDocumentTypeDto) {
    return this.documentTypesService.create(createDocumentTypeDto);
  }

  @Get()
  findAll() {
    return this.documentTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentTypesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDocumentTypeDto: UpdateDocumentTypeDto) {
    return this.documentTypesService.update(id, updateDocumentTypeDto);
  }

  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.documentTypesService.softDelete(id);
  }

  @Patch(':id/available')
  setAvailable(@Param('id') id: string, @Body('available') available: boolean) {
    return this.documentTypesService.setAvailable(id, available);
  }
}