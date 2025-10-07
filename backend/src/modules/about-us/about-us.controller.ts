import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { AboutUsService } from './about-us.service';
import { CreateAboutUsDto, UpdateAboutUsDto } from './dto/about-us.dto';

@Controller('about-us')
export class AboutUsController {
  constructor(private readonly aboutUsService: AboutUsService) {}

  @Post()
  create(@Body(ValidationPipe) createAboutUsDto: CreateAboutUsDto) {
    return this.aboutUsService.create(createAboutUsDto);
  }

  @Get()
  findAll() {
    return this.aboutUsService.findAll();
  }

  @Get('latest')
  findLatest() {
    return this.aboutUsService.findLatest();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aboutUsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateAboutUsDto: UpdateAboutUsDto,
  ) {
    return this.aboutUsService.update(id, updateAboutUsDto);
  }

  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.aboutUsService.softDelete(id);
  }
}