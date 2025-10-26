'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { env } from '@/lib/env'

export async function getIdentity() {
  // Try to get session, but don't require it for public identity data
  const session = await getServerSession(authOptions)

  const headers: Record<string, string> = {}
  if (session?.accessToken) {
    headers.Authorization = `Bearer ${session.accessToken}`
  }

  const res = await fetch(`${env.backendApiUrl}/identities/last`, {
    headers,
  })

  if (!res.ok) {
    if (res.status === 404) return null // No identity found
    throw new Error('Failed to fetch identity')
  }

  return res.json()
}

export async function createIdentity(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.accessToken) throw new Error('Unauthorized')

  const res = await fetch(`${env.backendApiUrl}/identities`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: formData,
  })

  if (!res.ok) {
    const errorText = await res.text()
    console.error('Create identity failed:', res.status, errorText)
    throw new Error(`Failed to create identity: ${res.status} ${errorText}`)
  }

  return res.json()
}