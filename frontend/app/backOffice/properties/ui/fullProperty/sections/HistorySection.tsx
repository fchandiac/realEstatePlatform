'use client';

i  return (
    <div className="space-y-4">rt moment from 'moment';
import { TextField } from '@/components/TextField/TextField';
import ChangeHistoryItem from '../components/ChangeHistoryItem';
import StatsCard from '../components/StatsCard';
import type { HistorySectionProps } from '../types/property.types';

export default function HistorySection({ property, onChange }: HistorySectionProps) {
  // Calcular estadísticas
  const stats = {
    favoritesCount: property.favoritesCount || 0,
    leadsCount: property.leads?.length || 0,
    viewsCount: property.views?.length || 0
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="space-y-6">
        {/* Header del historial */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Historial de Cambios</h3>
          <div className="text-sm text-muted-foreground">
            {property.changeHistory?.length || 0} cambios registrados
          </div>
        </div>

        {/* Lista de cambios */}
        {!property.changeHistory?.length ? (
          <p className="text-muted-foreground">No hay cambios registrados.</p>
        ) : (
          <div className="space-y-4">
            {property.changeHistory
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .map((change, index) => (
                <ChangeHistoryItem key={index} change={change} />
              ))}
          </div>
        )}

        {/* Estadísticas y notas internas */}
        <div className="border-t pt-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <StatsCard label="Favoritos" value={stats.favoritesCount} />
            <StatsCard label="Leads" value={stats.leadsCount} />
            <StatsCard label="Vistas" value={stats.viewsCount} />
          </div>

          <TextField
            label="Notas Internas"
            value={property.internalNotes || ''}
            onChange={(e) => onChange('internalNotes', e.target.value)}
            rows={3}
          />
        </div>

        {/* Vistas recientes */}
        <div className="border-t pt-6 mt-6">
          <h4 className="font-semibold mb-2">Vistas Recientes</h4>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {(property.views || []).slice(0, 10).map((view, index) => (
              <div key={index} className="border p-3 rounded-lg bg-muted/30">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Usuario: {view.userId}</p>
                    {view.duration && (
                      <p className="text-sm text-muted-foreground">Duración: {view.duration}s</p>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {view.viewedAt ? moment(view.viewedAt).format('DD/MM/YYYY HH:mm') : 'Fecha no disponible'}
                  </p>
                </div>
              </div>
            ))}
            {(property.views || []).length === 0 && (
              <p className="text-muted-foreground text-sm">No hay vistas registradas</p>
            )}
          </div>
        </div>
      </div>
  );
}
