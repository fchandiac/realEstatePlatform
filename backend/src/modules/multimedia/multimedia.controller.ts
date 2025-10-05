import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MultimediaService } from './multimedia.service';
import { CreateMultimediaDto, UpdateMultimediaDto } from './dto/multimedia.dto';

@Controller('multimedia')
export class MultimediaController {
  constructor(private readonly multimediaService: MultimediaService) {}

  @Post()
  create(@Body() createMultimediaDto: CreateMultimediaDto) {
    return this.multimediaService.create(createMultimediaDto);
  }

  @Get()
  findAll() {
    return this.multimediaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.multimediaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMultimediaDto: UpdateMultimediaDto) {
    return this.multimediaService.update(id, updateMultimediaDto);
  }

  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.multimediaService.softDelete(id);
  }

  @Get(':id/url')
  getUrl(@Param('id') id: string) {
    return this.multimediaService.getUrl(id);
  }

  @Patch(':id/seo-title')
  setSeoTitle(@Param('id') id: string, @Body('seoTitle') seoTitle: string) {
    return this.multimediaService.setSeoTitle(id, seoTitle);
  }
}