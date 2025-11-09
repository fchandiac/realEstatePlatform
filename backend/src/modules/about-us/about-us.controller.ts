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
import { AboutUsService } from './about-us.service';
import { UpdateAboutUsDto } from './dto/about-us.dto';
import { Audit } from '../../common/interceptors/audit.interceptor';
import { AuditAction, AuditEntityType } from '../../common/enums/audit.enums';

@Controller('about-us')
export class AboutUsController {
  constructor(private readonly aboutUsService: AboutUsService) {}

  @Get()
  @Audit(AuditAction.READ, AuditEntityType.ABOUT_US, 'About us viewed')
  findOne() {
    return this.aboutUsService.findOne();
  }

  @Put()
  @UseInterceptors(FileInterceptor('multimedia'))
  @Audit(AuditAction.UPDATE, AuditEntityType.ABOUT_US, 'About us updated')
  update(
    @Body(ValidationPipe) updateAboutUsDto: UpdateAboutUsDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.aboutUsService.update(updateAboutUsDto, file);
  }

  @Delete()
  @Audit(AuditAction.DELETE, AuditEntityType.ABOUT_US, 'About us deleted')
  softDelete() {
    return this.aboutUsService.softDelete();
  }
}
