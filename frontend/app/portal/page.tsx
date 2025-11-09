import PropertyCard from './ui/PropertyCard';
import { getPublishedFeaturedPropertiesPublic } from '@/app/actions/properties';

export default async function PortalPage() {
  const res = await getPublishedFeaturedPropertiesPublic();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">Propiedades destacadas</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2">Explora nuestras propiedades publicadas recientemente</p>
      </div>

      {!res.success && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded p-4 text-sm">
          Ocurrió un error al cargar las propiedades: {res.error}
        </div>
      )}

      {res.success && (!res.data || res.data.length === 0) && (
        <div className="bg-card text-foreground border border-border rounded p-6 text-center text-sm">
          Aún no hay propiedades publicadas.
        </div>
      )}

      {res.success && res.data && res.data.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {res.data.map((p) => (
            <PropertyCard key={p.id} property={p as any} />
          ))}
        </div>
      )}
    </div>
  );
}
