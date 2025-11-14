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
  handleUpdateBasic: (payload: UpdatePropertyBasicDto) => Promise<boolean>;
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
  const { showAlert } = useAlert();

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
        showAlert({ message: 'Propiedad actualizada exitosamente', type: 'success', duration: 3000 });
        setOriginalData(formData);
        setHasChanges(false);
        if (onSave && result.data) {
          onSave(result.data as Property);
        }
      } else {
        showAlert({ message: result.error || 'Error al actualizar la propiedad', type: 'error', duration: 5000 });
      }
    } catch (error) {
      console.error('❌ [usePropertyForm] Error al guardar:', error);
      showAlert({ message: 'Error al guardar los cambios', type: 'error', duration: 5000 });
    } finally {
      setSaving(false);
    }
  }, [formData, hasChanges, showAlert, onSave]);

  /**
   * Actualiza solo la información básica de la propiedad
   */
  const handleUpdateBasic = useCallback(async (payload: UpdatePropertyBasicDto) => {
    if (!formData) {
      showAlert({ message: 'No hay datos de propiedad disponibles', type: 'error', duration: 3000 });
      return false;
    }

    setSavingBasic(true);
    try {
      console.log('💾 [usePropertyForm] Actualizando información básica...', payload);
      const result = await updatePropertyBasic(formData.id, payload);

      if (result.success) {
        showAlert({ message: 'Información básica actualizada', type: 'success', duration: 3000 });
        
        // Actualizar TODOS los campos en originalData
        setOriginalData(prev => {
          const updated = { ...prev };
          
          if (payload.title !== undefined) updated.title = payload.title;
          if (payload.description !== undefined) updated.description = payload.description;
          if (payload.status !== undefined) updated.status = payload.status;
          if (payload.operationType !== undefined) updated.operationType = payload.operationType;
          if (payload.isFeatured !== undefined) updated.isFeatured = payload.isFeatured;
          
          return updated;
        });

        if (onSave && result.data) {
          onSave(result.data as Property);
        }

        return true;
      } else {
        showAlert({ message: result.error || 'No se pudo actualizar la información básica', type: 'error', duration: 5000 });
        return false;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      console.error('❌ [usePropertyForm] Error al actualizar básica:', message);
      showAlert({ message: 'Error al actualizar la información básica', type: 'error', duration: 5000 });
      return false;
    } finally {
      setSavingBasic(false);
    }
  }, [formData, showAlert, onSave]);

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
