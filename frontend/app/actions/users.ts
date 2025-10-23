'use server';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { env } from '@/lib/env';

export type ListAdministratorsParams = {
	search?: string;
};

export type BackendAdministrator = {
	id: string;
	username: string;
	email: string;
	status?: string;
	personalInfo?: {
		firstName?: string | null;
		lastName?: string | null;
		phone?: string | null;
		avatarUrl?: string | null;
	} | null;
};

export async function listAdministrators(
	params: ListAdministratorsParams = {},
): Promise<{
  success: boolean;
  data?: {
    data: BackendAdministrator[];
    total: number;
    page: number;
    limit: number;
  };
  error?: string;
}> {
	const session = await getServerSession(authOptions);
	const accessToken = session?.accessToken;

	if (!accessToken) {
		return { success: false, error: 'No hay una sesión activa para consultar administradores.' };
	}

	const url = new URL(`${env.backendApiUrl}/users/admins`);

	const normalizedSearch = params.search?.trim();
	if (normalizedSearch) {
		url.searchParams.set('search', normalizedSearch);
	}

	const response = await fetch(url.toString(), {
		headers: {
			Authorization: `Bearer ${accessToken}`,
			Accept: 'application/json',
		},
		cache: 'no-store',
	});

	if (!response.ok) {
		const payload = (await response.json().catch(() => null)) as
			| { message?: string }
			| null;

		return {
			success: false,
			error: payload?.message ?? `Error ${response.status} al obtener la lista de administradores`,
		};
	}

	const data = await response.json();
	return { success: true, data: { data, total: data.length, page: 1, limit: data.length } };
}

export async function listAdminsAgents(params: {
	search?: string;
	page?: number;
	limit?: number;
} = {}): Promise<{
  success: boolean;
  data?: {
    data: BackendAdministrator[];
    total: number;
    page: number;
    limit: number;
  };
  error?: string;
}> {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.accessToken) {
			return { success: false, error: 'No authenticated' };
		}

		const searchParams = new URLSearchParams();
		if (params.search) searchParams.set('search', params.search);
		if (params.page) searchParams.set('page', params.page.toString());
		if (params.limit) searchParams.set('limit', params.limit.toString());

		const url = `${env.backendApiUrl}/users/admins-agents?${searchParams.toString()}`;
		
		const response = await fetch(url, {
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
				error: errorData?.message || `HTTP ${response.status}` 
			};
		}

		const data = await response.json();
		return { success: true, data };
	} catch (error) {
		console.error('Error listing admins and agents:', error);
		return { 
			success: false, 
			error: error instanceof Error ? error.message : 'Unknown error' 
		};
	}
}

export async function listAgents(params: {
	search?: string;
	page?: number;
	limit?: number;
} = {}): Promise<{
  success: boolean;
  data?: {
    data: BackendAdministrator[];
    total: number;
    page: number;
    limit: number;
  };
  error?: string;
}> {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.accessToken) {
			return { success: false, error: 'No authenticated' };
		}

		const searchParams = new URLSearchParams();
		if (params.search) searchParams.set('search', params.search);
		if (params.page) searchParams.set('page', params.page.toString());
		if (params.limit) searchParams.set('limit', params.limit.toString());

		const url = `${env.backendApiUrl}/users/agents?${searchParams.toString()}`;
		
		const response = await fetch(url, {
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
				error: errorData?.message || `HTTP ${response.status}` 
			};
		}

		const data = await response.json();
		return { success: true, data };
	} catch (error) {
		console.error('Error listing agents:', error);
		return { 
			success: false, 
			error: error instanceof Error ? error.message : 'Unknown error' 
		};
	}
}

// ===================================
// CRUD Operations for Users
// ===================================

export interface CreateUserDto {
	username: string;
	email: string;
	password: string;
	role?: 'ADMIN' | 'AGENT';
	personalInfo?: {
		firstName?: string;
		lastName?: string;
		phone?: string;
		avatarUrl?: string;
	};
}

export interface UpdateUserDto {
	username?: string;
	email?: string;
	role?: 'ADMIN' | 'AGENT';
	status?: 'ACTIVE' | 'INACTIVE';
	personalInfo?: {
		firstName?: string;
		lastName?: string;
		phone?: string;
		avatarUrl?: string;
	};
}

export interface ChangePasswordDto {
	oldPassword: string;
	newPassword: string;
}

/**
 * Create a new user
 */
