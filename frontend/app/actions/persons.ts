'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { env } from '@/lib/env'

export interface Person {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  dni?: string
  address?: string
  city?: string
  state?: string
  country?: string
  birthDate?: string
  profilePicture?: string
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

export interface CreatePersonDto {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  dni?: string
  address?: string
  city?: string
  state?: string
  country?: string
  birthDate?: string
  profilePicture?: string
}

export interface UpdatePersonDto {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  dni?: string
  address?: string
  city?: string
  state?: string
  country?: string
  birthDate?: string
  profilePicture?: string
}

export interface ListPersonsParams {
  search?: string
  page?: number
  limit?: number
  sort?: 'asc' | 'desc'
  sortField?: string
  city?: string
  state?: string
  country?: string
}

/**
 * Lista todas las personas con filtros y paginación
 */
export async function listPersons(params?: ListPersonsParams): Promise<Person[]> {
  const session = await getServerSession(authOptions)
  
  if (!session?.accessToken) {
    throw new Error('No authenticated')
  }

  try {
    const url = new URL(`${env.backendApiUrl}/persons`)
    
    if (params?.search) url.searchParams.set('search', params.search)
    if (params?.page) url.searchParams.set('page', params.page.toString())
    if (params?.limit) url.searchParams.set('limit', params.limit.toString())
    if (params?.sort) url.searchParams.set('sort', params.sort)
    if (params?.sortField) url.searchParams.set('sortField', params.sortField)
    if (params?.city) url.searchParams.set('city', params.city)
    if (params?.state) url.searchParams.set('state', params.state)
    if (params?.country) url.searchParams.set('country', params.country)

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch persons: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error('Error fetching persons:', error)
    throw error
  }
}

/**
 * Obtiene una persona por ID
 */
export async function getPerson(id: string): Promise<Person> {
  const session = await getServerSession(authOptions)
  
  if (!session?.accessToken) {
    throw new Error('No authenticated')
  }

  try {
    const response = await fetch(`${env.backendApiUrl}/persons/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch person: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error('Error fetching person:', error)
    throw error
  }
}

/**
 * Crea una nueva persona
 */
export async function createPerson(data: CreatePersonDto): Promise<Person> {
  const session = await getServerSession(authOptions)
  
  if (!session?.accessToken) {
    throw new Error('No authenticated')
  }

  try {
    const response = await fetch(`${env.backendApiUrl}/persons`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Failed to create person: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error('Error creating person:', error)
    throw error
  }
}

/**
 * Actualiza una persona existente
 */
export async function updatePerson(id: string, data: UpdatePersonDto): Promise<Person> {
  const session = await getServerSession(authOptions)
  
  if (!session?.accessToken) {
    throw new Error('No authenticated')
  }

  try {
    const response = await fetch(`${env.backendApiUrl}/persons/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Failed to update person: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error('Error updating person:', error)
    throw error
  }
}

/**
 * Elimina una persona (soft delete)
 */
export async function deletePerson(id: string): Promise<void> {
  const session = await getServerSession(authOptions)
  
  if (!session?.accessToken) {
    throw new Error('No authenticated')
  }

  try {
    const response = await fetch(`${env.backendApiUrl}/persons/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Failed to delete person: ${response.status}`)
    }
  } catch (error) {
    console.error('Error deleting person:', error)
    throw error
  }
}

/**
 * Busca personas por DNI
 */
export async function searchPersonByDNI(dni: string): Promise<Person | null> {
  const session = await getServerSession(authOptions)
  
  if (!session?.accessToken) {
    throw new Error('No authenticated')
  }

  try {
    const response = await fetch(`${env.backendApiUrl}/persons/search-by-dni/${dni}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })

    if (response.status === 404) {
      return null
    }

    if (!response.ok) {
      throw new Error(`Failed to search person by DNI: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error('Error searching person by DNI:', error)
    throw error
  }
}

/**
 * Busca personas por email
 */
export async function searchPersonByEmail(email: string): Promise<Person | null> {
  const session = await getServerSession(authOptions)
  
  if (!session?.accessToken) {
    throw new Error('No authenticated')
  }

  try {
    const response = await fetch(`${env.backendApiUrl}/persons/search-by-email/${email}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })

    if (response.status === 404) {
      return null
    }

    if (!response.ok) {
      throw new Error(`Failed to search person by email: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error('Error searching person by email:', error)
    throw error
  }
}

/**
 * Obtiene estadísticas de personas (admin only)
 */
export async function getPersonsStatistics(): Promise<{
  total: number
  byCountry: Record<string, number>
  byState: Record<string, number>
  byCity: Record<string, number>
  recentlyCreated: number
}> {
  const session = await getServerSession(authOptions)
  
  if (!session?.accessToken) {
    throw new Error('No authenticated')
  }

  try {
    const response = await fetch(`${env.backendApiUrl}/persons/statistics`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch persons statistics: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error('Error fetching persons statistics:', error)
    throw error
  }
}