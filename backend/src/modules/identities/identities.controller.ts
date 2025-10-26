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
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IdentitiesService } from './identities.service';
import { CreateIdentityDto, UpdateIdentityDto } from './dto/identity.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuditInterceptor } from '../../common/interceptors/audit.interceptor';
import { Audit } from '../../common/interceptors/audit.interceptor';
import { AuditAction, AuditEntityType } from '../../common/enums/audit.enums';

// Interceptor para transformar campos JSON stringified
@Injectable()
export class TransformJsonFieldsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const body = request.body;

    // Transformar campos JSON stringified
    const jsonFields = ['socialMedia', 'partnerships', 'faqs'];
    jsonFields.forEach(field => {
      if (body[field] && typeof body[field] === 'string') {
        try {
          body[field] = JSON.parse(body[field]);
        } catch (error) {
          // Si no se puede parsear, dejar como está
          console.warn(`Failed to parse JSON field ${field}:`, error);
        }
      }
    });

    return next.handle().pipe(
      map(data => data),
    );
  }
}

@Controller('identities')
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditInterceptor)
export class IdentitiesController {
  constructor(private readonly identitiesService: IdentitiesService) {}

  @Post()
  @Audit(AuditAction.CREATE, AuditEntityType.IDENTITY, 'Identity created')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logo', maxCount: 1 },
      { name: 'partnershipLogos', maxCount: 10 },
    ]),
    TransformJsonFieldsInterceptor,
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
  @Audit(AuditAction.READ, AuditEntityType.IDENTITY, 'Identities listed')
  findAll() {
    return this.identitiesService.findAll();
  }

  @Get('last')
  @UseGuards()
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
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logo', maxCount: 1 },
      { name: 'partnershipLogos', maxCount: 10 },
    ]),
    TransformJsonFieldsInterceptor,
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
  @Audit(AuditAction.DELETE, AuditEntityType.IDENTITY, 'Identity deleted')
  softDelete(@Param('id') id: string) {
    return this.identitiesService.softDelete(id);
  }
}
