'use client';

import { useState } from 'react';
import CircularProgress from '@/components/CircularProgress/CircularProgress';
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

export default function FullProperty({ propertyId, onSave }: FullPropertyProps) {
  const [activeSection, setActiveSection] = useState('basic');
  
  // Custom hooks para separar lógica
  const { property, propertyTypes, users, regions, loading, error } = 
    usePropertyData(propertyId);
  
  const { formData, handleChange, handleUpdateBasic, savingBasic } = 
    usePropertyForm(property!, onSave);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-neutral overflow-hidden">
        {/* Header skeleton durante carga */}
        <div className="h-16 bg-background border-b border-border flex items-center px-6">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-neutral-200 rounded animate-pulse"></div>
            <div className="h-6 bg-neutral-200 rounded w-48 animate-pulse"></div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar skeleton durante carga */}
          <div className="w-64 bg-background border-r border-border p-4">
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-10 bg-neutral-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* Contenido con loading */}
          <main className="flex-1 overflow-y-auto bg-background flex items-center justify-center">
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
      <div className="flex items-center justify-center h-screen text-red-500">
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
              await handleUpdateBasic({
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
    <div className="flex flex-col h-screen bg-neutral overflow-hidden">
      {/* Header */}
      <PropertyHeader property={formData} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <PropertySidebar
          sections={SECTIONS}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {/* Contenido */}
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="p-4">
            <div className="max-w-5xl mx-auto">
              {renderSection()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
