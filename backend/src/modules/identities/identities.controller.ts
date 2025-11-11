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

// Interceptor para transformar campos JSON stringified antes de validación
@Injectable()
export class TransformJsonFieldsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const body = request.body;

    // Transformar campos JSON stringified antes de validación
    const jsonFields = ['socialMedia', 'partnerships', 'faqs'];
    jsonFields.forEach(field => {
      if (body[field] && typeof body[field] === 'string') {
        try {
          body[field] = JSON.parse(body[field]);
          console.log(`Parsed ${field} in interceptor:`, body[field]);
        } catch (error) {
          console.warn(`Failed to parse JSON field ${field} in interceptor:`, error);
        }
      } else {
        console.log(`${field} not parsed - value:`, body[field], 'type:', typeof body[field]);
      }
    });

    return next.handle().pipe(
      map(data => data),
    );
  }
}

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

  @Get('logo-url')
  @UseGuards()
  async getLogoUrl() {
    return await this.identitiesService.getLogoUrl();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @Audit(AuditAction.READ, AuditEntityType.IDENTITY, 'Identity viewed')
  findOne(@Param('id') id: string) {
    return this.identitiesService.findOne(id);
  }
}
