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
import DeleteSlideForm from './DeleteSlideForm';
import UpdateSlideForm from './UpdateSlideForm';

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [slideToDelete, setSlideToDelete] = useState<Slide | null>(null);
  const [slideToEdit, setSlideToEdit] = useState<Slide | null>(null);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [isMounted, setIsMounted] = useState(false);
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

  // Effect para evitar hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  // Handlers para Delete
  const handleDeleteSlide = (slide: Slide) => {
    setSlideToDelete(slide);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteSuccess = () => {
    setIsDeleteDialogOpen(false);
    setSlideToDelete(null);
    refreshSlides(); // Recargar la lista
    alert.success('Slide eliminado exitosamente');
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSlideToDelete(null);
  };

  // Handlers para Edit
  const handleEditSlide = (slide: Slide) => {
    setSlideToEdit(slide);
    setIsEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    setSlideToEdit(null);
    refreshSlides(); // Recargar la lista
    alert.success('Slide actualizado exitosamente');
  };

  const handleEditCancel = () => {
    setIsEditDialogOpen(false);
    setSlideToEdit(null);
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
            size={'lg'}
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
        <>
          {!isMounted ? (
            // Renderizar grid simple sin drag & drop durante SSR
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 w-full items-stretch">
              {filteredSlides.map(slide => (
                <div key={slide.id} className="h-full bg-white rounded-lg w-full border-l-4 border-secondary border-t border-b border-r border-border shadow-lg text-left relative">
                  <div className="flex items-center justify-center w-full h-40 bg-gray-200 text-gray-400 overflow-hidden rounded-t-lg">
                    {slide.multimediaUrl ? (
                      <img
                        src={slide.multimediaUrl}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="material-symbols-outlined text-6xl">
                        image
                      </span>
                    )}
                  </div>
                  <div className="p-4 pt-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                      {slide.title}
                    </h3>
                    {slide.description && (
                      <p className="text-sm font-medium text-gray-500 mb-2 line-clamp-2">
                        {slide.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Renderizar con drag & drop después de mount
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
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 w-full items-stretch">
                  {filteredSlides.map(slide => (
                    <SortableSlideCard
                      key={slide.id}
                      slide={slide}
                      onDelete={handleDeleteSlide}
                      onEdit={handleEditSlide}
                    />
                  ))}
                </div>
              </SortableContext>
              
              <DragOverlay>
                {activeId ? (
                  <SortableSlideCard
                    slide={filteredSlides.find(slide => slide.id === activeId)!}
                    isDragOverlay
                    onDelete={handleDeleteSlide}
                    onEdit={handleEditSlide}
                  />
                ) : null}
              </DragOverlay>
            </DndContext>
          )}
        </>
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

      {/* Modal de eliminar slide */}
      <Dialog 
        open={isDeleteDialogOpen} 
        onClose={handleDeleteCancel}
        size="md"
        title=""
      >
        {slideToDelete && (
          <DeleteSlideForm
            slide={slideToDelete}
            onSuccess={handleDeleteSuccess}
            onCancel={handleDeleteCancel}
          />
        )}
      </Dialog>

      {/* Modal de editar slide */}
      <Dialog 
        open={isEditDialogOpen} 
        onClose={handleEditCancel}
        size="lg"
        title="Editar Slide"
      >
        {slideToEdit && (
          <UpdateSlideForm
            slide={slideToEdit}
            onSuccess={handleEditSuccess}
            onCancel={handleEditCancel}
          />
        )}
      </Dialog>
    </div>
  );
};

export default SlideList;
