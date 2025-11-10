'use client';

import { useRouter } from 'next/navigation';
import { BlogArticle } from '@/app/actions/blogs';
import { Button } from '@/components/Button/Button';
import Card from '@/components/Card/Card';

interface BlogListProps {
  articles: BlogArticle[];
  currentCategory?: string;
}

const categories = [
  { label: 'Todos', value: '' },
  { label: 'Comprar', value: 'Comprar' },
  { label: 'Arrendar', value: 'Arrendar' },
  { label: 'Inversión', value: 'Inversión' },
  { label: 'Decoración', value: 'Decoración' },
  { label: 'Mercado', value: 'Mercado' },
];

export default function BlogList({ articles, currentCategory }: BlogListProps) {
  const router = useRouter();

  const handleCategoryChange = (category: string) => {
    const url = category ? `/portal/blog?category=${encodeURIComponent(category)}` : '/portal/blog';
    router.push(url);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Blog Inmobiliario</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Mantente informado con las últimas tendencias, consejos y noticias del mercado inmobiliario
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex justify-center flex-wrap gap-3 mb-12">
        {categories.map((cat) => (
          <Button
            key={cat.value}
            onClick={() => handleCategoryChange(cat.value)}
            className={`font-medium py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 ${
              (currentCategory === cat.value || (!currentCategory && cat.value === ''))
                ? 'bg-neutral-800 text-white'
                : 'bg-white text-gray-700 shadow-md hover:bg-gray-50 hover:shadow-lg border border-gray-200'
            }`}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Articles */}
      <div className="space-y-12">
        {articles.map((article) => (
          <article key={article.id} className="bg-white rounded-lg p-6">
            {/* Article Header */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
              <div className="flex-1 md:w-1/2 text-center md:text-left">
                <h3 className="text-3xl font-bold mb-2">{article.title}</h3>
                {article.subtitle && (
                  <p className="text-xl text-gray-500">{article.subtitle}</p>
                )}
                {article.publishedAt && (
                  <p className="text-sm text-gray-400 mt-2">
                    Publicado el {new Date(article.publishedAt).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                )}
              </div>
              {article.imageUrl && (
                <div className="relative flex-1 md:w-1/2 overflow-hidden rounded-lg">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-auto object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-neutral-800/60 to-transparent rounded-lg"></div>
                </div>
              )}
            </div>

            {/* Article Content */}
            <div className="prose max-w-none text-justify">
              <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br />') }} />
            </div>
          </article>
        ))}
      </div>

      {/* Related Articles */}
      {articles.length > 0 && articles[0].relatedArticles && articles[0].relatedArticles.length > 0 && (
        <>
          <div className="my-12 flex items-center justify-center">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <div className="px-4">
              <i className="fas fa-circle text-gray-400 text-xs"></i>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>

          <div className="mt-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Artículos relacionados</h3>
              <p className="text-gray-600">Descubre más contenido que puede interesarte</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles[0].relatedArticles.map((related) => (
                <Card
                  key={related.id}
                  className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <div className="relative overflow-hidden">
                    {related.imageUrl && (
                      <img
                        src={related.imageUrl}
                        alt={related.title}
                        className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                  <div className="p-4">
                    <span className="inline-block bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full mb-2">
                      {related.category}
                    </span>
                    <h4 className="text-lg font-bold mt-1 text-neutral-800 group-hover:text-gray-600 transition-colors">
                      {related.title}
                    </h4>
                    {related.subtitle && (
                      <p className="text-sm text-gray-600 mt-2">{related.subtitle}</p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}