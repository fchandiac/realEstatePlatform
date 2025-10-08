import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentService } from './document.service';
import { CreateDocumentDto, UpdateDocumentDto, UploadDocumentDto } from './dto/document.dto';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import type { Express } from 'express';

@ApiTags('document')
@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post()
  create(@Body(ValidationPipe) createDocumentDto: CreateDocumentDto) {
    return this.documentService.create(createDocumentDto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        title: {
          type: 'string',
        },
        documentTypeId: {
          type: 'string',
          format: 'uuid',
        },
        uploadedById: {
          type: 'string',
          format: 'uuid',
        },
        status: {
          type: 'string',
          enum: ['PENDING', 'RECIBIDO', 'REJECTED'],
        },
        notes: {
          type: 'string',
        },
        seoTitle: {
          type: 'string',
        },
      },
    },
  })
  uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body(ValidationPipe) uploadDocumentDto: UploadDocumentDto,
  ) {
    return this.documentService.uploadDocument(file, uploadDocumentDto);
  }

  @Get()
  findAll() {
    return this.documentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.documentService.update(id, updateDocumentDto);
  }

  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.documentService.softDelete(id);
  }
}