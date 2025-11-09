import React from 'react';
import { MultimediaPropertyCard } from '../components';
import type { MultimediaSectionProps } from '../types/property.types';

export default function MultimediaSection({ property }: MultimediaSectionProps) {
  const multimedia = property.multimedia || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Multimedia ({multimedia.length})
        </h2>

        {multimedia.length === 0 ? (
          <div className="flex items-center justify-center h-48 rounded-lg border border-dashed border-border bg-neutral/50">
            <div className="text-center text-muted-foreground">
              <span className="material-symbols-outlined text-4xl mb-2 block">image</span>
              <p className="text-sm">No hay multimedia asociada a esta propiedad</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {multimedia.map((item) => (
              <MultimediaPropertyCard
                key={item.id}
                multimediaId={item.id}
                propertyId={property.id}
                mainImageUrl={property.mainImageUrl}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
