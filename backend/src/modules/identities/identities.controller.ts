import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { IdentitiesService } from './identities.service';
import { CreateIdentityDto, UpdateIdentityDto } from './dto/identity.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuditInterceptor } from '../../common/interceptors/audit.interceptor';
import { Audit } from '../../common/interceptors/audit.interceptor';
import { AuditAction, AuditEntityType } from '../../common/enums/audit.enums';

@Controller('identities')
@UseInterceptors(AuditInterceptor)
export class IdentitiesController {
  constructor(private readonly identitiesService: IdentitiesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Audit(AuditAction.CREATE, AuditEntityType.IDENTITY, 'Identity created')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logo', maxCount: 1 },
      { name: 'partnershipLogos', maxCount: 10 },
    ]),
  )
  create(
    @Body(ValidationPipe) createIdentityDto: CreateIdentityDto,
    @UploadedFiles()
    files?: {
      logo?: Express.Multer.File[];
      partnershipLogos?: Express.Multer.File[];
    },
  ) {
    return this.identitiesService.create(createIdentityDto, files);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Audit(AuditAction.READ, AuditEntityType.IDENTITY, 'Identities listed')
  findAll() {
    return this.identitiesService.findAll();
  }

  @Get('last')
  @Audit(AuditAction.READ, AuditEntityType.IDENTITY, 'Last identity retrieved')
  findLast() {
    return this.identitiesService.findLast();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @Audit(AuditAction.READ, AuditEntityType.IDENTITY, 'Identity viewed')
  findOne(@Param('id') id: string) {
    return this.identitiesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @Audit(AuditAction.UPDATE, AuditEntityType.IDENTITY, 'Identity updated')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logo', maxCount: 1 },
      { name: 'partnershipLogos', maxCount: 10 },
    ]),
  )
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateIdentityDto: UpdateIdentityDto,
    @UploadedFiles()
    files?: {
      logo?: Express.Multer.File[];
      partnershipLogos?: Express.Multer.File[];
    },
  ) {
    return this.identitiesService.update(id, updateIdentityDto, files);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Audit(AuditAction.DELETE, AuditEntityType.IDENTITY, 'Identity deleted')
  softDelete(@Param('id') id: string) {
    return this.identitiesService.softDelete(id);
  }
}
