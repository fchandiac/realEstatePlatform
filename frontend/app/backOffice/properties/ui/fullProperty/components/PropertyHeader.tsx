'use client';

import type { Property } from '../types/property.types';
import { PROPERTY_STATUSES } from '../utils/constants';

interface PropertyHeaderProps {
  property: Property;
}

export default function PropertyHeader({ property }: PropertyHeaderProps) {
  const statusInfo = PROPERTY_STATUSES.find(s => s.id === property.status);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-success/10 text-success';
      case 'REQUEST':
        return 'bg-warning/10 text-warning';
      case 'INACTIVE':
        return 'bg-muted/10 text-muted-foreground';
      case 'SOLD':
      case 'RENTED':
        return 'bg-info/10 text-info';
      default:
        return 'bg-muted/10 text-muted-foreground';
    }
  };

  return (
    <header className="flex items-center justify-between p-6 border-b border-border bg-background shadow-sm z-10">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Propiedad: {property.title || 'Sin título'}
          </h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="material-symbols-outlined text-xs">tag</span>
            ID: {property.id}
            <span className="mx-2 text-border">•</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
              {statusInfo?.label || property.status}
            </span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4" />
    </header>
  );
}
