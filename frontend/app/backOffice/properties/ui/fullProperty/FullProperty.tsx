'use client';

import { useState } from 'react';
import DotProgress from '@/components/DotProgress/DotProgress';
import { PropertyHeader, PropertySidebar } from './components';
import {
  BasicSection,
  PriceSection,
  FeaturesSection,
  LocationSection,
  MultimediaSection,
  PostRequestSection,
  HistorySection,
  DatesSection
} from './sections';
import { usePropertyData } from './hooks/usePropertyData';
import { usePropertyForm } from './hooks/usePropertyForm';
import { SECTIONS } from './utils/constants';

interface FullPropertyProps {
  propertyId: string;
  onSave?: (data: any) => void;
}

// Constante para ancho fijo del sidebar - evita cambios durante loading
const SIDEBAR_WIDTH = 'w-64';

export default function FullProperty({ propertyId, onSave }: FullPropertyProps) {
  const [activeSection, setActiveSection] = useState('basic');
  
  // Custom hooks para separar lógica
  const { property, propertyTypes, users, regions, loading, error } = 
    usePropertyData(propertyId);
  
  const { formData, handleChange, handleUpdateBasic, savingBasic } = 
    usePropertyForm(property!, onSave);

  // Loading state - MEJORADO con layout estable
  if (loading) {
    return (
      <div className="flex flex-col h-full bg-neutral overflow-hidden w-full">
        {/* Header skeleton - Tamaño fijo */}
        <div className="h-16 bg-background border-b border-border flex items-center px-6 flex-shrink-0">
          <div className="flex items-center space-x-4 w-full max-w-7xl mx-auto">
            <div className="w-8 h-8 bg-neutral-200 rounded animate-pulse flex-shrink-0"></div>
            <div className="h-6 bg-neutral-200 rounded w-48 animate-pulse"></div>
          </div>
        </div>

        {/* Main layout skeleton con estructura fija */}
        <div className="flex flex-1 overflow-hidden w-full">
          {/* Sidebar skeleton - ANCHO FIJO, NO CAMBIA */}
          <aside className={`${SIDEBAR_WIDTH} bg-background border-r border-border p-4 flex-shrink-0 overflow-y-auto`}>
            <div className="space-y-2">
              {/* Simular estructura exacta del sidebar real */}
              {Array.from({ length: 8 }).map((_, i) => (
                <div 
                  key={i} 
                  className="h-10 bg-neutral-200 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </aside>

          {/* Content skeleton - Ancho flexible con padding consistente */}
          <main className="flex-1 overflow-y-auto bg-background flex items-center justify-center w-full">
            <div className="flex flex-col items-center space-y-4">
              <DotProgress size={24} />
              <p className="text-sm text-muted-foreground">Cargando propiedad...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !formData) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        {error || 'No se pudo cargar la propiedad'}
      </div>
    );
  }

  // Renderizar sección activa
  const renderSection = () => {
    const baseProps = {
      property: formData,
      onChange: handleChange
    };

    switch (activeSection) {
      case 'basic':
        return (
          <BasicSection 
            {...baseProps}
            propertyTypes={propertyTypes}
            users={users}
            onSave={async () => {
              // BasicSection maneja la creación del payload internamente
              return await handleUpdateBasic({
                title: formData.title,
                description: formData.description,
                status: formData.status,
                operationType: formData.operationType,
                propertyTypeId: formData.propertyType?.id,
                assignedAgentId: formData.assignedAgent?.id,
                isFeatured: formData.isFeatured,
              });
            }}
            saving={savingBasic}
          />
        );
      case 'price':
        return <PriceSection {...baseProps} />;
      case 'features':
        return <FeaturesSection {...baseProps} />;
      case 'location':
        return (
          <LocationSection 
            {...baseProps}
            regions={regions}
          />
        );
      case 'multimedia':
        return <MultimediaSection {...baseProps} />;
      case 'postRequest':
        return <PostRequestSection property={formData} />;
      case 'history':
        return <HistorySection {...baseProps} />;
      case 'dates':
        return <DatesSection property={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral overflow-hidden w-full">
      {/* Header - Tamaño fijo */}
      <PropertyHeader property={formData} />

      {/* Main layout - Estructura estable */}
      <div className="flex flex-1 overflow-hidden w-full">
        {/* Sidebar - ANCHO FIJO, NO CAMBIA */}
        <PropertySidebar
          sections={SECTIONS}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          className={`${SIDEBAR_WIDTH} flex-shrink-0`}
        />

        {/* Contenido - Ancho flexible con máximo controlado */}
        <main className="flex-1 overflow-y-auto bg-background w-full">
          <div className="p-6 max-w-6xl mx-auto w-full">
            <div className="w-full">
              {renderSection()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
