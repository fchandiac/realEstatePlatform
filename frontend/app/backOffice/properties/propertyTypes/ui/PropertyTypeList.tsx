'use client';
import { useState, useEffect } from "react";
import IconButton from '@/components/IconButton/IconButton';
import { TextField } from '@/components/TextField/TextField';
import { useRouter, useSearchParams } from "next/navigation";
import PropertyTypeCard from "./PropertyTypeCard";
import type { PropertyType } from "./PropertyTypeCard";

export interface PropertyTypeListProps {
    propertyTypes: PropertyType[];
}

const defaultEmptyMessage = 'No hay tipos de propiedad para mostrar.';

const PropertyTypeList: React.FC<PropertyTypeListProps> = ({
    propertyTypes,
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

    const handleAddPropertyType = () => {
        // TODO: Implement add property type functionality
        console.log("Add property type clicked");
    };

    const handlePropertyTypeClick = (propertyType: PropertyType) => {
        // TODO: Implement property type click functionality
        console.log("Property type clicked:", propertyType);
    };

    const handleToggleFeature = (propertyTypeId: string, feature: keyof PropertyType, value: boolean) => {
        // TODO: Implement toggle feature functionality
        console.log("Toggle feature:", propertyTypeId, feature, value);
    };

    // Filter property types based on search
    const filteredPropertyTypes = propertyTypes.filter(propertyType =>
        propertyType.name.toLowerCase().includes(search.toLowerCase()) ||
        (propertyType.description && propertyType.description.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="w-full">
            {/* Primera fila: botón agregar y búsqueda */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <IconButton
                        aria-label="Agregar tipo de propiedad"
                        variant="containedPrimary"
                        onClick={handleAddPropertyType}
                        icon="add"
                    />
                </div>
                <div className="w-1/5">
                    <TextField
                        label="Buscar"
                        value={search}
                        onChange={handleSearchChange}
                        startIcon="search"
                        placeholder="Buscar tipos de propiedad..."
                    />
                </div>
            </div>

            {/* Segunda fila: lista de tarjetas */}
            <div className="space-y-3 w-full">
                {filteredPropertyTypes.length === 0 ? (
                    <div className="text-center py-8 text-secondary">
                        {search ? 'No se encontraron tipos de propiedad que coincidan con la búsqueda.' : defaultEmptyMessage}
                    </div>
                ) : (
                    filteredPropertyTypes.map(propertyType => (
                        <PropertyTypeCard
                            key={propertyType.id}
                            propertyType={propertyType}
                            onClick={() => handlePropertyTypeClick(propertyType)}
                            onToggleFeature={(feature, value) => handleToggleFeature(propertyType.id, feature, value)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default PropertyTypeList;
