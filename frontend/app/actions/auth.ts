'use server';

import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { env } from '@/lib/env';

// ===================================
// Auth Types and Interfaces
// ===================================

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  username: string;
  email: string;
  password: string;
  personalInfo?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'AGENT';
  status: 'ACTIVE' | 'INACTIVE';
  personalInfo?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatarUrl?: string;
  };
}

export interface AuthResponse {
  access_token: string;
  user: AuthUser;
  expires_in: number;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export type LogoutResult =
  | { success: true }
  | { success: false; error: string };

// ===================================
// Existing Logout Function
// ===================================

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

// ===================================
// Additional Auth Server Actions
// ===================================

/**
 * Sign in with email and password
 * Note: This is typically handled by NextAuth, but included for completeness
 */
export async function signIn(credentials: SignInCredentials): Promise<{
  success: boolean;
  data?: AuthResponse;
  error?: string;
}> {
  try {
    const response = await fetch(`${env.backendApiUrl}/auth/sign-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { 
        success: false, 
        error: errorData?.message || `Authentication failed: ${response.status}` 
      };
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Error signing in:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Sign up a new user
 */
export async function signUp(data: SignUpData): Promise<{
  success: boolean;
  data?: AuthUser;
  error?: string;
}> {
  try {
    const response = await fetch(`${env.backendApiUrl}/auth/sign-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { 
        success: false, 
        error: errorData?.message || `Sign up failed: ${response.status}` 
      };
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Error signing up:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Request password reset
 */
export async function requestPasswordReset(data: PasswordResetRequest): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const response = await fetch(`${env.backendApiUrl}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { 
        success: false, 
        error: errorData?.message || `Password reset request failed: ${response.status}` 
      };
    }

    const result = await response.json();
    return { success: true, message: result.message || 'Password reset email sent' };
  } catch (error) {
    console.error('Error requesting password reset:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Reset password with token
 */
export async function resetPassword(data: PasswordReset): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const response = await fetch(`${env.backendApiUrl}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { 
        success: false, 
        error: errorData?.message || `Password reset failed: ${response.status}` 
      };
    }

    const result = await response.json();
    return { success: true, message: result.message || 'Password reset successfully' };
  } catch (error) {
    console.error('Error resetting password:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Change current user's password (authenticated)
 */
export async function changeCurrentUserPassword(data: ChangePasswordRequest): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return { success: false, error: 'No authenticated' };
    }

    const response = await fetch(`${env.backendApiUrl}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { 
        success: false, 
        error: errorData?.message || `Password change failed: ${response.status}` 
      };
    }

    const result = await response.json();
    return { success: true, message: result.message || 'Password changed successfully' };
  } catch (error) {
    console.error('Error changing password:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Get current user profile
 */
export async function getCurrentUser(): Promise<{
  success: boolean;
  data?: AuthUser;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return { success: false, error: 'No authenticated' };
    }

    const response = await fetch(`${env.backendApiUrl}/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { 
        success: false, 
        error: errorData?.message || `Failed to fetch profile: ${response.status}` 
      };
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Error fetching current user:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Update current user profile
 */
export async function updateCurrentUserProfile(data: {
  username?: string;
  email?: string;
  personalInfo?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatarUrl?: string;
  };
}): Promise<{
  success: boolean;
  data?: AuthUser;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return { success: false, error: 'No authenticated' };
    }

    const response = await fetch(`${env.backendApiUrl}/auth/profile`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { 
        success: false, 
        error: errorData?.message || `Failed to update profile: ${response.status}` 
      };
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Refresh access token
 */
export async function refreshAccessToken(): Promise<{
  success: boolean;
  data?: { access_token: string; expires_in: number };
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return { success: false, error: 'No authenticated' };
    }

    const response = await fetch(`${env.backendApiUrl}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { 
        success: false, 
        error: errorData?.message || `Token refresh failed: ${response.status}` 
      };
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Error refreshing token:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Validate token
 */
export async function validateToken(token: string): Promise<{
  success: boolean;
  data?: { valid: boolean; user?: AuthUser };
  error?: string;
}> {
  try {
    const response = await fetch(`${env.backendApiUrl}/auth/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { 
        success: false, 
        error: errorData?.message || `Token validation failed: ${response.status}` 
      };
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Error validating token:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
