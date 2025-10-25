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
} from '@nestjs/common';
import { IdentitiesService } from './identities.service';
import { CreateIdentityDto, UpdateIdentityDto } from './dto/identity.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuditInterceptor } from '../../common/interceptors/audit.interceptor';
import { Audit } from '../../common/interceptors/audit.interceptor';
import { AuditAction, AuditEntityType } from '../../common/enums/audit.enums';

@Controller('identities')
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditInterceptor)
export class IdentitiesController {
  constructor(private readonly identitiesService: IdentitiesService) {}

  @Post()
  @Audit(AuditAction.CREATE, AuditEntityType.IDENTITY, 'Identity created')
  create(@Body(ValidationPipe) createIdentityDto: CreateIdentityDto) {
    return this.identitiesService.create(createIdentityDto);
  }

  @Get()
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
  @Audit(AuditAction.READ, AuditEntityType.IDENTITY, 'Identity viewed')
  findOne(@Param('id') id: string) {
    return this.identitiesService.findOne(id);
  }

  @Patch(':id')
  @Audit(AuditAction.UPDATE, AuditEntityType.IDENTITY, 'Identity updated')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateIdentityDto: UpdateIdentityDto,
  ) {
    return this.identitiesService.update(id, updateIdentityDto);
  }

  @Delete(':id')
  @Audit(AuditAction.DELETE, AuditEntityType.IDENTITY, 'Identity deleted')
  softDelete(@Param('id') id: string) {
    return this.identitiesService.softDelete(id);
  }
}
