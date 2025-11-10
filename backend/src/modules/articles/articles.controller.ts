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
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ArticlesService } from './articles.service';
import { CreateArticleDto, UpdateArticleDto } from './dto/article.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body(ValidationPipe) createArticleDto: CreateArticleDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.articlesService.create(createArticleDto, image);
  }

  @Get()
  findAll(@Query('search') search?: string) {
    return this.articlesService.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateArticleDto: UpdateArticleDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.articlesService.update(id, updateArticleDto, image);
  }

  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.articlesService.softDelete(id);
  }
}
