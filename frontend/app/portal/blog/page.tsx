import { getArticles } from '@/app/actions/articles';
import BlogList from './ui/BlogList';
import CategoriesBlog from './ui/CategoriesBlog';

interface BlogPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const category = typeof params.category === 'string' ? params.category : undefined;

  const result = await getArticles({ search: category });
  const articles = result?.data || [];

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
          <CategoriesBlog articles={articles} />
        </div>

        {/* Lista de artículos */}
        <BlogList blogs={articles} />
      </div>
    </div>
  );
}
