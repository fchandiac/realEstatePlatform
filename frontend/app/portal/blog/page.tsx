import { listArticles } from '@/app/actions/articles';
import BlogList from './ui/BlogList';
import CategoriesBlog from './ui/CategoriesBlog';
import { BlogCategory } from './ui/BlogCard';
import { ArticleCategory } from '@/app/types/article';

interface BlogPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const category = typeof params.category === 'string' ? params.category : undefined;

  const articles = await listArticles({ category });

  // Transformar los artículos al formato que espera BlogCard
  const transformedArticles = articles.map(article => ({
    id: article.id,
    title: article.title,
    subtitle: article.subtitle,
    content: article.text,
    category: article.category as unknown as BlogCategory,
    imageUrl: article.multimediaUrl,
    publishedAt: article.createdAt ? new Date(article.createdAt) : undefined,
  }));

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Blog Inmobiliario
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre consejos, tendencias y guías sobre el mundo inmobiliario.
            Encuentra la información que necesitas para tomar las mejores decisiones.
          </p>
        </div>

        {/* Filtros de categorías */}
        <div className="mb-8">
          <CategoriesBlog />
        </div>

        {/* Lista de artículos */}
        <BlogList blogs={transformedArticles} />
      </div>
    </div>
  );
}
