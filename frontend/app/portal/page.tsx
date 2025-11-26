import FeaturedPropertiesList from './ui/FeaturedPropertiesList';
import { getPublishedFeaturedProperties } from '@/app/actions/properties';
import { getPublishedPropertiesFiltered } from '@/app/actions/portalProperties';
import Slider from './ui/Slider';
import NavBar from './ui/NavBar';
import PortalClient from './PortalClient';

interface PortalPageProps {
  searchParams: Promise<{
    operation?: string;
    typeProperty?: string;
    state?: string;
    city?: string;
    currency?: string;
    page?: string;
    featured_page?: string;
  }>;
}

export default async function PortalPage({ searchParams }: PortalPageProps) {
  const params = await searchParams;

  const operation = params.operation || '';
  const typeProperty = params.typeProperty || '';
  const state = params.state || '';
  const city = params.city || '';
  const currency = params.currency || '';
  const page = params.page || '';
  const featuredPage = params.featured_page || '1';

  // Fetch featured properties with pagination
  const featuredResult = await getPublishedFeaturedProperties(
    parseInt(featuredPage) || 1
  );

  const featuredProperties = featuredResult?.data ?? [];
  const featuredPagination = featuredResult?.pagination;

  // Fetch regular properties (filtered)
  const result = await getPublishedPropertiesFiltered({
    currency: currency,
    state: state,
    city: city,
    typeProperty: typeProperty,
    operation: operation,
    page: page ? parseInt(page) : 1,
  });

  const properties = result?.data ?? [];
  const pagination = result?.pagination;

  return (
    <>
      {/* Hero Slider */}
      <Slider />

      {/* NavBar - Sticky under Slider with proper z-index */}
      <div className="sticky top-16 bg-background shadow-[0_4px_8px_-4px_rgba(0,0,0,0.12)] z-50">
        <NavBar />
      </div>

      {/* Featured Properties Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 relative z-0">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Propiedades destacadas
          </h1>
          <p className="mt-4 text-gray-600">
            Explora nuestras propiedades más destacadas seleccionadas especialmente para ti.
          </p>
        </div>

        {/* Featured Properties List */}
        <FeaturedPropertiesList
          properties={featuredProperties}
          pagination={featuredPagination}
          isLoading={false}
        />
      </div>

      {/* Regular Portal Properties Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 relative z-0">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Busca tu propiedad ideal
          </h2>
          <p className="mt-4 text-gray-600">
            Filtra y explora todas nuestras propiedades disponibles.
          </p>
        </div>
        <PortalClient initialProperties={properties} initialPagination={pagination} />
      </div>
    </>
  );
}
