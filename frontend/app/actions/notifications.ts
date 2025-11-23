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

export type GridSort = 'asc' | 'desc';

export interface UserGridNotificationsParams {
  fields?: string; // comma-separated list of fields
  sort?: GridSort;
  sortField?: string;
  search?: string;
  filtration?: boolean;
  filters?: string; // e.g. "type-INTEREST,status-SEND"
  pagination?: boolean;
  page?: number;
  limit?: number;
}

export interface UserNotificationGridRow {
  id: string;
  message?: string;
  type?: string;
  status?: string;
  senderName?: string;
  senderType?: string;
  isSystem?: boolean;
  createdAt?: string;
  updatedAt?: string;
  // allow additional fields without strict typing
  [key: string]: any;
}

export type UserGridNotificationsResponse =
  | UserNotificationGridRow[]
  | { data: UserNotificationGridRow[]; total: number; page: number; limit: number; totalPages: number };

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
 * Get user notifications grid with filtering, sorting, and pagination
 */
export async function getUserGridNotifications(
  userId: string,
  params: UserGridNotificationsParams = {}
): Promise<UserGridNotificationsResponse> {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;

  if (!accessToken) {
    throw new Error('No hay una sesión activa para consultar notificaciones.');
  }

  console.log('[DEBUG] getUserGridNotifications - params.filters received:', params.filters);
  console.log('[DEBUG] getUserGridNotifications - params.filtration:', params.filtration);

  const url = new URL(`${env.backendApiUrl}/notifications/user/${userId}/grid`);

  // map boolean flags to 'true'|'false' strings
  const setBoolParam = (key: string, value?: boolean) => {
    if (typeof value === 'boolean') url.searchParams.set(key, value ? 'true' : 'false');
  };

  // attach params
  if (params.fields) url.searchParams.set('fields', params.fields);
  if (params.sort) url.searchParams.set('sort', params.sort);
  if (params.sortField) url.searchParams.set('sortField', params.sortField);
  if (typeof params.search === 'string') url.searchParams.set('search', params.search);
  if (typeof params.filters === 'string') url.searchParams.set('filters', params.filters);
  setBoolParam('filtration', params.filtration);
  setBoolParam('pagination', params.pagination);
  if (typeof params.page === 'number') url.searchParams.set('page', String(params.page));
  if (typeof params.limit === 'number') url.searchParams.set('limit', String(params.limit));

  console.log('[DEBUG] getUserGridNotifications - Final URL sent to backend:', url.toString());

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  console.log('[DEBUG] getUserGridNotifications - Response status:', response.status);

  if (!response.ok) {
    let message = `Error ${response.status} al obtener notificaciones del usuario`;
    try {
      const payload = await response.json();
      if (payload?.message) {
        message = payload.message;
      }
    } catch {}
    throw new Error(message);
  }

  const result = await response.json();
  console.log('[DEBUG] getUserGridNotifications - Response data length:', Array.isArray(result) ? result.length : 'Not an array');
  return result as UserGridNotificationsResponse;
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