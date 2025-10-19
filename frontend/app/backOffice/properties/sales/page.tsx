import SalesGrid from './ui/SalesGrid';
import { getSalePropertiesGrid } from '@/app/actions';


interface PageProps {
  searchParams: Promise<{
    sort?: 'asc' | 'desc';
    sortField?: string;
    search?: string;
    filters?: string;
    page?: string;
    limit?: string;
  }>;
}



export default async function SalesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const sort = params.sort === 'asc' ? 'asc' : (params.sort === 'desc' ? 'desc' : undefined);
  const sortField = typeof params.sortField === 'string' ? params.sortField : undefined;
  const search = typeof params.search === 'string' ? params.search : '';
  const filters = typeof params.filters === 'string' ? params.filters : '';
  const pageParam = typeof params.page === 'string' ? params.page : '1';
  const limitParam = typeof params.limit === 'string' ? params.limit : '10';
  const page = parseInt(pageParam) || 1;
  const limit = parseInt(limitParam) || 25;

  const result = await getSalePropertiesGrid({ sort, sortField, search, filters, page, limit });
  const rows = (result as any).rows ?? (result as any).data ?? [];
  const totalRows = (result as any).totalRows ?? (result as any).total ?? rows.length;
  console.log('SalesPage - fetched rows:', rows.length, 'totalRows:', totalRows);


  return (
    <div className="p-4">
      <SalesGrid rows={rows} totalRows={totalRows} />
    </div>
  );
}
