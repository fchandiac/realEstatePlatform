'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StepperBaseForm, { StepperStep, BaseFormField } from '@/components/BaseForm/StepperBaseForm';
import { listPropertyTypes, getPropertyTypeCharacteristics, PropertyTypeWithFeatures, publishProperty } from '@/app/actions/properties';
import { getRegiones, getComunasByRegion } from '@/app/actions/commons';
import Alert from '@/components/Alert/Alert';
import PropertyCard, { PortalProperty } from '@/app/portal/ui/PropertyCard';

type FormValues = Record<string, unknown>;

const INITIAL_VALUES: FormValues = {
  title: '',
  propertyTypeId: null,
  builtSquareMeters: 0,
  landSquareMeters: 0,
  bedrooms: 0,
  bathrooms: 0,
  parkingSpaces: 0,
  floors: 0,
  constructionYear: new Date().getFullYear(),
  price: '',
  currencyPrice: 'CLP',
  region: null,
  city: null,
  address: '',
  coordinates: null,
  multimedia: [],
  contactName: '',
  contactPhone: '',
  contactEmail: '',
};

export default function PublishPropertyPage() {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const router = useRouter();
  const [propertyTypes, setPropertyTypes] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedPropertyType, setSelectedPropertyType] = useState<PropertyTypeWithFeatures | null>(null);
  const [regions, setRegions] = useState<Array<{ id: string; label: string }>>([]);
  const [comunas, setComunas] = useState<Array<{ id: string; label: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [loadingCharacteristics, setLoadingCharacteristics] = useState(false);

  // Load property types and regions on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [typesResult, regionsResult] = await Promise.all([
          listPropertyTypes(),
          getRegiones(),
        ]);

        if (typesResult.success && typesResult.data) {
          setPropertyTypes(
            typesResult.data.map(pt => ({ id: pt.id, label: pt.name }))
          );
        }

        setRegions(regionsResult);
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    loadInitialData();
  }, []);

  // Load property type characteristics when propertyTypeId changes
  useEffect(() => {
    if (values.propertyTypeId) {
      const loadCharacteristics = async () => {
        setLoadingCharacteristics(true);
        try {
          const result = await getPropertyTypeCharacteristics(values.propertyTypeId as string);
          if (result.success && result.data) {
            setSelectedPropertyType(result.data);
          }
        } catch (error) {
          console.error('Error loading property type characteristics:', error);
        } finally {
          setLoadingCharacteristics(false);
        }
      };

      loadCharacteristics();
    } else {
      setSelectedPropertyType(null);
    }
  }, [values.propertyTypeId]);

  // Load comunas when region changes
  useEffect(() => {
    if (values.region) {
      const loadComunas = async () => {
        try {
          const result = await getComunasByRegion(values.region as string);
          setComunas(result);
        } catch (error) {
          console.error('Error loading comunas:', error);
        }
      };

      loadComunas();
    }
  }, [values.region]);

  const handleChange = (field: string, value: unknown) => {
    // Si es un campo numérico y el valor es un string, convertir a número
    let finalValue = value;
    if (field.match(/^(builtSquareMeters|landSquareMeters|bedrooms|bathrooms|parkingSpaces|floors|constructionYear)$/)) {
      if (typeof value === 'string') {
        finalValue = value === '' ? 0 : parseInt(value, 10);
      }
    }
    setValues((prev: FormValues) => ({ ...prev, [field]: finalValue }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setErrors([]);

      // Validación final
      if (!values.title || !values.propertyTypeId) {
        setErrors(['Por favor completa la información básica']);
        return;
      }

      if (!values.region || !values.city || !values.address) {
        setErrors(['Por favor completa la ubicación']);
        return;
      }

      const multimedia = values.multimedia as File[];
      if (multimedia.length === 0) {
        setErrors(['Por favor carga al menos una imagen']);
        return;
      }

      if (!values.contactName || !values.contactPhone || !values.contactEmail) {
        setErrors(['Por favor completa tus datos de contacto']);
        return;
      }

      // Llamar server action para publicar
      console.log('📤 [handleSubmit] Publicando propiedad...');
      const result = await publishProperty({
        title: values.title as string,
        propertyTypeId: values.propertyTypeId as string,
        operationType: 'SALE', // o RENT según sea necesario
        builtSquareMeters: values.builtSquareMeters as number,
        landSquareMeters: values.landSquareMeters as number,
        bedrooms: values.bedrooms as number,
        bathrooms: values.bathrooms as number,
        parkingSpaces: values.parkingSpaces as number,
        floors: values.floors as number,
        constructionYear: values.constructionYear as number,
        price: values.price as string,
        currencyPrice: values.currencyPrice as string,
        region: values.region as string,
        city: values.city as string,
        address: values.address as string,
        contactName: values.contactName as string,
        contactPhone: values.contactPhone as string,
        contactEmail: values.contactEmail as string,
        multimediaFiles: multimedia,
      });

      if (!result.success) {
        console.error('❌ Error:', result.error);
        setErrors([result.error || 'Error al publicar la propiedad']);
        return;
      }

      // Éxito: mostrar mensaje y redirigir
      console.log('✅ Propiedad publicada:', result.data.id);
      
      // Redirigir a página de éxito
      router.push('/portal/success?propertyId=' + result.data.id);
    } catch (error) {
      console.error('Error publishing property:', error);
      setErrors(['Error al publicar la propiedad']);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Build step 1 fields based on selected property type characteristics
  const buildStep1Fields = (): BaseFormField[][] => {
    const rows: BaseFormField[][] = [
      [
        {
          name: 'title',
          label: 'Título de la propiedad',
          type: 'text',
          required: true,
          props: { placeholder: 'Título de la propiedad' }
        }
      ],
      [
        {
          name: 'propertyTypeId',
          label: 'Tipo de propiedad',
          type: 'select',
          options: propertyTypes,
          required: true,
          props: { placeholder: 'Selecciona el tipo' }
        }
      ],
    ];

    // Add characteristics only if property type is selected
    if (selectedPropertyType && !loadingCharacteristics) {
      if (selectedPropertyType.hasBuiltSquareMeters) {
        rows.push([{
          name: 'builtSquareMeters',
          label: 'M² construidos',
          type: 'number',
          props: { placeholder: '0' }
        }]);
      }

      if (selectedPropertyType.hasLandSquareMeters) {
        rows.push([{
          name: 'landSquareMeters',
          label: 'M² terreno',
          type: 'number',
          props: { placeholder: '0' }
        }]);
      }

      if (selectedPropertyType.hasBedrooms) {
        rows.push([{
          name: 'bedrooms',
          label: 'Habitaciones',
          type: 'number',
          props: { placeholder: '0' }
        }]);
      }

      if (selectedPropertyType.hasBathrooms) {
        rows.push([{
          name: 'bathrooms',
          label: 'Baños',
          type: 'number',
          props: { placeholder: '0' }
        }]);
      }

      if (selectedPropertyType.hasParkingSpaces) {
        rows.push([{
          name: 'parkingSpaces',
          label: 'Estacionamientos',
          type: 'number',
          props: { placeholder: '0' }
        }]);
      }

      if (selectedPropertyType.hasFloors) {
        rows.push([{
          name: 'floors',
          label: 'Pisos',
          type: 'number',
          props: { placeholder: '0' }
        }]);
      }

      if (selectedPropertyType.hasConstructionYear) {
        rows.push([{
          name: 'constructionYear',
          label: 'Año de construcción',
          type: 'number',
          props: { placeholder: new Date().getFullYear().toString() }
        }]);
      }
    }

    // Add price and currency in the same row
    rows.push([
      {
        name: 'price',
        label: 'Precio',
        type: 'currency',
        required: true,
        props: {
          currencyField: 'currencyPrice',
          placeholder: '1.500.000'
        }
      },
      {
        name: 'currencyPrice',
        label: 'Moneda',
        type: 'select',
        options: [
          { id: 'CLP', label: 'CLP (Pesos)' },
          { id: 'UF', label: 'UF' }
        ],
        required: true
      }
    ]);

    return rows;
  };

  const step1Fields = buildStep1Fields();

  const step2Fields: BaseFormField[] = [
    {
      name: 'region',
      label: 'Región',
      type: 'select',
      options: regions,
      required: true,
      props: { placeholder: 'Selecciona la región' }
    },
    {
      name: 'city',
      label: 'Comuna',
      type: 'autocomplete',
      options: comunas,
      required: true,
      props: { placeholder: 'Busca la comuna' }
    },
    {
      name: 'address',
      label: 'Dirección',
      type: 'textarea',
      required: true,
      multiline: true,
      rows: 2,
      props: { placeholder: 'Avenida Providencia 1234, Depto 502' }
    },
    {
      name: 'coordinates',
      label: 'Ubicación en mapa',
      type: 'location',
    }
  ];

  const step3Fields: BaseFormField[] = [
    {
      name: 'multimedia',
      label: 'Imágenes de la propiedad',
      type: 'multimedia',
      props: {
        uploadPath: '/properties/multimedia',
        maxFiles: 3,
        maxSize: 10,
        accept: 'image/*',
      }
    }
  ];

  const step4Fields: BaseFormField[] = [
    {
      name: 'contactName',
      label: 'Nombre completo',
      type: 'text',
      required: true,
      props: { placeholder: 'Tu nombre' }
    },
    {
      name: 'contactPhone',
      label: 'Teléfono',
      type: 'text',
      required: true,
      props: { placeholder: '+56 9 1234 5678' }
    },
    {
      name: 'contactEmail',
      label: 'Correo electrónico',
      type: 'email',
      required: true,
      props: { placeholder: 'tu@email.com' }
    }
  ];

  const steps: StepperStep[] = [
    {
      title: 'Información básica',
      description: 'Proporciona los detalles principales de tu propiedad',
      fields: step1Fields,
    },
    {
      title: 'Ubicación',
      description: 'Dónde está ubicada tu propiedad',
      fields: step2Fields,
    },
    {
      title: 'Multimedia',
      description: 'Carga imágenes de tu propiedad (máximo 3)',
      fields: step3Fields,
    },
    {
      title: 'Datos de contacto',
      description: 'Cómo pueden contactarte los interesados',
      fields: step4Fields,
    },
    {
      title: 'Resumen',
      description: 'Revisa la información antes de publicar',
      renderContent: (context) => {
        // Crear el objeto property para PropertyCard
        const propertyData: PortalProperty = {
          id: 'preview', // ID temporal para preview
          title: values.title as string || 'Sin título',
          operationType: 'SALE',
          price: parseFloat((values.price as string || '0').replace(/\./g, '').replace(/,/g, '')) || 0,
          currencyPrice: (values.currencyPrice as string || 'CLP') as 'CLP' | 'UF',
          state: regions.find(r => r.id === values.region)?.label || '',
          city: comunas.find(c => c.id === values.city)?.label || '',
          propertyType: selectedPropertyType ? {
            id: selectedPropertyType.id,
            name: selectedPropertyType.name
          } : undefined,
          bedrooms: values.bedrooms as number || null,
          bathrooms: values.bathrooms as number || null,
          builtSquareMeters: values.builtSquareMeters as number || null,
          landSquareMeters: values.landSquareMeters as number || null,
          parkingSpaces: values.parkingSpaces as number || null,
          multimedia: (values.multimedia as File[])?.map((file, index) => ({
            id: `temp-${index}`,
            url: URL.createObjectURL(file),
            type: 'PROPERTY_IMG',
            format: 'IMG'
          })) || []
        };

        return (
          <div className="space-y-4">
            <Alert variant="info">
              Revisa la información de tu propiedad antes de publicarla. Si todo está correcto, haz clic en "Publicar propiedad".
            </Alert>

            {/* Tarjeta de propiedad */}
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <PropertyCard
                  property={propertyData}
                  onClick={() => {}} // No hacer nada en preview
                />
              </div>
            </div>

            {/* Dirección aparte */}
            <div className="bg-white p-3 rounded-lg border">
              <h5 className="text-base font-semibold mb-1">Dirección</h5>
              <p className="text-gray-700 text-sm">{values.address as string || 'No especificada'}</p>
            </div>

            {/* Otros datos adicionales - solo mostrar si hay elementos */}
            {((selectedPropertyType?.hasConstructionYear && (values.constructionYear as number) > 0) ||
              (selectedPropertyType?.hasFloors && (values.floors as number) > 0)) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedPropertyType?.hasConstructionYear && (values.constructionYear as number) > 0 && (
                  <div className="bg-white p-3 rounded-lg border">
                    <h5 className="text-base font-semibold mb-1">Año de construcción</h5>
                    <p className="text-gray-700 text-sm">{values.constructionYear as number}</p>
                  </div>
                )}

                {selectedPropertyType?.hasFloors && (values.floors as number) > 0 && (
                  <div className="bg-white p-3 rounded-lg border">
                    <h5 className="text-base font-semibold mb-1">Número de pisos</h5>
                    <p className="text-gray-700 text-sm">{values.floors as number}</p>
                  </div>
                )}
              </div>
            )}

            {/* Datos de contacto */}
            <div className="bg-white p-3 rounded-lg border">
              <h5 className="text-base font-semibold mb-1">Datos de contacto</h5>
              <div className="space-y-1">
                <p className="text-gray-700 text-sm"><strong>Nombre:</strong> {values.contactName as string || 'No especificado'}</p>
                <p className="text-gray-700 text-sm"><strong>Teléfono:</strong> {values.contactPhone as string || 'No especificado'}</p>
                <p className="text-gray-700 text-sm"><strong>Email:</strong> {values.contactEmail as string || 'No especificado'}</p>
              </div>
            </div>
          </div>
        );
      }
    }
  ];

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <StepperBaseForm
          title="Publica tu propiedad"
          subtitle="Completa los 5 pasos para publicar tu propiedad y encontrar compradores"
          steps={steps}
          values={values}
          onChange={handleChange}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel="Publicar propiedad"
          errors={errors}
          columns={2}
        />
      </div>
    </div>
  );
}
