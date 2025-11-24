import { Suspense } from 'react';
import NavBar from '../../ui/NavBar';
import PropertyFilterRent from '@/components/PropertyFilterRent/PropertyFilterRent';
import ListProperties from '../../ui/ListProperties';
import { getRentPropertiesFiltered, FilterRentPropertiesDto } from '@/app/actions/rentProperties';

interface RentPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getRentProperties(searchParams: { [key: string]: string | string[] | undefined }) {
  const filters: FilterRentPropertiesDto = {
    filters: {
      typeProperty: typeof searchParams.typeProperty === 'string' ? searchParams.typeProperty : undefined,
      state: typeof searchParams.state === 'string' ? searchParams.state : undefined,
      city: typeof searchParams.city === 'string' ? searchParams.city : undefined,
      currency: typeof searchParams.currency === 'string' ? searchParams.currency : 'CLP',
    },
    sort: typeof searchParams.sort === 'string' ? searchParams.sort : 'created_desc',
    page: typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1,
    limit: 9,
  };

  try {
    const result = await getRentPropertiesFiltered(filters);
    return { filters, propertiesData: result };
  } catch (error) {
    console.error('Error fetching rent properties:', error);
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

export default async function RentPage({ searchParams }: RentPageProps) {
  const params = await searchParams;
  const { filters, propertiesData } = await getRentProperties(params);

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Propiedades en Arriendo
          </h1>
          <p className="text-muted-foreground">
            Encuentra la propiedad perfecta para arrendar en nuestra plataforma
          </p>
        </div>

        <div className="space-y-6">
          <Suspense fallback={<div className="h-32 bg-muted animate-pulse rounded-lg" />}>
            <PropertyFilterRent
              initialFilters={filters}
            />
          </Suspense>

          <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
            <ListProperties
              properties={propertiesData.data}
              pagination={{
                total: propertiesData.total,
                page: propertiesData.page,
                limit: propertiesData.limit,
                totalPages: propertiesData.totalPages,
                hasNextPage: propertiesData.page < propertiesData.totalPages,
                hasPrevPage: propertiesData.page > 1,
              }}
            />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
