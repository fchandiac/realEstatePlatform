'use server';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
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
): Promise<BackendAdministrator[]> {
	const session = await getServerSession(authOptions);
	const accessToken = session?.accessToken;

	if (!accessToken) {
		throw new Error('No hay una sesión activa para consultar administradores.');
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

		throw new Error(
			payload?.message ??
				`Error ${response.status} al obtener la lista de administradores`,
		);
	}

	return (await response.json()) as BackendAdministrator[];
}

