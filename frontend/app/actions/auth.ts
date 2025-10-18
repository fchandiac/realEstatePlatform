'use server';

import { cookies } from 'next/headers';
import { env } from '@/lib/env';

export type LogoutResult =
  | { success: true }
  | { success: false; error: string };

export async function logoutAction(accessToken?: string): Promise<LogoutResult> {
  const cookieStore = await cookies();
  const tokenFromCookie = cookieStore.get('access_token')?.value;
  const token = accessToken ?? tokenFromCookie;

  if (!token) {
    return { success: true };
  }

  try {
    await fetch(`${env.backendApiUrl}/auth/sign-out`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });
  } catch (error) {
    console.error('logoutAction backend error', error);
    return {
      success: false,
      error: 'No fue posible cerrar la sesión en el servidor',
    };
  }

  if (tokenFromCookie) {
    (cookieStore as unknown as {
      delete: (name: string, options?: Record<string, unknown>) => void;
    }).delete('access_token', { path: '/' });
  }

  return { success: true };
}
