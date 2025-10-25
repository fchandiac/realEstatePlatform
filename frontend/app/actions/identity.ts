'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { env } from '@/lib/env'

export async function getIdentity() {
  const session = await getServerSession(authOptions)
  if (!session?.accessToken) throw new Error('Unauthorized')

  const res = await fetch(`${env.backendApiUrl}/identities/last`, {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  })

  if (!res.ok) {
    if (res.status === 404) return null // No identity found
    throw new Error('Failed to fetch identity')
  }

  return res.json()
}

export async function updateIdentity(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.accessToken) throw new Error('Unauthorized')

  const res = await fetch(`${env.backendApiUrl}/identities`, {
    method: 'POST', // Assuming POST for create/update
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: formData,
  })

  if (!res.ok) throw new Error('Failed to update identity')
  return res.json()
}