'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { env } from '@/lib/env'
import { RegionEnum, ComunaEnum } from '@/lib/enums'

// Funciones helper para convertir enums a formato de opciones para componentes

export async function getRegiones(): Promise<Array<{ id: string; label: string }>> {
  try {
    const session = await getServerSession(authOptions)
    
    if (session?.accessToken) {
      // Intentar obtener regiones desde el backend
      const response = await fetch(`${env.backendApiUrl}/config/regiones`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      })

      if (response.ok) {
        const data = await response.json()
        return data.map((region: any) => ({
          id: region.id || region.name || region.value,
          label: region.name || region.label || region.value
        }))
      }
    }
  } catch (error) {
    console.warn('Error fetching regiones from backend, using fallback data:', error)
  }

  // Fallback: usar datos locales de Chile
  return Object.entries(RegionEnum).map(([key, value]) => ({
    id: value, // Usar el valor como id (nombre de la región)
    label: value
  }))
}

export async function getComunas(): Promise<Array<{ id: string; label: string }>> {
  try {
    const session = await getServerSession(authOptions)
    
    if (session?.accessToken) {
      // Intentar obtener comunas desde el backend
      const response = await fetch(`${env.backendApiUrl}/config/comunas`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      })

      if (response.ok) {
        const data = await response.json()
        return data.map((comuna: any) => ({
          id: comuna.id || comuna.name || comuna.value,
          label: comuna.name || comuna.label || comuna.value
        }))
      }
    }
  } catch (error) {
    console.warn('Error fetching comunas from backend, using fallback data:', error)
  }

  // Fallback: usar datos locales de Chile
  return Object.entries(ComunaEnum).map(([key, value]) => ({
    id: value, // Usar el valor como id (nombre de la comuna)
    label: value
  }))
}

// Función para obtener comunas filtradas por región
export async function getComunasByRegion(region: string): Promise<Array<{ id: string; label: string }>> {
  try {
    const session = await getServerSession(authOptions)
    
    if (session?.accessToken && region) {
      // Intentar obtener comunas filtradas desde el backend
      const response = await fetch(`${env.backendApiUrl}/config/comunas?region=${encodeURIComponent(region)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      })

      if (response.ok) {
        const data = await response.json()
        return data.map((comuna: any) => ({
          id: comuna.id || comuna.name || comuna.value,
          label: comuna.name || comuna.label || comuna.value
        }))
      }
    }
  } catch (error) {
    console.warn('Error fetching comunas by region from backend, using fallback data:', error)
  }

  // Fallback: retornar todas las comunas (se podría implementar filtrado local si es necesario)
  return getComunas()
}

// Removed constant exports to comply with "use server" restrictions. These constants have been moved to a client-safe file.