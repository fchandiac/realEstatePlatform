'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { env } from '@/lib/env'

export async function getSliders() {
  const session = await getServerSession(authOptions)
  if (!session?.accessToken) throw new Error('Unauthorized')

  const res = await fetch(`${env.backendApiUrl}/sliders`, {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  })

  if (!res.ok) throw new Error('Failed to fetch sliders')
  return res.json()
}

export async function createSlider(data: any, image?: File) {
  const session = await getServerSession(authOptions)
  if (!session?.accessToken) throw new Error('Unauthorized')

  const formData = new FormData()
  Object.keys(data).forEach(key => {
    if (data[key] !== undefined) formData.append(key, data[key])
  })
  if (image) formData.append('image', image)

  const res = await fetch(`${env.backendApiUrl}/sliders`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${session.accessToken}` },
    body: formData,
  })

  if (!res.ok) throw new Error('Failed to create slider')
  return res.json()
}

export async function updateSlider(id: string, data: any, image?: File) {
  const session = await getServerSession(authOptions)
  if (!session?.accessToken) throw new Error('Unauthorized')

  const formData = new FormData()
  Object.keys(data).forEach(key => {
    if (data[key] !== undefined) formData.append(key, data[key])
  })
  if (image) formData.append('image', image)

  const res = await fetch(`${env.backendApiUrl}/sliders/${id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${session.accessToken}` },
    body: formData,
  })

  if (!res.ok) throw new Error('Failed to update slider')
  return res.json()
}

export async function deleteSlider(id: string) {
  const session = await getServerSession(authOptions)
  if (!session?.accessToken) throw new Error('Unauthorized')

  const res = await fetch(`${env.backendApiUrl}/sliders/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${session.accessToken}` },
  })

  if (!res.ok) throw new Error('Failed to delete slider')
}

export async function reorderSliders(ids: string[]) {
  const session = await getServerSession(authOptions)
  if (!session?.accessToken) throw new Error('Unauthorized')

  const res = await fetch(`${env.backendApiUrl}/sliders/reorder`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify({ ids }),
  })

  if (!res.ok) throw new Error('Failed to reorder sliders')
}