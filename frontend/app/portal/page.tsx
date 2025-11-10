import PropertyCard from './ui/PropertyCard';
import { getPublishedPropertiesFiltered } from '@/app/actions/portalProperties';
import Slider from './ui/Slider';
import PortalClient from './PortalClient';

interface PortalPageProps {
  searchParams: Promise<{
    operation?: string;
    typeProperty?: string;
    state?: string;
    city?: string;
    currency?: string;
    page?: string;
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

  
  // Siempre llamar a getPublishedPropertiesFiltered
  const result = await getPublishedPropertiesFiltered({
    currency: currency,
    state: state,
    city: city,
    typeProperty: typeProperty,
    operation: operation,
    page: page ? parseInt(page) : 1,
  });

  const properties = result?.data ?? [];
  const pagination = result?.pagination;  // ← Extraer paginación completa
  const error = !result ? 'Error loading properties' : null;







  return (
    <div>
      <Slider />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Propiedades destacadas
          </h1>
          <p className="mt-4 text-gray-600">
            Explora nuestras propiedades más destacadas seleccionadas especialmente para ti.
          </p>
        </div>
      
      </div>
      

     

     

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <PortalClient initialProperties={properties} initialPagination={pagination} />
      </div>
    </div>
  );
}
