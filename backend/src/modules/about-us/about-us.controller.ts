import {
  Controller,
  Get,
  Put,
  Body,
  Delete,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AboutUsService } from './about-us.service';
import { UpdateAboutUsDto } from './dto/about-us.dto';
import { Audit } from '../../common/interceptors/audit.interceptor';
import { AuditAction, AuditEntityType } from '../../common/enums/audit.enums';

// Configuración de storage para uploads de about-us
const aboutUsUploadStorage = diskStorage({
  destination: (req, file, callback) => {
    callback(null, './uploads/about-us');
  },
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = extname(file.originalname);
    callback(null, `${uniqueSuffix}${ext}`);
  },
});

@Controller('about-us')
export class AboutUsController {
  constructor(private readonly aboutUsService: AboutUsService) {}

  @Get()
  @Audit(AuditAction.READ, AuditEntityType.ABOUT_US, 'About us viewed')
  findOne() {
    return this.aboutUsService.findOne();
  }

  @Put()
  @UseInterceptors(FileInterceptor('multimedia', { storage: aboutUsUploadStorage }))
  @Audit(AuditAction.UPDATE, AuditEntityType.ABOUT_US, 'About us updated')
  update(
    @Body(ValidationPipe) updateAboutUsDto: UpdateAboutUsDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      updateAboutUsDto.multimediaUrl = `/uploads/about-us/${file.filename}`;
    }
    return this.aboutUsService.update(updateAboutUsDto);
  }

  @Delete()
  @Audit(AuditAction.DELETE, AuditEntityType.ABOUT_US, 'About us deleted')
  softDelete() {
    return this.aboutUsService.softDelete();
  }
}
