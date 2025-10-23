'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { env } from '@/lib/env'

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  userId: string
  createdAt: string
  updatedAt: string
}

export interface CreateNotificationDto {
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  userId?: string
}

export interface NotificationSettings {
  id: string
  userId: string
  emailNotifications: boolean
  pushNotifications: boolean
  smsNotifications: boolean
  notifyOnPropertyUpdates: boolean
  notifyOnNewInquiries: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Obtiene las notificaciones del usuario actual
 */
export async function getUserNotifications(): Promise<Notification[]> {
  const session = await getServerSession(authOptions)
  
  if (!session?.accessToken) {
    throw new Error('No authenticated')
  }

  try {
    const response = await fetch(`${env.backendApiUrl}/notifications`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch notifications: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error('Error fetching notifications:', error)
    throw error
  }
}

/**
 * Marca una notificación como leída
 */
export async function markNotificationAsRead(id: string): Promise<void> {
  const session = await getServerSession(authOptions)
  
  if (!session?.accessToken) {
    throw new Error('No authenticated')
  }

  try {
    const response = await fetch(`${env.backendApiUrl}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Failed to mark notification as read: ${response.status}`)
    }
  } catch (error) {
    console.error('Error marking notification as read:', error)
    throw error
  }
}

/**
 * Marca todas las notificaciones como leídas
 */
export async function markAllNotificationsAsRead(): Promise<void> {
  const session = await getServerSession(authOptions)
  
  if (!session?.accessToken) {
    throw new Error('No authenticated')
  }

  try {
    const response = await fetch(`${env.backendApiUrl}/notifications/read-all`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Failed to mark all notifications as read: ${response.status}`)
    }
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    throw error
  }
}

/**
 * Envía una notificación a un usuario específico (admin only)
 */
export async function sendNotification(data: CreateNotificationDto): Promise<Notification> {
  const session = await getServerSession(authOptions)
  
  if (!session?.accessToken) {
    throw new Error('No authenticated')
  }

  try {
    const response = await fetch(`${env.backendApiUrl}/notifications`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Failed to send notification: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error('Error sending notification:', error)
    throw error
  }
}

/**
 * Obtiene la configuración de notificaciones del usuario actual
 */
export async function getNotificationSettings(): Promise<NotificationSettings> {
  const session = await getServerSession(authOptions)
  
  if (!session?.accessToken) {
    throw new Error('No authenticated')
  }

  try {
    const response = await fetch(`${env.backendApiUrl}/notifications/settings`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch notification settings: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error('Error fetching notification settings:', error)
    throw error
  }
}

/**
 * Actualiza la configuración de notificaciones del usuario actual
 */
export async function updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<NotificationSettings> {
  const session = await getServerSession(authOptions)
  
  if (!session?.accessToken) {
    throw new Error('No authenticated')
  }

  try {
    const response = await fetch(`${env.backendApiUrl}/notifications/settings`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Failed to update notification settings: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error('Error updating notification settings:', error)
    throw error
  }
}

/**
 * Elimina una notificación
 */
export async function deleteNotification(id: string): Promise<void> {
  const session = await getServerSession(authOptions)
  
  if (!session?.accessToken) {
    throw new Error('No authenticated')
  }

  try {
    const response = await fetch(`${env.backendApiUrl}/notifications/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Failed to delete notification: ${response.status}`)
    }
  } catch (error) {
    console.error('Error deleting notification:', error)
    throw error
  }
}

/**
 * Obtiene el conteo de notificaciones no leídas
 */
export async function getUnreadNotificationsCount(): Promise<{ count: number }> {
  const session = await getServerSession(authOptions)
  
  if (!session?.accessToken) {
    throw new Error('No authenticated')
  }

  try {
    const response = await fetch(`${env.backendApiUrl}/notifications/unread-count`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch unread notifications count: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error('Error fetching unread notifications count:', error)
    throw error
  }
}