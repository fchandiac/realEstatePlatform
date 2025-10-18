'use client';
import { useState, useEffect } from "react";
import IconButton from '@/components/IconButton/IconButton';
import type { AdministratorType } from './types';
import { TextField } from '@/components/TextField/TextField';
import { useRouter, useSearchParams } from "next/navigation";
import AdminCard from "./AdminCard";

export interface AdminListProps {
    administrators: AdministratorType[];
}

const defaultEmptyMessage = 'No hay administradores para mostrar.';

type AdminItem = AdministratorType & {
    username?: string;
    personalInfo?: {
        firstName?: string | null;
        lastName?: string | null;
    } | null;
};

const getDisplayName = (admin: AdminItem): string => {

    const firstName = admin.personalInfo?.firstName?.trim() ?? '';
    const lastName = admin.personalInfo?.lastName?.trim() ?? '';
    const combined = `${firstName} ${lastName}`.trim();

    if (combined) {
        return combined;
    }

    if (admin.username) {
        return admin.username;
    }

    return admin.email;
};

const AdminList: React.FC<AdminListProps> = ({
    administrators,
}) => {
     const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("search") || "");
   
    useEffect(() => {
        setSearch(searchParams.get("search") || "");
    }, [searchParams]);

     const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setSearch(value);
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    router.replace(`?${params.toString()}`);
  };


    return (
        <>



            <div className="w-full">
                {/* Primera fila: botón agregar y búsqueda */}
                <div className="flex items-center justify-between mb-4 gap-2">
                    <div>
                        <IconButton
                            aria-label="Agregar tienda"
                            variant="containedPrimary"
                            //   onClick={() => setOpenCreateDialog(true)}
                            icon="add"
                        />
                    </div>
                    <div className="flex-1 flex justify-end">
                        <TextField
                            label="Buscar"
                            value={search}
                            onChange={handleSearchChange}
                            startIcon="search"
                            placeholder="Buscar..." 
                            />
                    </div>
                </div>
                {/* Segunda fila: grid de tarjetas con ancho estable */}
                <div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
                >
                    {administrators.map(admin => (
                        <AdminCard key={admin.id} admin={admin} />
                    ))}
                </div>
            </div>



        </>

    );
};

export default AdminList;