export async function createUser(data: CreateUserDto): Promise<{
  success: boolean;
  data?: BackendAdministrator;
  error?: string;
}> {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.accessToken) {
			return { success: false, error: 'No authenticated' };
		}

		const response = await fetch(`${env.backendApiUrl}/users`, {
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
				error: errorData?.message || `Failed to create user: ${response.status}` 
			};
		}

		const result = await response.json();
		return { success: true, data: result };
	} catch (error) {
		console.error('Error creating user:', error);
		return { 
			success: false, 
			error: error instanceof Error ? error.message : 'Unknown error' 
		};
	}
}

/**
 * Get a user by ID
 */
export async function getUser(id: string): Promise<{
  success: boolean;
  data?: BackendAdministrator;
  error?: string;
}> {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.accessToken) {
			return { success: false, error: 'No authenticated' };
		}

		const response = await fetch(`${env.backendApiUrl}/users/${id}`, {
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
				error: errorData?.message || `Failed to fetch user: ${response.status}` 
			};
		}

		const result = await response.json();
		return { success: true, data: result };
	} catch (error) {
		console.error('Error fetching user:', error);
		return { 
			success: false, 
			error: error instanceof Error ? error.message : 'Unknown error' 
		};
	}
}

/**
 * Update a user
 */
export async function updateUser(id: string, data: UpdateUserDto): Promise<{
  success: boolean;
  data?: BackendAdministrator;
  error?: string;
}> {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.accessToken) {
			return { success: false, error: 'No authenticated' };
		}

		const response = await fetch(`${env.backendApiUrl}/users/${id}`, {
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
				error: errorData?.message || `Failed to update user: ${response.status}` 
			};
		}

		const result = await response.json();
		return { success: true, data: result };
	} catch (error) {
		console.error('Error updating user:', error);
		return { 
			success: false, 
			error: error instanceof Error ? error.message : 'Unknown error' 
		};
	}
}

/**
 * Delete a user (soft delete)
 */
export async function deleteUser(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.accessToken) {
			return { success: false, error: 'No authenticated' };
		}

		const response = await fetch(`${env.backendApiUrl}/users/${id}`, {
			method: 'DELETE',
			headers: {
				'Authorization': `Bearer ${session.accessToken}`,
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => null);
			return { 
				success: false, 
				error: errorData?.message || `Failed to delete user: ${response.status}` 
			};
		}

		return { success: true };
	} catch (error) {
		console.error('Error deleting user:', error);
		return { 
			success: false, 
			error: error instanceof Error ? error.message : 'Unknown error' 
		};
	}
}

/**
 * Change user password
 */
export async function changeUserPassword(id: string, passwordData: ChangePasswordDto): Promise<{
  success: boolean;
  error?: string;
}> {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.accessToken) {
			return { success: false, error: 'No authenticated' };
		}

		const response = await fetch(`${env.backendApiUrl}/users/${id}/change-password`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${session.accessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(passwordData),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => null);
			return { 
				success: false, 
				error: errorData?.message || `Failed to change password: ${response.status}` 
			};
		}

		return { success: true };
	} catch (error) {
		console.error('Error changing password:', error);
		return { 
			success: false, 
			error: error instanceof Error ? error.message : 'Unknown error' 
		};
	}
}

/**
 * Assign role to user
 */
export async function assignUserRole(id: string, role: 'ADMIN' | 'AGENT'): Promise<{
  success: boolean;
  data?: BackendAdministrator;
  error?: string;
}> {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.accessToken) {
			return { success: false, error: 'No authenticated' };
		}

		const response = await fetch(`${env.backendApiUrl}/users/${id}/role`, {
			method: 'PATCH',
			headers: {
				'Authorization': `Bearer ${session.accessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ role }),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => null);
			return { 
				success: false, 
				error: errorData?.message || `Failed to assign role: ${response.status}` 
			};
		}

		const result = await response.json();
		return { success: true, data: result };
	} catch (error) {
		console.error('Error assigning role:', error);
		return { 
			success: false, 
			error: error instanceof Error ? error.message : 'Unknown error' 
		};
	}
}

/**
 * Set user status (active/inactive)
 */
export async function setUserStatus(id: string, status: 'ACTIVE' | 'INACTIVE'): Promise<{
  success: boolean;
  data?: BackendAdministrator;
  error?: string;
}> {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.accessToken) {
			return { success: false, error: 'No authenticated' };
		}

		const response = await fetch(`${env.backendApiUrl}/users/${id}/status`, {
			method: 'PATCH',
			headers: {
				'Authorization': `Bearer ${session.accessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ status }),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => null);
			return { 
				success: false, 
				error: errorData?.message || `Failed to set status: ${response.status}` 
			};
		}

		const result = await response.json();
		return { success: true, data: result };
	} catch (error) {
		console.error('Error setting status:', error);
		return { 
			success: false, 
			error: error instanceof Error ? error.message : 'Unknown error' 
		};
	}
}

