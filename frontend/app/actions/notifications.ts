'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { env } from '@/lib/env';

export interface CreateNotificationData {
  senderType: 'USER' | 'SYSTEM' | 'ANONYMOUS';
  senderId?: string;
  senderName: string;
  isSystem: boolean;
  message: string;
  targetUserIds: string[];
  type: 'INTEREST' | 'CONTACT' | 'PAYMENT_RECEIPT' | 'PAYMENT_OVERDUE' | 'PUBLICATION_STATUS_CHANGE' | 'CONTRACT_STATUS_CHANGE' | 'PROPERTY_AGENT_ASSIGNMENT';
  targetMails?: string[];
  multimediaId?: string;
}

export async function createNotification(data: CreateNotificationData): Promise<{ success: boolean; error?: string; notification?: any }> {
  try {
    // Obtener sesión para autenticación
    const session = await getServerSession(authOptions);
    const accessToken = session?.accessToken;

    const url = `${env.backendApiUrl}/notifications`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { success: false, error: errorData?.message || `HTTP ${response.status}` };
    }

    const notification = await response.json();
    return { success: true, notification };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Get all notifications for a specific user
 */
export async function getUserNotifications(userId: string): Promise<{ success: boolean; error?: string; notifications?: any[] }> {
  try {
    const session = await getServerSession(authOptions);
    const accessToken = session?.accessToken;

    if (!accessToken) {
      return { success: false, error: 'Unauthorized' };
    }

    const url = `${env.backendApiUrl}/notifications/user/${userId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { success: false, error: errorData?.message || `HTTP ${response.status}` };
    }

    const notifications = await response.json();
    return { success: true, notifications };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Mark all unread notifications as read for a user
 */
export async function markAllNotificationsAsRead(userId: string): Promise<{ success: boolean; error?: string; count?: number }> {
  try {
    const session = await getServerSession(authOptions);
    const accessToken = session?.accessToken;

    if (!accessToken) {
      return { success: false, error: 'Unauthorized' };
    }

    const url = `${env.backendApiUrl}/notifications/user/${userId}/read-all`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { success: false, error: errorData?.message || `HTTP ${response.status}` };
    }

    const count = await response.json();
    return { success: true, count };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Update notification status
 */
export async function updateNotificationStatus(notificationId: string, status: 'SEND' | 'OPEN'): Promise<{ success: boolean; error?: string; notification?: any }> {
  try {
    const session = await getServerSession(authOptions);
    const accessToken = session?.accessToken;

    if (!accessToken) {
      return { success: false, error: 'Unauthorized' };
    }

    const url = `${env.backendApiUrl}/notifications/${notificationId}/status`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { success: false, error: errorData?.message || `HTTP ${response.status}` };
    }

    const notification = await response.json();
    return { success: true, notification };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}