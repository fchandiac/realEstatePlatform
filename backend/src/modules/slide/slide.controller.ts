import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SlideService } from './slide.service';
import { CreateSlideDto } from './dto/create-slide.dto';
import { CreateSlideWithMultimediaDto } from './dto/create-slide-with-multimedia.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Audit } from '../../common/interceptors/audit.interceptor';
import { AuditAction, AuditEntityType } from '../../common/enums/audit.enums';

@Controller('slide')
export class SlideController {
  constructor(private readonly slideService: SlideService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Audit(AuditAction.CREATE, AuditEntityType.PROPERTY, 'Slide created')
  create(@Body() createSlideDto: CreateSlideDto) {
    return this.slideService.create(createSlideDto);
  }

  @Post('create-with-multimedia')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('multimedia'))
  @Audit(AuditAction.CREATE, AuditEntityType.PROPERTY, 'Slide created with multimedia')
  createWithMultimedia(
    @UploadedFile() file: Express.Multer.File,
    @Body() createSlideDto: CreateSlideWithMultimediaDto,
  ) {
    // Asegurar que los tipos sean correctos desde FormData
    const processedDto = {
      ...createSlideDto,
      duration: typeof createSlideDto.duration === 'string' 
        ? parseInt(createSlideDto.duration, 10) 
        : createSlideDto.duration || 3,
      isActive: String(createSlideDto.isActive) === 'true',
    };
    
    return this.slideService.createWithMultimedia(processedDto, file);
  }

  @Get()
  findAll(@Query('search') search?: string) {
    return this.slideService.findAll(search);
  }

  @Get('active')
  findActive(@Query('search') search?: string) {
    return this.slideService.findActive(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.slideService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @Audit(AuditAction.UPDATE, AuditEntityType.PROPERTY, 'Slide updated')
  update(@Param('id') id: string, @Body() updateSlideDto: UpdateSlideDto) {
    return this.slideService.update(id, updateSlideDto);
  }

  @Patch(':id/toggle-status')
  @UseGuards(JwtAuthGuard)
  @Audit(AuditAction.UPDATE, AuditEntityType.PROPERTY, 'Slide status toggled')
  toggleStatus(@Param('id') id: string) {
    return this.slideService.toggleStatus(id);
  }

  @Post('reorder')
  @UseGuards(JwtAuthGuard)
  @Audit(AuditAction.UPDATE, AuditEntityType.PROPERTY, 'Slides reordered')
  reorder(@Body('slideIds') slideIds: string[]) {
    return this.slideService.reorder(slideIds);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Audit(AuditAction.DELETE, AuditEntityType.PROPERTY, 'Slide deleted')
  remove(@Param('id') id: string) {
    return this.slideService.remove(id);
  }
}