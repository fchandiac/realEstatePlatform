import { getArticles } from '@/app/actions/articles';
import BlogList from './ui/BlogList';
import CategoriesBlog from './ui/CategoriesBlog';

interface BlogPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  let category = typeof params.category === 'string' ? params.category : undefined;
  
  // Si category es string vacío, tratarlo como undefined para mostrar todos
  if (category === '') {
    category = undefined;
  }

  // Obtener artículos filtrados por categoría si existe
  const result = await getArticles({ category });
  const articles = result?.data || [];

  // Obtener todas las categorías disponibles (sin filtro)
  const allArticlesResult = await getArticles({});
  const allArticles = allArticlesResult?.data || [];

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
          <CategoriesBlog articles={allArticles} />
        </div>

        {/* Lista de artículos */}
        <BlogList blogs={articles} />
      </div>
    </div>
  );
}
