import { listAdministrators } from '@/app/actions';
import AdminList from './ui/AdminList';

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
    const administrators = await listAdministrators({ search });

    console.log('Administrators list', administrators);
    return <div>

        <AdminList administrators={administrators} />
    </div>;
}
