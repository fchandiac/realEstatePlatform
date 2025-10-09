import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentTypesService } from './document-types.service';
import {
  CreateDocumentTypeDto,
  UpdateDocumentTypeDto,
  UploadFileDto,
  UploadDocumentDto,
} from './dto/document-type.dto';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import type { Express } from 'express';

@ApiTags('document-types')
@Controller('document-types')
export class DocumentTypesController {
  constructor(private readonly documentTypesService: DocumentTypesService) {}

  @Post()
  create(@Body() createDocumentTypeDto: CreateDocumentTypeDto) {
    return this.documentTypesService.create(createDocumentTypeDto);
  }

  @Get()
  findAll() {
    return this.documentTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentTypesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDocumentTypeDto: UpdateDocumentTypeDto,
  ) {
    return this.documentTypesService.update(id, updateDocumentTypeDto);
  }

  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.documentTypesService.softDelete(id);
  }

  @Patch(':id/available')
  setAvailable(@Param('id') id: string, @Body('available') available: boolean) {
    return this.documentTypesService.setAvailable(id, available);
  }

  @Post('upload-file')
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
        seoTitle: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        uploadedById: {
          type: 'string',
          format: 'uuid',
        },
      },
    },
  })
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadFileDto: UploadFileDto,
  ) {
    return this.documentTypesService.uploadFile(file, uploadFileDto);
  }

  @Post('upload-document')
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
          enum: ['PENDING', 'UPLOADED', 'RECIBIDO', 'REJECTED'],
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
    @Body() uploadDocumentDto: UploadDocumentDto,
  ) {
    return this.documentTypesService.uploadDocument(file, uploadDocumentDto);
  }
}
