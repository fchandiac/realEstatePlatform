import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SlideService } from './slide.service';
import { CreateSlideDto } from './dto/create-slide.dto';
import { CreateSlideWithMultimediaDto } from './dto/create-slide-with-multimedia.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { UpdateSlideWithMultimediaDto } from './dto/update-slide-with-multimedia.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Audit } from '../../common/interceptors/audit.interceptor';
import { AuditAction, AuditEntityType } from '../../common/enums/audit.enums';

@Controller('slide')
export class SlideController {
  constructor(private readonly slideService: SlideService) {}

  // Helper method para validar tamaño de archivo según tipo
  private validateFileSize(file: Express.Multer.File): void {
    if (!file) return;

    const isVideo = file.mimetype.startsWith('video/');
    const maxSize = isVideo ? 60 * 1024 * 1024 : 10 * 1024 * 1024; // 60MB vs 10MB
    const maxSizeLabel = isVideo ? '60MB' : '10MB';
    const fileType = isVideo ? 'videos' : 'imágenes';

    if (file.size > maxSize) {
      throw new BadRequestException(
        `El archivo excede el límite de ${maxSizeLabel} permitido para ${fileType}`
      );
    }

    // Validar tipo de archivo
    const allowedMimeTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
      'video/mp4', 'video/webm', 'video/avi', 'video/mov'
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Solo se permiten imágenes (JPG, PNG, GIF) y videos (MP4, WebM, AVI, MOV)'
      );
    }
  }

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
    // Validar tamaño de archivo según tipo (60MB para videos, 10MB para imágenes)
    this.validateFileSize(file);

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

  @Get('public/active')
  findPublicActive() {
    return this.slideService.findPublicActive();
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

  @Put(':id/with-multimedia')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('multimedia'))
  @Audit(AuditAction.UPDATE, AuditEntityType.PROPERTY, 'Slide updated with multimedia')
  updateWithMultimedia(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateSlideDto: UpdateSlideWithMultimediaDto,
  ) {
    // Validar tamaño de archivo según tipo (60MB para videos, 10MB para imágenes)
    this.validateFileSize(file);

    // Asegurar que los tipos sean correctos desde FormData
    const processedDto = {
      ...updateSlideDto,
      duration: typeof updateSlideDto.duration === 'string' 
        ? parseInt(updateSlideDto.duration, 10) 
        : updateSlideDto.duration,
      isActive: updateSlideDto.isActive !== undefined 
        ? String(updateSlideDto.isActive) === 'true' 
        : undefined,
    };
    
    return this.slideService.updateWithMultimedia(id, processedDto, file);
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