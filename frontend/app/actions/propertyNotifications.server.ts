'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createNotification } from './notifications';

export async function notifyPropertyInterest({ propertyId, assignedAgentId, interestedUserId }: {
  propertyId: string;
  assignedAgentId?: string;
  interestedUserId?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    // Obtener sesión para determinar el usuario interesado
    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id || interestedUserId;

    // Preparar datos para la notificación
    const notificationData = {
      senderType: currentUserId ? 'USER' as const : 'ANONYMOUS' as const,
      senderId: currentUserId,
      senderName: currentUserId ? 'Usuario interesado' : 'Anónimo', // Podría obtener el nombre real del usuario
      isSystem: false,
      message: `Un usuario está interesado en la propiedad ${propertyId}.`,
      targetUserIds: [] as string[], // Se llenará con admins y agente
      type: 'INTEREST' as const,
    };

    // Obtener admins y agente asignado (esto debería hacerse en el backend, pero por simplicidad lo simulamos)
    // En una implementación real, el backend debería manejar esto
    const adminIds = ['admin-id-1', 'admin-id-2']; // Esto debería venir del backend
    notificationData.targetUserIds = [...adminIds];
    if (assignedAgentId) {
      notificationData.targetUserIds.push(assignedAgentId);
    }

    // Crear la notificación usando el action genérico
    const result = await createNotification(notificationData);
    return { success: result.success, error: result.error };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
