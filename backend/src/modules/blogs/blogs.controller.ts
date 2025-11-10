import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { ListBlogsQueryDto } from './dto/list-blogs-query.dto';
import { Audit } from '../../common/interceptors/audit.interceptor';
import { AuditAction, AuditEntityType } from '../../common/enums/audit.enums';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get()
  @Audit(AuditAction.READ, AuditEntityType.ARTICLE, 'Blogs listed')
  async listBlogs(@Query(ValidationPipe) query: ListBlogsQueryDto) {
    return this.blogsService.listBlogs(query);
  }
}