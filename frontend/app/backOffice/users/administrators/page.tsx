import { listAdministrators } from '@/app/actions';
import AdminList from './ui/AdminList';
import type { AdministratorType, AdministratorStatus } from './ui/types';

type AdministratorsPageSearchParams = {
    search?: string | string[];
};

export default async function AdministratorsPage({
    searchParams,
}: {
    searchParams?: Promise<AdministratorsPageSearchParams>;
}) {
    const params = searchParams ? await searchParams : undefined;

    const search = typeof params?.search === 'string' ? params.search : Array.isArray(params?.search) ? (params?.search[0] || '') : '';
    const response = await listAdministrators({ search });

    if (!response.success || !response.data) {
        return <div>Error al cargar la lista de administradores.</div>;
    }

    const administrators = response.data.data.map(admin => {
        const validStatuses: AdministratorStatus[] = ['ACTIVE', 'INVITED', 'INACTIVE', 'SUSPENDED'];
        const status: AdministratorStatus = validStatuses.includes(admin.status as AdministratorStatus)
            ? (admin.status as AdministratorStatus)
            : 'INACTIVE';

        return {
            id: admin.id,
            username: admin.username,
            email: admin.email,
            status,
            role: 'Administrator', // Valor predeterminado
            permissions: [], // Valor predeterminado
            personalInfo: {
                phone: admin.personalInfo?.phone || '',
                lastName: admin.personalInfo?.lastName || '',
                avatarUrl: admin.personalInfo?.avatarUrl || null,
                firstName: admin.personalInfo?.firstName || '',
            },
            createdAt: new Date().toISOString(), // Valor predeterminado
            updatedAt: new Date().toISOString(), // Valor predeterminado
            deletedAt: null, // Valor predeterminado
            lastLogin: new Date().toISOString(), // Valor predeterminado
        };
    });

    return (
        <div>
            <AdminList administrators={administrators} />
        </div>
    );
}
