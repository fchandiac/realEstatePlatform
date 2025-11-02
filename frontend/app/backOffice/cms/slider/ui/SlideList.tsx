'use client';

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAlert } from '@/app/contexts/AlertContext';
import { TextField } from '@/components/TextField/TextField';
import IconButton from '@/components/IconButton/IconButton';
import { Slide, toggleSlideStatus } from '@/app/actions/slides';
import SlideCard from './SlideCard';

export interface SlideListProps {
  slides: Slide[];
  emptyMessage?: string;
}

const defaultEmptyMessage = 'No hay slides para mostrar.';

export const SlideList: React.FC<SlideListProps> = ({
  slides: initialSlides,
  emptyMessage = defaultEmptyMessage,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [slides, setSlides] = useState<Slide[]>(initialSlides);
  const alert = useAlert();

  // Sincronizar con URL
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    setSlides(initialSlides);
  }, [initialSlides]);

  // Manejar cambio de búsqueda con sincronización URL
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setSearch(value);
    
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (value.trim()) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    
    // Actualizar URL sin recargar página
    router.replace(`?${params.toString()}`);
  };

  // Handlers CRUD
  const handleAddSlide = () => {
    // TODO: Implementar modal de creación
    alert.info('Función de crear slide pendiente de implementar');
  };

  // Toggle status con update optimista
  const handleToggleStatus = async (slideId: string) => {
    try {
      // 1. Update optimista local
      setSlides(prevSlides => 
        prevSlides.map(slide => 
          slide.id === slideId 
            ? { ...slide, isActive: !slide.isActive }
            : slide
        )
      );

      // 2. Server action
      const result = await toggleSlideStatus(slideId);
      
      if (!result.success) {
        throw new Error(result.error || 'Error updating slide status');
      }

      // 3. Success feedback
      alert.success('Estado del slide actualizado exitosamente');
    } catch (err) {
      console.error('Error updating slide status:', err);
      
      // 4. Rollback optimistic update
      setSlides(initialSlides);
      alert.error('Error al actualizar el estado. Por favor, inténtalo de nuevo.');
    }
  };

  // Filtrado local (servidor ya filtra, esto es adicional)
  const filteredSlides = slides.filter(slide =>
    slide.title.toLowerCase().includes(search.toLowerCase()) ||
    (slide.description && slide.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="w-full">
      {/* Toolbar: Create + Search */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex-shrink-0">
          <IconButton
            aria-label="Agregar slide"
            variant="containedPrimary"
            onClick={handleAddSlide}
            icon="add"
          />
        </div>
        <div className="flex-1 min-w-0 max-w-xs sm:max-w-sm">
          <TextField
            label="Buscar slides"
            value={search}
            onChange={handleSearchChange}
            startIcon="search"
            placeholder="Buscar por título o descripción..."
          />
        </div>
      </div>

      {/* Grid de slides */}
      {filteredSlides.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <span className="material-symbols-outlined text-6xl mb-4 block">
            photo_library
          </span>
          <p className="text-lg font-medium mb-2">
            {search ? `No se encontraron slides para "${search}"` : emptyMessage}
          </p>
          {search && (
            <p className="text-sm">
              Intenta con otros términos de búsqueda o crea un nuevo slide.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
          {filteredSlides.map(slide => (
            <div key={slide.id} className="w-full">
              <SlideCard
                id={slide.id}
                title={slide.title}
                description={slide.description}
                multimediaUrl={slide.multimediaUrl}
                linkUrl={slide.linkUrl}
                duration={slide.duration}
                startDate={slide.startDate}
                endDate={slide.endDate}
                isActive={slide.isActive}
                order={slide.order}
              />
              
              {/* Action buttons */}
              <div className="flex justify-center gap-2 mt-3">
                <IconButton
                  aria-label={slide.isActive ? 'Desactivar slide' : 'Activar slide'}
                  variant={slide.isActive ? "outlined" : "containedSecondary"}
                  onClick={() => handleToggleStatus(slide.id)}
                  icon={slide.isActive ? "visibility_off" : "visibility"}
                  size="sm"
                />
                <IconButton
                  aria-label="Editar slide"
                  variant="outlined"
                  onClick={() => alert.info('Función de editar pendiente de implementar')}
                  icon="edit"
                  size="sm"
                />
                <IconButton
                  aria-label="Eliminar slide"
                  variant="outlined"
                  onClick={() => alert.info('Función de eliminar pendiente de implementar')}
                  icon="delete"
                  size="sm"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SlideList;
