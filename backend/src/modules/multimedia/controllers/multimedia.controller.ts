import { Controller, Post, Get, Delete, Param, UploadedFile, UseInterceptors, Body, Res, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MultimediaService } from '../services/multimedia.service';
import { MultimediaType } from '../../../entities/multimedia.entity';
import type { Response } from 'express';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { MultimediaUploadMetadata, MultimediaResponse } from '../interfaces/multimedia.interface';
import type { Express } from 'express';

@ApiTags('multimedia')
@Controller('multimedia')
export class MultimediaController {
  constructor(private readonly multimediaService: MultimediaService) {}

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
        type: {
          type: 'string',
          enum: Object.values(MultimediaType),
        },
        seoTitle: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
      },
    },
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: MultimediaType,
    @Body('seoTitle') seoTitle?: string,
    @Body('description') description?: string,
  ) {
    return await this.multimediaService.uploadFile(file, type, {
      seoTitle,
      description,
    });
  }

  @Get(':filepath(*)')
  async serveFile(@Param('filepath') filepath: string, @Res() res: Response) {
    const file = await this.multimediaService.serveFile(filepath);
    res.end(file);
  }

  @Delete(':id')
  async deleteFile(@Param('id') id: string) {
    await this.multimediaService.deleteFile(id);
    return { statusCode: HttpStatus.OK, message: 'File deleted successfully' };
  }
}