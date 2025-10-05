import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    // Check if title already exists
    const existingArticle = await this.articleRepository.findOne({
      where: { title: createArticleDto.title },
    });
    if (existingArticle) {
      throw new ConflictException('Ya existe un artículo con este título.');
    }

    const article = this.articleRepository.create(createArticleDto);
    return await this.articleRepository.save(article);
  }

  async findAll(): Promise<Article[]> {
    return await this.articleRepository.find({
      where: { deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
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

  async update(id: string, updateArticleDto: UpdateArticleDto): Promise<Article> {
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

    Object.assign(article, updateArticleDto);
    return await this.articleRepository.save(article);
  }

  async softDelete(id: string): Promise<void> {
    const article = await this.findOne(id);
    await this.articleRepository.softDelete(id);
  }
}