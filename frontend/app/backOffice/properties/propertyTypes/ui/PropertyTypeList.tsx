'use client';
import { useState, useEffect } from "react";
import IconButton from '@/components/IconButton/IconButton';
import { TextField } from '@/components/TextField/TextField';
import { useRouter, useSearchParams } from "next/navigation";
import PropertyTypeCard from "./PropertyTypeCard";
import type { PropertyType } from "./PropertyTypeCard";
import { updatePropertyTypeFeatures } from '@/app/actions/propertyTypes';
import { useAlert } from '@/app/contexts/AlertContext';
import CreatePropertyTypeForm from './CreatePropertyTypeForm';

export interface PropertyTypeListProps {
    propertyTypes: PropertyType[];
}

const defaultEmptyMessage = 'No hay tipos de propiedad para mostrar.';

const PropertyTypeList: React.FC<PropertyTypeListProps> = ({
    propertyTypes: initialPropertyTypes,
}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>(initialPropertyTypes);
    const alert = useAlert();
    const [showCreateForm, setShowCreateForm] = useState(false);

    const getFeatureDisplayName = (feature: keyof PropertyType): string => {
        const featureNames: Record<string, string> = {
            hasBedrooms: 'Dormitorios',
            hasBathrooms: 'Baños',
            hasBuiltSquareMeters: 'M² Construidos',
            hasLandSquareMeters: 'M² Terreno',
            hasParkingSpaces: 'Estacionamientos',
            hasFloors: 'Pisos',
            hasConstructionYear: 'Año Construcción',
        };
        return featureNames[feature as string] || feature as string;
    };

    useEffect(() => {
        setSearch(searchParams.get("search") || "");
    }, [searchParams]);

    useEffect(() => {
        setPropertyTypes(initialPropertyTypes);
    }, [initialPropertyTypes]);

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
        setShowCreateForm(true);
    };

    const handleCreateSuccess = () => {
        setShowCreateForm(false);
        // Refresh the property types list
        window.location.reload();
    };

    const handleCreateCancel = () => {
        setShowCreateForm(false);
    };

    const handlePropertyTypeClick = (propertyType: PropertyType) => {
        // TODO: Implement property type click functionality
        console.log("Property type clicked:", propertyType);
    };

    const handleToggleFeature = async (propertyTypeId: string, feature: keyof PropertyType, value: boolean) => {
        try {
            // Create the update object with only the feature being changed
            const updateData = { [feature]: value };
            await updatePropertyTypeFeatures(propertyTypeId, updateData);
            
            // Update local state optimistically
            setPropertyTypes(prevTypes => 
                prevTypes.map(type => 
                    type.id === propertyTypeId 
                        ? { ...type, [feature]: value }
                        : type
                )
            );

            // Show success alert
            const featureName = getFeatureDisplayName(feature);
            alert.success(`Característica "${featureName}" ${value ? 'activada' : 'desactivada'} exitosamente`);
        } catch (err) {
            console.error('Error updating property type feature:', err);
            // Show error alert
            alert.error('Error al actualizar la característica. Por favor, inténtalo de nuevo.');
        }
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

            {/* Formulario de creación */}
            {showCreateForm && (
                <div className="mb-6">
                    <CreatePropertyTypeForm
                        onSuccess={handleCreateSuccess}
                        onCancel={handleCreateCancel}
                    />
                </div>
            )}

            {/* Grid de tarjetas: 3 por fila */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full items-stretch">
                {filteredPropertyTypes.length === 0 ? (
                    <div className="col-span-full text-center py-8 text-secondary">
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
