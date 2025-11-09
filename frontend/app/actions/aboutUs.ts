'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { env } from '@/lib/env'

export async function getAboutUs() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.accessToken) return { success: false, error: 'No autorizado' }

    const res = await fetch(`${env.backendApiUrl}/about-us`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    })

    if (!res.ok) {
      const payload = await res.json().catch(() => null)
      return { success: false, error: payload?.message || `HTTP ${res.status}` }
    }

    const data = await res.json()
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' }
  }
}

export async function updateAboutUs(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.accessToken) return { success: false, error: 'No autorizado' }

    const res = await fetch(`${env.backendApiUrl}/about-us`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${session.accessToken}` },
      body: formData,
    })

    if (!res.ok) {
      const payload = await res.json().catch(() => null)
      return { success: false, error: payload?.message || `HTTP ${res.status}` }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' }
  }
}