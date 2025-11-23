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