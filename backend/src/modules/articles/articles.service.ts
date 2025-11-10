import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Article } from '../../entities/article.entity';
import { CreateArticleDto, UpdateArticleDto } from './dto/article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async create(
    createArticleDto: CreateArticleDto,
    file?: Express.Multer.File,
  ): Promise<Article> {
    // Check if title already exists
    const existingArticle = await this.articleRepository.findOne({
      where: { title: createArticleDto.title },
    });
    if (existingArticle) {
      throw new ConflictException('Ya existe un artículo con este título.');
    }

    let multimediaUrl: string | undefined;

    if (file) {
      // Guardar el archivo y obtener la URL
      const fs = require('fs');
      const path = require('path');
      const uploadDir = path.join(__dirname, '../../../public/web/articles');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      const filename = `${Date.now()}-${file.originalname}`;
      const filepath = path.join(uploadDir, filename);
      fs.writeFileSync(filepath, file.buffer);

      // Generar URL pública
      const backendUrl = process.env.BACKEND_PUBLIC_URL || `http://localhost:${process.env.PORT || 3001}`;
      multimediaUrl = `${backendUrl}/public/web/articles/${filename}`;
    }

    const article = this.articleRepository.create({
      ...createArticleDto,
      multimediaUrl,
    });
    return await this.articleRepository.save(article);
  }

  async findAll(search?: string): Promise<Article[]> {
    const query = this.articleRepository.createQueryBuilder('article')
      .where('article.deletedAt IS NULL')
      .orderBy('article.createdAt', 'DESC');

    if (search) {
      query.andWhere('(article.title ILIKE :search OR article.subtitle ILIKE :search OR article.text ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    return await query.getMany();
  }

  async findOne(id: string): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!article) {
      throw new NotFoundException('Artículo no encontrado.');
    }

    return article;
  }

  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
    file?: Express.Multer.File,
  ): Promise<Article> {
    const article = await this.findOne(id);

    // Check if title is being updated and already exists
    if (updateArticleDto.title && updateArticleDto.title !== article.title) {
      const existingArticle = await this.articleRepository.findOne({
        where: { title: updateArticleDto.title },
      });
      if (existingArticle) {
        throw new ConflictException('Ya existe un artículo con este título.');
      }
    }

    let multimediaUrl = article.multimediaUrl;

    if (file) {
      // Guardar el archivo y obtener la URL
      const fs = require('fs');
      const path = require('path');
      const uploadDir = path.join(__dirname, '../../../public/web/articles');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      const filename = `${Date.now()}-${file.originalname}`;
      const filepath = path.join(uploadDir, filename);
      fs.writeFileSync(filepath, file.buffer);

      // Generar URL pública
      const backendUrl = process.env.BACKEND_PUBLIC_URL || `http://localhost:${process.env.PORT || 3001}`;
      multimediaUrl = `${backendUrl}/public/web/articles/${filename}`;
    }

    Object.assign(article, { ...updateArticleDto, multimediaUrl });
    return await this.articleRepository.save(article);
  }

  async softDelete(id: string): Promise<void> {
    const article = await this.findOne(id);
    await this.articleRepository.softDelete(id);
  }
}
