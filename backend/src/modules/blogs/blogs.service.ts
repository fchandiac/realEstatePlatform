import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogArticle } from '../../entities/blog-article.entity';
import { ListBlogsQueryDto } from './dto/list-blogs-query.dto';
import { BlogArticleDto } from './dto/blog-article.dto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(BlogArticle)
    private readonly blogArticleRepository: Repository<BlogArticle>,
  ) {}

  async listBlogs(query: ListBlogsQueryDto): Promise<BlogArticleDto[]> {
    const { category, limit = 10, offset = 0 } = query;

    // Build query
    const qb = this.blogArticleRepository
      .createQueryBuilder('article')
      .where('article.isActive = :isActive', { isActive: true })
      .andWhere('article.deletedAt IS NULL')
      .orderBy('article.publishedAt', 'DESC')
      .skip(offset)
      .take(limit);

    if (category) {
      qb.andWhere('article.category = :category', { category });
    }

    const articles = await qb.getMany();

    // For each article, get 3 related articles
    const articlesWithRelated = await Promise.all(
      articles.map(async (article) => {
        const related = await this.getRelatedArticles(article.id, article.category);
        return {
          ...article,
          relatedArticles: related,
        } as BlogArticleDto;
      }),
    );

    return articlesWithRelated;
  }

  private async getRelatedArticles(excludeId: string, category: string): Promise<BlogArticleDto[]> {
    // Get up to 3 articles from same category, excluding the current one
    const related = await this.blogArticleRepository
      .createQueryBuilder('article')
      .where('article.id != :excludeId', { excludeId })
      .andWhere('article.category = :category', { category })
      .andWhere('article.isActive = :isActive', { isActive: true })
      .andWhere('article.deletedAt IS NULL')
      .orderBy('RAND()') // Random order for MySQL
      .take(3)
      .getMany();

    // If not enough from same category, get from other categories
    if (related.length < 3) {
      const additional = await this.blogArticleRepository
        .createQueryBuilder('article')
        .where('article.id != :excludeId', { excludeId })
        .andWhere('article.category != :category', { category })
        .andWhere('article.isActive = :isActive', { isActive: true })
        .andWhere('article.deletedAt IS NULL')
        .orderBy('RAND()')
        .take(3 - related.length)
        .getMany();

      related.push(...additional);
    }

    return related.map((art) => ({
      id: art.id,
      title: art.title,
      subtitle: art.subtitle,
      content: art.content,
      category: art.category,
      imageUrl: art.imageUrl,
      publishedAt: art.publishedAt,
      isActive: art.isActive,
      createdAt: art.createdAt,
      updatedAt: art.updatedAt,
    }));
  }
}