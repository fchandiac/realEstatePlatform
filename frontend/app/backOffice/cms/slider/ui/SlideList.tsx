'use client';

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAlert } from '@/app/contexts/AlertContext';
import { TextField } from '@/components/TextField/TextField';
import IconButton from '@/components/IconButton/IconButton';
import Dialog from '@/components/Dialog/Dialog';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  UniqueIdentifier,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { Slide, getSlides, reorderSlides } from '@/app/actions/slides';
import SortableSlideCard from '@/components/SortableSlideCard/SortableSlideCard';
import CreateSlideForm from './CreateSlideForm';

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
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const alert = useAlert();

  // Configuración de sensores para drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  // Recargar slides desde el servidor
  const refreshSlides = async () => {
    try {
      const result = await getSlides({
        search: search || undefined,
      });
      if (result.success) {
        setSlides(result.data || []);
      }
    } catch (error) {
      console.error('Error recargando slides:', error);
      alert.error('Error al recargar los slides');
    }
  };

  // Drag & Drop handlers
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = slides.findIndex((slide) => slide.id === active.id);
    const newIndex = slides.findIndex((slide) => slide.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      // Actualización optimista
      const reorderedSlides = arrayMove(slides, oldIndex, newIndex);
      setSlides(reorderedSlides);

      // Llamada al backend
      try {
        const slideIds = reorderedSlides.map(slide => slide.id);
        const result = await reorderSlides(slideIds);
        
        if (!result.success) {
          // Revertir cambios si falla
          setSlides(slides);
          alert.error(result.error || 'Error al reordenar slides');
        } else {
          alert.success('Slides reordenados exitosamente');
        }
      } catch (error) {
        // Revertir cambios si hay error
        setSlides(slides);
        alert.error('Error al reordenar slides');
      }
    }
  };

  // Handlers CRUD
  const handleAddSlide = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    refreshSlides(); // Recargar la lista
    alert.success('Slide creado exitosamente');
  };

  const handleCreateCancel = () => {
    setIsCreateDialogOpen(false);
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
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={filteredSlides.map(slide => slide.id)} 
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
              {filteredSlides.map(slide => (
                <SortableSlideCard
                  key={slide.id}
                  slide={slide}
                />
              ))}
            </div>
          </SortableContext>
          
          <DragOverlay>
            {activeId ? (
              <SortableSlideCard
                slide={filteredSlides.find(slide => slide.id === activeId)!}
                isDragOverlay
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Modal de crear slide */}
      <Dialog 
        open={isCreateDialogOpen} 
        onClose={() => setIsCreateDialogOpen(false)}
        size="lg"
        title="Crear Nuevo Slide"
      >
        <CreateSlideForm
          onSuccess={handleCreateSuccess}
          onCancel={handleCreateCancel}
        />
      </Dialog>
    </div>
  );
};

export default SlideList;
