'use client'
import React, { useState, useEffect } from 'react';
import Dialog from '@/components/Dialog/Dialog';
import StepperBaseForm, { StepperStep } from '@/components/BaseForm/StepperBaseForm';
import { TextField } from '@/components/TextField/TextField';
import Select from '@/components/Select/Select';
import AutoComplete from '@/components/AutoComplete/AutoComplete';
import FileImageUploader from '@/components/FileUploader/FileImageUploader';
import CreateLocationPicker from '@/components/LocationPicker/CreateLocationPickerWrapper';
import { Button } from '@/components/Button/Button';
import Alert from '@/components/Alert/Alert';
import DotProgress from '@/components/DotProgress/DotProgress';
import FontAwesome from '@/components/FontAwesome/FontAwesome';
import { getPropertyTypes } from '@/app/actions/propertyTypes';
import { listAgents } from '@/app/actions/users';

const steps: StepperStep[] = [
  {
    title: 'Datos generales',
    description: 'Información básica de la propiedad como título, descripción y tipo de operación',
    fields: [
      { name: 'title', label: 'Título', type: 'text', required: true },
      { name: 'description', label: 'Descripción', type: 'textarea', rows: 3 },
      { name: 'status', label: 'Estado publicación', type: 'select', required: true, options: [ { id: 1, label: 'Publicado' }, { id: 2, label: 'Inactivo' } ] },
      { name: 'operationType', label: 'Operación', type: 'select', required: true, options: [ { id: 1, label: 'Venta' }, { id: 2, label: 'Arriendo' } ] },
      { name: 'propertyTypeId', label: 'Tipo de propiedad', type: 'select', options: [] },
      { name: 'assignedAgentId', label: 'Agente asignado', type: 'autocomplete', options: [] },
    ],
  },
  {
    title: 'Ubicación',
    description: 'Define la ubicación geográfica de tu propiedad con dirección y coordenadas',
    fields: [
      { name: 'state', label: 'Estado', type: 'select', options: [] },
      { name: 'city', label: 'Ciudad', type: 'select', options: [] },
      { name: 'address', label: 'Dirección', type: 'text' },
      { name: 'location', label: 'Ubicación', type: 'location' },
    ],
  },
  {
    title: 'Características',
    description: 'Detalles físicos y características específicas de la propiedad',
    fields: [
      { name: 'bedrooms', label: 'Dormitorios', type: 'number' },
      { name: 'bathrooms', label: 'Baños', type: 'number' },
      { name: 'builtSquareMeters', label: 'Metros construidos', type: 'number' },
      { name: 'landSquareMeters', label: 'Metros terreno', type: 'number' },
      { name: 'parkingSpaces', label: 'Estacionamientos', type: 'number' },
      { name: 'floors', label: 'Pisos', type: 'number' },
      { name: 'constructionYear', label: 'Año construcción', type: 'number' },
    ],
  },
  {
    title: 'Precio y publicación',
    description: 'Configuración de precio, moneda y detalles de publicación',
    fields: [
      { name: 'price', label: 'Precio', type: 'currency' },
      { name: 'currencyPrice', label: 'Moneda', type: 'select', options: [ { id: 1, label: 'CLP' }, { id: 2, label: 'UF' } ] },
      { name: 'publicationDate', label: 'Fecha publicación', type: 'text' },
      { name: 'status', label: 'Estado publicación', type: 'select', options: [ { id: 1, label: 'Publicado' }, { id: 2, label: 'Inactivo' } ] },
    ],
  },
  {
    title: 'SEO',
    description: 'Optimización para motores de búsqueda y metadatos',
    fields: [
      { name: 'seoTitle', label: 'Título SEO', type: 'text' },
      { name: 'seoDescription', label: 'Descripción SEO', type: 'textarea', rows: 3 },
    ],
  },
  {
    title: 'Multimedia',
    description: 'Imágenes y videos que acompañarán la publicación',
    fields: [
      { name: 'multimedia', label: 'Imágenes y videos', type: 'text' }, // Puedes reemplazar por un uploader custom si lo necesitas
    ],
  },
  {
    title: 'Internos',
    description: 'Notas y comentarios internos para el equipo',
    fields: [
      { name: 'internalNotes', label: 'Notas internas', type: 'textarea', rows: 2 },
    ],
  },
];

interface CreatePropertyProps {
  open: boolean;
  onClose: () => void;
  onSave: (form: any) => Promise<void>;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  scroll?: 'body' | 'paper';
}

