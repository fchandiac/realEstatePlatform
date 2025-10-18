import SalesGrid from './ui/SalesGrid';
import { getSalePropertiesGrid } from '@/app/actions';

export default async function SalesPage() {
  // fetch grid data using server action; enable pagination by default
  const result = await getSalePropertiesGrid({ pagination: true, limit: 20, filtration: true });

  // normalize response shape
  const rows = Array.isArray(result) ? result : result.data;
  const total = Array.isArray(result) ? result.length : result.total;

  return (
    <div className="p-4">
      <SalesGrid rows={rows} totalRows={total} title="Listado de Propiedades (Venta)" />
    </div>
  );
}
