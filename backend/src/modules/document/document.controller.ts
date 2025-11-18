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
import {
  CreateDocumentDto,
  UpdateDocumentDto,
  UploadDocumentDto,
} from './dto/document.dto';
import {
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import type { Express } from 'express';

@ApiTags('Documents')
@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  /**
   * Create a new document record
   */
  @Post()
  @ApiOperation({ summary: 'Create new document' })
  @ApiResponse({
    status: 201,
    description: 'Document created successfully',
  })
  @ApiBody({ type: CreateDocumentDto })
  create(@Body(ValidationPipe) createDocumentDto: CreateDocumentDto) {
    return this.documentService.create(createDocumentDto);
  }

  /**
   * Upload a document file
   */
  @Post('upload')
  @ApiOperation({ summary: 'Upload document file' })
  @ApiResponse({
    status: 201,
    description: 'Document uploaded successfully',
  })
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

  /**
   * Get all documents
   */
  @Get()
  @ApiOperation({ summary: 'Get all documents' })
  @ApiResponse({
    status: 200,
    description: 'List of all documents',
  })
  findAll() {
    return this.documentService.findAll();
  }

  /**
   * Get document by ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get document by ID' })
  @ApiResponse({
    status: 200,
    description: 'Document details',
  })
  @ApiResponse({
    status: 404,
    description: 'Document not found',
  })
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id') id: string) {
    return this.documentService.findOne(id);
  }

  /**
   * Update document
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update document' })
  @ApiResponse({
    status: 200,
    description: 'Document updated successfully',
  })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateDocumentDto })
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.documentService.update(id, updateDocumentDto);
  }

  /**
   * Delete document (soft delete)
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete document' })
  @ApiResponse({
    status: 200,
    description: 'Document deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Document not found',
  })
  @ApiParam({ name: 'id', type: String })
  softDelete(@Param('id') id: string) {
    return this.documentService.softDelete(id);
  }
}
