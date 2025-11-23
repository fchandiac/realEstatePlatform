import React from 'react'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserGridNotifications } from '@/app/actions/notifications';
import NotificationsGrid from './ui/NotificationsGrid';

interface PageProps {
  searchParams: Promise<{
    sort?: 'asc' | 'desc';
    sortField?: string;
    search?: string;
    filters?: string;
    filtration?: string;
    page?: string;
    limit?: string;
  }>;
}

export default async function NotificationsPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <div className="p-4">
        <div className="text-center text-gray-500">
          Debes iniciar sesión para ver tus notificaciones
        </div>
      </div>
    );
  }

  const params = await searchParams;
  const sort = params.sort === 'asc' ? 'asc' : (params.sort === 'desc' ? 'desc' : undefined);
  const sortField = typeof params.sortField === 'string' ? params.sortField : undefined;
  const search = typeof params.search === 'string' ? params.search : '';
  const filters = typeof params.filters === 'string' ? params.filters : '';
  const filtration = params.filtration === 'true' || filters !== '';
  const pageParam = typeof params.page === 'string' ? params.page : '1';
  const limitParam = typeof params.limit === 'string' ? params.limit : '25';
  const page = parseInt(pageParam) || 1;
  const limit = parseInt(limitParam) || 25;

  try {
    const result = await getUserGridNotifications(userId, {
      sort,
      sortField,
      search,
      filters,
      filtration,
      page,
      limit,
      pagination: true
    });

    const rows = Array.isArray(result) ? result : result.data ?? [];
    const totalRows = Array.isArray(result) ? result.length : result.total ?? rows.length;

    return (
      <div className="p-4">
        <NotificationsGrid rows={rows} totalRows={totalRows} />
      </div>
    );
  } catch (error) {
    console.error('Error loading notifications:', error);

    // Show empty grid - don't show any error messages to avoid confusion
    return (
      <div className="p-4">
        <NotificationsGrid rows={[]} totalRows={0} />
      </div>
    );
  }
}
