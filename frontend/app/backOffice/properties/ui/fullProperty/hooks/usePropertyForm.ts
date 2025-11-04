'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAlert } from '@/app/contexts/AlertContext';
import { updateProperty, updatePropertyBasic } from '@/app/actions/properties';
import type { Property, UpdatePropertyBasicDto } from '../types/property.types';

interface UsePropertyFormReturn {
  formData: Property;
  originalData: Property;
  hasChanges: boolean;
  saving: boolean;
  savingBasic: boolean;
  handleChange: (field: string, value: any) => void;
  handleSave: () => Promise<void>;
  handleUpdateBasic: (payload: UpdatePropertyBasicDto) => Promise<void>;
  resetForm: () => void;
}

/**
 * Custom hook para manejar el estado del formulario y las operaciones de guardado
 */
export function usePropertyForm(
  initialProperty: Property,
  onSave?: (data: Property) => void
): UsePropertyFormReturn {
  const [formData, setFormData] = useState<Property>(initialProperty);
  const [originalData, setOriginalData] = useState<Property>(initialProperty);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingBasic, setSavingBasic] = useState(false);
  const alert = useAlert();

  // Sincronizar formData cuando cambia initialProperty
  useEffect(() => {
    setFormData(initialProperty);
    setOriginalData(initialProperty);
  }, [initialProperty]);

  // Detectar cambios
  useEffect(() => {
    const changed = JSON.stringify(formData) !== JSON.stringify(originalData);
    setHasChanges(changed);
  }, [formData, originalData]);

  /**
   * Maneja cambios en los campos del formulario
   */
  const handleChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  /**
   * Guarda todos los cambios de la propiedad
   */
  const handleSave = useCallback(async () => {
    if (!formData || !hasChanges) {
      console.log('⚠️ [usePropertyForm] No hay cambios para guardar');
      return;
    }

    setSaving(true);
    try {
      console.log('💾 [usePropertyForm] Guardando cambios completos...');
      const result = await updateProperty(formData.id, formData as any);
      
      if (result.success) {
        alert.success('Propiedad actualizada exitosamente');
        setOriginalData(formData);
        setHasChanges(false);
        if (onSave && result.data) {
          onSave(result.data as Property);
        }
      } else {
        alert.error(result.error || 'Error al actualizar la propiedad');
      }
    } catch (error) {
      console.error('❌ [usePropertyForm] Error al guardar:', error);
      alert.error('Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  }, [formData, hasChanges, alert, onSave]);

  /**
   * Actualiza solo la información básica de la propiedad
   */
  const handleUpdateBasic = useCallback(async (payload: UpdatePropertyBasicDto) => {
    if (!formData) return;

    setSavingBasic(true);
    try {
      console.log('💾 [usePropertyForm] Actualizando información básica...', payload);
      const result = await updatePropertyBasic(formData.id, payload);

      if (result.success) {
        alert.success('Información básica actualizada');
        
        // Actualizar solo los campos básicos en originalData
        setOriginalData(prev => ({
          ...prev,
          title: payload.title || prev.title,
          description: payload.description !== undefined ? payload.description : prev.description,
          status: payload.status || prev.status,
          operationType: payload.operationType || prev.operationType,
          isFeatured: payload.isFeatured !== undefined ? payload.isFeatured : prev.isFeatured,
        }));

        if (onSave && result.data) {
          onSave(result.data as Property);
        }
      } else {
        alert.error(result.error || 'No se pudo actualizar la información básica');
      }
    } catch (error) {
      console.error('❌ [usePropertyForm] Error al actualizar básica:', error);
      alert.error('Error al actualizar la información básica');
    } finally {
      setSavingBasic(false);
    }
  }, [formData, alert, onSave]);

  /**
   * Resetea el formulario a los valores originales
   */
  const resetForm = useCallback(() => {
    setFormData(originalData);
    setHasChanges(false);
  }, [originalData]);

  return {
    formData,
    originalData,
    hasChanges,
    saving,
    savingBasic,
    handleChange,
    handleSave,
    handleUpdateBasic,
    resetForm
  };
}