export default function CreateProperty({ open, onClose, onSave }: CreatePropertyProps) {
  const [form, setForm] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [propertyTypes, setPropertyTypes] = useState<Array<{ id: number; label: string }>>([]);
  const [agents, setAgents] = useState<Array<{ id: number; label: string }>>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Load options when component mounts
  useEffect(() => {
    const loadOptions = async () => {
      setLoadingOptions(true);
      try {
        // Load property types
        const propertyTypesResult = await getPropertyTypes();
        const formattedPropertyTypes = propertyTypesResult.map((pt) => ({
          id: parseInt(pt.id) || 0,
          label: pt.name
        }));
        setPropertyTypes(formattedPropertyTypes);

        // Load agents
        const agentsResult = await listAgents({ limit: 100 });
        if (agentsResult.success && agentsResult.data) {
          const formattedAgents = agentsResult.data.data.map((agent) => ({
            id: parseInt(agent.id) || 0,
            label: `${agent.personalInfo?.firstName || ''} ${agent.personalInfo?.lastName || ''} (${agent.username})`.trim()
          }));
          setAgents(formattedAgents);
        }
      } catch (error) {
        console.error('Error loading options:', error);
      } finally {
        setLoadingOptions(false);
      }
    };

    loadOptions();
  }, []);

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!form.title || !form.status || !form.operationType) {
        setError('Completa los campos obligatorios');
        setLoading(false);
        return;
      }
      await onSave(form);
      setLoading(false);
      onClose();
    } catch (e) {
      setError('Error al guardar');
      setLoading(false);
    }
  };

  // Custom stepper state
  const [activeStep, setActiveStep] = useState(0);

  // Helper to get options for each field
  const getFieldOptions = (fieldName: string) => {
    switch (fieldName) {
      case 'propertyTypeId':
        return propertyTypes;
      case 'assignedAgentId':
        return agents;
      default:
        return [];
    }
  };

  // Helper to render fields for current step
  const renderFields = (fields: any[]) => (
    <div className="flex flex-col gap-4">
      {loadingOptions && (
        <div className="flex justify-center py-4">
          <DotProgress />
          <span className="ml-2 text-sm text-secondary">Cargando opciones...</span>
        </div>
      )}
      {fields.map((field, idx) => {
        // Get field-specific options or use field.options as fallback
        const fieldOptions = getFieldOptions(field.name);
        const options = fieldOptions.length > 0 ? fieldOptions : (field.options || []);
        if (field.name === 'multimedia') {
          // Custom multimedia upload and gallery UI
          const files = form[field.name] || [];
          const inputId = 'multimedia-upload-input';
          const handleMultimediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFiles = Array.from(e.target.files || []);
            // Avoid duplicates by name and size
            const allFiles = [...files, ...selectedFiles];
            const uniqueFiles = Array.from(
              new Map(allFiles.map(f => [f.name + f.size, f])).values()
            ).slice(0, 20);
            handleChange(field.name, uniqueFiles);
            e.target.value = '';
          };
          const handleRemove = (idx: number) => {
            const newFiles = files.filter((_: any, i: number) => i !== idx);
            handleChange(field.name, newFiles);
          };
          return (
            <div key={field.name} className="flex flex-col gap-2">
              <label htmlFor={inputId} className="font-medium cursor-pointer inline-block mb-2">
                <span className="inline-block px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary/80 transition">Subir imágenes o videos</span>
                <input
                  id={inputId}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={handleMultimediaChange}
                />
              </label>
              {files.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                  {files.map((file: File, i: number) => {
                    const url = URL.createObjectURL(file);
                    const isImage = file.type.startsWith('image/');
                    const isVideo = file.type.startsWith('video/');
                    return (
                      <div key={i} className="relative w-full aspect-[16/9] bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                        {isImage ? (
                          <img src={url} alt={file.name} className="object-cover w-full h-full" />
                        ) : isVideo ? (
                          <video src={url} controls className="object-cover w-full h-full" preload="metadata" poster="" />
                        ) : (
                          <span className="text-xs text-gray-500">Archivo no soportado</span>
                        )}
                        <button
                          type="button"
                          className="absolute top-2 right-2 bg-white/80 rounded-full p-1 text-accent shadow"
                          onClick={() => handleRemove(i)}
                          aria-label="Eliminar archivo"
                        >
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }
        // Otros campos
        switch (field.type) {
          case 'text':
            return (
              <TextField
                key={field.name}
                label={field.label || 'Campo'}
                placeholder={field.label || 'Campo'}
                value={form[field.name] || ''}
                required={field.required}
                onChange={e => handleChange(field.name, e.target.value)}
              />
            );
          case 'textarea':
            return (
              <TextField
                key={field.name}
                label={field.label || 'Campo'}
                placeholder={field.label || 'Campo'}
                value={form[field.name] || ''}
                required={field.required}
                rows={field.rows || 3}
                onChange={e => handleChange(field.name, e.target.value)}
              />
            );
          case 'number':
            return (
              <TextField
                key={field.name}
                label={field.label || 'Campo'}
                placeholder={field.label || 'Campo'}
                type="number"
                value={form[field.name] || ''}
                onChange={e => handleChange(field.name, e.target.value)}
              />
            );
          case 'select':
            return (
              <Select
                key={field.name}
                options={options}
                placeholder={field.label || 'Selecciona'}
                value={form[field.name] || null}
                required={field.required}
                onChange={val => handleChange(field.name, val)}
              />
            );
          case 'autocomplete':
            return (
              <AutoComplete
                key={field.name}
                options={options}
                label={field.label || 'Buscar'}
                placeholder={field.label || 'Buscar'}
                value={form[field.name] || null}
                onChange={val => handleChange(field.name, val)}
              />
            );
          case 'location':
            return (
              <CreateLocationPicker
                key={field.name}
                // No value prop, just onChange
                onChange={val => handleChange(field.name, val)}
              />
            );
          case 'currency':
            return (
              <TextField
                key={field.name}
                label={field.label || 'Precio'}
                placeholder={field.label || 'Precio'}
                type="currency"
                value={form[field.name] || ''}
                onChange={e => handleChange(field.name, e.target.value)}
              />
            );
          case 'file':
            return (
              <FileImageUploader
                key={field.name}
                uploadPath="/uploads/properties"
                onChange={val => handleChange(field.name, val)}
                label={field.label || 'Imágenes'}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );

  // Stepper visual mejorado
  const renderStepper = () => (
    <div className="w-full">
      {/* Círculos del stepper - alineados a la izquierda y más pequeños */}
      <div className="flex items-center justify-start gap-2 mb-6">
        {steps.map((step, idx) => (
          <button
            key={step.title}
            type="button"
            className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-150 text-xs
              ${activeStep === idx 
                ? 'bg-primary border-primary text-white' 
                : idx < activeStep 
                ? 'bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed opacity-60' 
                : 'bg-background border-secondary text-secondary hover:bg-muted'
              }`}
            onClick={() => setActiveStep(idx)}
            aria-label={`Ir a paso ${step.title}`}
            disabled={idx < activeStep}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {/* Card del paso activo - 100% del ancho */}
      <div className="w-full mb-6">
        <div className="bg-muted/20 rounded-lg p-4 border border-border">
          <div className="flex items-start gap-4">
            {/* Número del paso */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-lg">
                {activeStep + 1}
              </div>
            </div>
            
            {/* Título y descripción */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {steps[activeStep].title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {steps[activeStep].description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Navigation buttons
  const renderNavButtons = () => (
    <div className="flex justify-end items-center gap-2">
      {activeStep > 0 && (
        <Button variant="secondary" onClick={() => setActiveStep(activeStep - 1)}>
          Atrás
        </Button>
      )}
      {activeStep < steps.length - 1 ? (
        <Button variant="primary" onClick={() => setActiveStep(activeStep + 1)}>
          Siguiente
        </Button>
      ) : (
        <Button variant="primary" onClick={handleSubmit} loading={loading}>
          Guardar
        </Button>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col h-full">
      {/* Header fijo - Stepper mejorado */}
      <div className="flex-shrink-0">
        {renderStepper()}
        {error && <Alert variant="error" className="mb-4">{error}</Alert>}
      </div>
      
      {/* Contenido scrolleable */}
      <div className="flex-1 overflow-y-auto px-1">
        {renderFields(steps[activeStep].fields)}
      </div>
      
      {/* Footer fijo - Botones de navegación */}
      <div className="flex-shrink-0 mt-4 pt-4 border-t border-border">
        {renderNavButtons()}
        {loading && (
          <div className="flex justify-center mt-2">
            <DotProgress />
          </div>
        )}
      </div>
    </div>
  );
}
