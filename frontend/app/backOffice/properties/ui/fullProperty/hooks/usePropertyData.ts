'use client';

import { useState, useEffect } from 'react';
import { useAlert } from '@/app/contexts/AlertContext';
import { getFullProperty } from '@/app/actions/properties';
import { listPropertyTypes } from '@/app/actions/properties';
import { listAdminsAgents } from '@/app/actions/users';
import { getRegiones } from '@/app/actions/commons';
import type { Property, PropertyType, User, Region } from '../types/property.types';

interface UsePropertyDataReturn {
  property: Property | null;
  propertyTypes: PropertyType[];
  users: User[];
  regions: Region[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook para manejar el fetching de datos de la propiedad y sus dependencias
 */
export function usePropertyData(propertyId: string): UsePropertyDataReturn {
  const [property, setProperty] = useState<Property | null>(null);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const alert = useAlert();

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Cargar datos en paralelo para mejor performance
      const [propertyResult, typesResult, usersResult, regionsResult] = await Promise.all([
        getFullProperty(propertyId),
        listPropertyTypes(),
        listAdminsAgents({}),
        getRegiones()
      ]);

      // Procesar propiedad
      if (propertyResult.success && propertyResult.data) {
        console.log('🏠 [usePropertyData] Propiedad cargada:', propertyResult.data.id);
        setProperty(propertyResult.data as Property);
      } else {
        throw new Error(propertyResult.error || 'No se pudo cargar la propiedad');
      }

      // Procesar tipos de propiedad
      if (typesResult.success && typesResult.data) {
        console.log('🏷️ [usePropertyData] Tipos de propiedad cargados:', typesResult.data.length);
        setPropertyTypes(typesResult.data);
      }

      // Procesar usuarios
      if (usersResult.success && usersResult.data) {
        console.log('👥 [usePropertyData] Usuarios cargados:', usersResult.data.data?.length || 0);
        setUsers(usersResult.data.data || []);
      }

      // Procesar regiones
      console.log('🗺️ [usePropertyData] Regiones cargadas:', regionsResult.length);
      setRegions(regionsResult);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los datos';
      console.error('❌ [usePropertyData] Error:', errorMessage);
      setError(errorMessage);
      alert.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propertyId) {
      loadData();
    }
  }, [propertyId]);

  return {
    property,
    propertyTypes,
    users,
    regions,
    loading,
    error,
    refetch: loadData
  };
}
