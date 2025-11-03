'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { env } from '@/lib/env'

export async function getAboutUs() {
  // Try to get session, but don't require it for public about us data
  const session = await getServerSession(authOptions)

  const headers: Record<string, string> = {}
  if (session?.accessToken) {
    headers.Authorization = `Bearer ${session.accessToken}`
  }

  const res = await fetch(`${env.backendApiUrl}/about-us/last`, {
    headers,
  })

  if (!res.ok) {
    if (res.status === 404) return null // No about us found
    throw new Error('Failed to fetch about us')
  }

  return res.json()
}

export async function updateAboutUs(id: string, formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.accessToken) throw new Error('Unauthorized')

  const res = await fetch(`${env.backendApiUrl}/about-us/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: formData,
  })

  if (!res.ok) {
    const errorText = await res.text()
    console.error('Update about us failed:', res.status, errorText)
    throw new Error(`Failed to update about us: ${res.status} ${errorText}`)
  }

  return res.json()
}

export async function createAboutUs(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.accessToken) throw new Error('Unauthorized')

  const res = await fetch(`${env.backendApiUrl}/about-us`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: formData,
  })

  if (!res.ok) {
    const errorText = await res.text()
    console.error('Create about us failed:', res.status, errorText)
    throw new Error(`Failed to create about us: ${res.status} ${errorText}`)
  }

  return res.json()
}