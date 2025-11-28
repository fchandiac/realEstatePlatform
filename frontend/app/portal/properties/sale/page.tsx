import { Suspense } from 'react';
import PropertyFilterSale from '@/components/PropertyFilterSale/PropertyFilterSale';
import ListProperties from '../../ui/ListProperties';
import { getSalePropertiesFiltered, FilterSalePropertiesDto } from '@/app/actions/saleProperties';
import PaginationWrapper from './PaginationWrapper';

interface SalePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getSaleProperties(searchParams: { [key: string]: string | string[] | undefined }) {
  console.log('🔍 [getSaleProperties] Raw searchParams:', searchParams);

  const filters: FilterSalePropertiesDto = {
    filters: {
      typeProperty: typeof searchParams.typeProperty === 'string' && searchParams.typeProperty ?
        decodeURIComponent(searchParams.typeProperty) : undefined,
      state: typeof searchParams.state === 'string' && searchParams.state ?
        decodeURIComponent(searchParams.state) : undefined,
      city: typeof searchParams.city === 'string' && searchParams.city ?
        decodeURIComponent(searchParams.city) : undefined,
      currency: typeof searchParams.currency === 'string' && searchParams.currency ?
        decodeURIComponent(searchParams.currency) : 'CLP',
    },
    sort: typeof searchParams.sort === 'string' && searchParams.sort ?
      decodeURIComponent(searchParams.sort) : 'created_desc',
    page: typeof searchParams.page === 'string' && searchParams.page ?
      parseInt(decodeURIComponent(searchParams.page)) : 1,
    limit: 9,
  };

  console.log('🔍 [getSaleProperties] Processed filters:', filters);

  try {
    const result = await getSalePropertiesFiltered(filters);
    return { filters, propertiesData: result };
  } catch (error) {
    console.error('Error fetching sale properties:', error);
    return {
      filters,
      propertiesData: {
        data: [],
        total: 0,
        page: 1,
        limit: 9,
        totalPages: 0,
      }
    };
  }
}

export default async function SalePage({ searchParams }: SalePageProps) {
  const params = await searchParams;
  const { filters, propertiesData } = await getSaleProperties(params);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Propiedades en Venta
          </h1>
          <p className="text-muted-foreground">
            Encuentra la propiedad perfecta para comprar en nuestra plataforma
          </p>
        </div>

        <div className="space-y-6">
          <Suspense fallback={<div className="h-32 bg-muted animate-pulse rounded-lg" />}>
            <PropertyFilterSale
              initialFilters={filters}
            />
          </Suspense>

          <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
            <PaginationWrapper
              properties={propertiesData.data}
              pagination={{
                total: propertiesData.total,
                page: propertiesData.page,
                limit: propertiesData.limit,
                totalPages: propertiesData.totalPages,
                hasNextPage: propertiesData.page < propertiesData.totalPages,
                hasPrevPage: propertiesData.page > 1,
              }}
              searchParams={params}
            />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
