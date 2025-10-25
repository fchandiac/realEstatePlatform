import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SlidersService } from './sliders.service';
import { CreateSliderDto, UpdateSliderDto } from './dto';
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard';
import { Audit } from '../../common/interceptors/audit.interceptor';
import { AuditAction, AuditEntityType } from '../../common/enums/audit.enums';

@Controller('sliders')
@UseGuards(JwtAuthGuard)
export class SlidersController {
  constructor(private readonly slidersService: SlidersService) {}

  @Post()
  @Audit(AuditAction.CREATE, AuditEntityType.ARTICLE, 'Create slider')
  @UseInterceptors(FileInterceptor('image'))
  create(@Body() createSliderDto: CreateSliderDto, @UploadedFile() image?: Express.Multer.File) {
    return this.slidersService.create(createSliderDto, image);
  }

  @Get()
  @Audit(AuditAction.READ, AuditEntityType.ARTICLE, 'List sliders')
  findAll() {
    return this.slidersService.findAll();
  }

  @Get(':id')
  @Audit(AuditAction.READ, AuditEntityType.ARTICLE, 'Get slider')
  findOne(@Param('id') id: string) {
    return this.slidersService.findOne(id);
  }

  @Patch(':id')
  @Audit(AuditAction.UPDATE, AuditEntityType.ARTICLE, 'Update slider')
  @UseInterceptors(FileInterceptor('image'))
  update(@Param('id') id: string, @Body() updateSliderDto: UpdateSliderDto, @UploadedFile() image?: Express.Multer.File) {
    return this.slidersService.update(id, updateSliderDto, image);
  }

  @Delete(':id')
  @Audit(AuditAction.DELETE, AuditEntityType.ARTICLE, 'Delete slider')
  remove(@Param('id') id: string) {
    return this.slidersService.remove(id);
  }

  @Post('reorder')
  @Audit(AuditAction.UPDATE, AuditEntityType.ARTICLE, 'Reorder sliders')
  reorder(@Body() { ids }: { ids: string[] }) {
    return this.slidersService.reorder(ids);
  }
}