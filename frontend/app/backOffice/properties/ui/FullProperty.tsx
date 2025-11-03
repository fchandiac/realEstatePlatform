"use client";

import { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment/locale/es'; // Para español
import { TextField } from '@/components/TextField/TextField';
import Select from '@/components/Select/Select';
import MultimediaGallery from '@/components/FileUploader/MultimediaGallery';
import { Button } from '@/components/Button/Button';
import IconButton from '@/components/IconButton/IconButton';
import CircularProgress from '@/components/CircularProgress/CircularProgress';
import { listPropertyTypes, getProperty, updateProperty } from '@/app/actions/properties';
import { listAdminsAgents } from '@/app/actions/users';
import { useAlert } from '@/app/contexts/AlertContext';
import { PropertyStatus, PropertyOperationType } from '../enums';

// Crear arrays de opciones basados en los enums
const PROPERTY_STATUSES = [
  { value: PropertyStatus.REQUEST, label: 'Solicitud' },
  { value: PropertyStatus.PRE_APPROVED, label: 'Pre-aprobado' },
  { value: PropertyStatus.PUBLISHED, label: 'Publicado' },
  { value: PropertyStatus.INACTIVE, label: 'Inactivo' },
  { value: PropertyStatus.SOLD, label: 'Vendido' },
  { value: PropertyStatus.RENTED, label: 'Arrendado' },
  { value: PropertyStatus.CONTRACT_IN_PROGRESS, label: 'Contrato en Progreso' }
];

const OPERATION_TYPES = [
  { value: PropertyOperationType.SALE, label: 'Venta' },
  { value: PropertyOperationType.RENT, label: 'Arriendo' }
];

// Interfaces para tipos locales
interface PropertyType {
  id: string;
  name: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  role?: string;
  personalInfo?: {
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
    avatarUrl?: string | null;
  } | null;
}

// Datos estáticos para status y tipos de operación
// Los enums se importan desde '../enums' y se convierten a arrays arriba

// Mock data basado en el objeto JSON proporcionado
const mockProperty = {
  id: "42ad2e61-278d-4af4-8d4d-bfc2248cada4",
  title: "repellendus assentator artificiose",
  description: "Tametsi utrimque valeo apto sollicito cur. Contego facere tibi degenero. Testimonium calamitas quisquam crebro solus universe acies alo aggredior.",
  status: "PUBLISHED",
  operationType: "SALE",
  creatorUser: {
    id: "7c784e1c-aa18-4687-8fd8-ac9e6aa68328",
    username: "Lawson44",
    email: "Kody.Lemke42@gmail.com",
    personalInfo: {
      phone: "(684) 988-1286",
      lastName: "Treutel",
      avatarUrl: "https://avatars.githubusercontent.com/u/32392559",
      firstName: "Tanya"
    }
  },
  assignedAgent: null,
  price: 246526000,
  currencyPrice: "CLP",
  seoTitle: "Turpis sordeo verumtamen capitulus teneo aequus voluptate.",
  seoDescription: "Vilicus arbor aspernatur veniam cupio cupio tracto ater. Versus reprehenderit umquam candidus cras cum cicuta. Vetus artificiose valetudo candidus paulatim quasi balbus tonsor crinis.",
  publicationDate: "2025-10-18T23:48:39.000Z",
  isFeatured: false,
  propertyType: {
    id: "6e85176c-9642-479b-8ae4-89b946c981f7",
    name: "Villa"
  },
  builtSquareMeters: "180.16",
  landSquareMeters: "897.88",
  bedrooms: 2,
  bathrooms: 2,
  parkingSpaces: 2,
  floors: 7,
  constructionYear: 1983,
  state: "Los Lagos",
  city: "Cisnes",
  address: null,
  latitude: "-0.45749000",
  longitude: "35.67605700",
  multimedia: [],
  postRequest: {
    message: "Porro angelus velit avaritia clementia victoria. Tollo approbo degusto cohibeo cultura corporis adfero vacuus deserunt vulariter. Verumtamen voluptas patria taedium velit statua.",
    contactInfo: {
      name: "Miss Margarita Prosacco",
      email: "Margarita.Prosacco@gmail.com",
      phone: "1-555-123-4567"
    },
    requestedAt: "2024-01-15T10:30:00.000Z"
  },
  favoritesCount: 5,
  leadsCount: 3,
  viewsCount: 12,
  internalNotes: "Notas internas de ejemplo.",
  views: [
    { userId: "user1", duration: 120, viewedAt: "2024-01-10T09:00:00.000Z" },
    { userId: "user2", duration: 90, viewedAt: "2024-01-11T14:30:00.000Z" }
  ],
  changeHistory: [],
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-20T12:00:00.000Z",
  deletedAt: null,
  publishedAt: "2024-01-05T08:00:00.000Z"
};

interface FullPropertyDialogProps {
  propertyId: string;
  onSave?: (data: any) => void;
}

const FullProperty: React.FC<FullPropertyDialogProps> = ({ propertyId, onSave }) => {
  const alert = useAlert();
  const [activeSection, setActiveSection] = useState('basic');
  const [formData, setFormData] = useState<any | null>(null);
  const [originalData, setOriginalData] = useState<any | null>(null); // Para detectar cambios
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState<PropertyType | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Cargar datos en paralelo
        const [propertyResult, typesResult, usersResult] = await Promise.all([
          getProperty(propertyId),
          listPropertyTypes(),
          listAdminsAgents({})
        ]);

        // Cargar propiedad
        if (propertyResult.success && propertyResult.data) {
          setFormData(propertyResult.data);
          setOriginalData(propertyResult.data);
        } else {
          alert.error('No se pudo cargar la propiedad');
          return;
        }

        // Cargar tipos de propiedad
        if (typesResult.success && typesResult.data) {
          setPropertyTypes(typesResult.data);
          
          // Encontrar el tipo de la propiedad y sincronizar con el estado
          const propertyTypeId = propertyResult.data?.propertyType?.id;
          if (propertyTypeId && propertyResult.data) {
            const matchingType = typesResult.data.find((t: PropertyType) => t.id === propertyTypeId);
            if (matchingType) {
              setSelectedPropertyType(matchingType);
              // Asegurar que el formData tenga el tipo completo
              setFormData((prev: any) => ({
                ...prev,
                propertyType: matchingType
              }));
            }
          }
        }

        // Cargar usuarios
        if (usersResult.success) {
          setAvailableUsers(usersResult.data?.data || []);
        }
      } catch (error) {
        alert.error('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [propertyId, alert]);

  // Detectar cambios para habilitar/deshabilitar guardar
  useEffect(() => {
    if (formData && originalData) {
      const changed = JSON.stringify(formData) !== JSON.stringify(originalData);
      setHasChanges(changed);
    }
  }, [formData, originalData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!formData || !hasChanges) return;
    
    setSaving(true);
    try {
      const result = await updateProperty(propertyId, formData);
      if (result.success) {
        alert.success('Propiedad actualizada exitosamente');
        setOriginalData(formData);
        setHasChanges(false);
        onSave?.(formData);
      } else {
        alert.error(result.error || 'Error al actualizar la propiedad');
      }
    } catch (error) {
      alert.error('Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  // Calcular estadísticas si no están en el DTO
  const calculateStats = () => {
    const views = formData?.views || [];
    const leads = formData?.leads || [];
    return {
      favoritesCount: formData?.favoritesCount || 0,
      leadsCount: leads.length,
      viewsCount: views.length
    };
  };

  const stats = calculateStats();

  // Usar datos del formData
  const currentProperty = formData || {};

  const sections = [
    { id: 'basic', label: 'Información Básica' },
    { id: 'price', label: 'Precio y SEO' },
    { id: 'features', label: 'Características' },
    { id: 'location', label: 'Ubicación' },
    { id: 'multimedia', label: 'Multimedia' },
    { id: 'postRequest', label: 'Solicitud de Publicación' },
    { id: 'history', label: 'Historial y Estadísticas' },
    { id: 'dates', label: 'Fechas' }
  ];

  if (loading) {
    return <div className="py-12 text-center text-muted-foreground">Cargando propiedad...</div>;
  }

  if (!formData) {
    return <div className="py-12 text-center text-red-500">No se pudo cargar la propiedad.</div>;
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'basic':
        return (
          <div className="space-y-6">
            {/* Título - ancho completo y EDITABLE */}
            <div className="w-full">
              <TextField 
                label="Título" 
                value={currentProperty.title || ''} 
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>
            
            {/* Descripción - ancho completo */}
            <div className="w-full">
              <TextField 
                label="Descripción" 
                value={currentProperty.description || ''} 
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3} 
              />
            </div>

            {/* Grid de campos principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Estado - Select editable con carga automática */}
              <Select
                placeholder="Estado"
                value={(currentProperty.status || '').toUpperCase()}
                onChange={(value) => handleInputChange('status', value)}
                options={PROPERTY_STATUSES.map(status => ({
                  id: status.value,
                  label: status.label
                }))}
                required
              />

              {/* Tipo de Operación - Select editable con carga automática */}
              <Select
                placeholder="Tipo de Operación"
                value={(currentProperty.operationType || '').toUpperCase()}
                onChange={(value) => handleInputChange('operationType', value)}
                options={OPERATION_TYPES.map(type => ({
                  id: type.value,
                  label: type.label
                }))}
                required
              />

              {/* Tipo de Propiedad */}
              <Select
                placeholder="Tipo de Propiedad"
                value={currentProperty.propertyTypeId || ''}
                onChange={(value) => {
                  const selectedType = propertyTypes.find(type => type.id === value);
                  setSelectedPropertyType(selectedType || null);
                  handleInputChange('propertyType', selectedType);
                }}
                options={propertyTypes.map(type => ({
                  id: type.id,
                  label: type.name
                }))}
                required
              />

              {/* Agente Asignado - Select editable */}
              <div className="relative">
                <Select
                  placeholder={loadingUsers ? "Cargando agentes..." : "Agente Asignado"}
                  value={currentProperty.assignedAgent?.id || ''}
                  onChange={(value) => {
                    const selectedAgent = availableUsers.find(user => user.id === value);
                    handleInputChange('assignedAgent', selectedAgent);
                  }}
                  options={[
                    { id: '', label: 'Ninguno' },
                    ...availableUsers.map(user => ({
                      id: user.id,
                      label: `${user.personalInfo?.firstName} ${user.personalInfo?.lastName} - ${user.role === 'ADMIN' ? 'Administrador' : 'Agente'}`
                    }))
                  ]}
                />
                {loadingUsers && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <CircularProgress size={16} />
                  </div>
                )}
              </div>
            </div>

            {/* Sección del Perfil del Creador */}
            <div className="border-t pt-6 mt-6">
              <h4 className="text-lg font-semibold mb-4 text-foreground">Perfil del Creador</h4>
              {currentProperty.creatorUser ? (
                <div className="space-y-4">
                  {/* Información del avatar y nombre */}
                  <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                    {currentProperty.creatorUser.personalInfo?.avatarUrl && (
                      <img
                        src={currentProperty.creatorUser.personalInfo.avatarUrl}
                        alt="Avatar del creador"
                        className="w-16 h-16 rounded-full object-cover border-2 border-border"
                      />
                    )}
                    <div>
                      <h5 className="font-medium text-lg">
                        {currentProperty.creatorUser.personalInfo?.firstName} {currentProperty.creatorUser.personalInfo?.lastName}
                      </h5>
                      <p className="text-muted-foreground">@{currentProperty.creatorUser.username}</p>
                    </div>
                  </div>

                  {/* Detalles del creador en grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField 
                      label="Nombre" 
                      value={currentProperty.creatorUser.personalInfo?.firstName || ''} 
                      onChange={() => {}} 
                      readOnly 
                    />
                    <TextField 
                      label="Apellido" 
                      value={currentProperty.creatorUser.personalInfo?.lastName || ''} 
                      onChange={() => {}} 
                      readOnly 
                    />
                    <TextField 
                      label="Email" 
                      value={currentProperty.creatorUser.email || ''} 
                      onChange={() => {}} 
                      readOnly 
                    />
                    <TextField 
                      label="Teléfono" 
                      value={currentProperty.creatorUser.personalInfo?.phone || ''} 
                      onChange={() => {}} 
                      readOnly 
                    />
                    <TextField 
                      label="Nombre de Usuario" 
                      value={currentProperty.creatorUser.username || ''} 
                      onChange={() => {}} 
                      readOnly 
                    />
                    <TextField 
                      label="ID Usuario" 
                      value={currentProperty.creatorUser.id || ''} 
                      onChange={() => {}} 
                      readOnly 
                    />
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No hay información del creador disponible</p>
              )}
            </div>
          </div>
        );
      case 'price':
        return (
          <div className="space-y-4">
            <TextField
              label="Precio"
              type="number"
              value={currentProperty.price?.toString() || ''}
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
              required
            />
            <TextField
              label="Moneda"
              value={currentProperty.currencyPrice || ''}
              onChange={(e) => handleInputChange('currencyPrice', e.target.value)}
            />
            <TextField
              label="Título SEO"
              value={currentProperty.seoTitle || ''}
              onChange={(e) => handleInputChange('seoTitle', e.target.value)}
            />
            <TextField
              label="Descripción SEO"
              value={currentProperty.seoDescription || ''}
              onChange={(e) => handleInputChange('seoDescription', e.target.value)}
              rows={3}
            />
          </div>
        );
      case 'features':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField 
              label="Metros Construidos" 
              type="number"
              value={currentProperty.builtSquareMeters || ''} 
              onChange={(e) => handleInputChange('builtSquareMeters', parseFloat(e.target.value) || 0)}
            />
            <TextField 
              label="Metros Terreno" 
              type="number"
              value={currentProperty.landSquareMeters || ''} 
              onChange={(e) => handleInputChange('landSquareMeters', parseFloat(e.target.value) || 0)}
            />
            <TextField 
              label="Dormitorios" 
              type="number"
              value={currentProperty.bedrooms?.toString() || ''} 
              onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value) || 0)}
            />
            <TextField 
              label="Baños" 
              type="number"
              value={currentProperty.bathrooms?.toString() || ''} 
              onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value) || 0)}
            />
            <TextField 
              label="Estacionamientos" 
              type="number"
              value={currentProperty.parkingSpaces?.toString() || ''} 
              onChange={(e) => handleInputChange('parkingSpaces', parseInt(e.target.value) || 0)}
            />
            <TextField 
              label="Plantas" 
              type="number"
              value={currentProperty.floors?.toString() || ''} 
              onChange={(e) => handleInputChange('floors', parseInt(e.target.value) || 0)}
            />
            <TextField 
              label="Año Construcción" 
              type="number"
              value={currentProperty.constructionYear?.toString() || ''} 
              onChange={(e) => handleInputChange('constructionYear', parseInt(e.target.value) || 0)}
            />
          </div>
        );
      case 'location':
        return (
          <div className="space-y-4">
            {/* Dirección primero, ancho completo */}
            <div className="w-full">
              <TextField
                label="Dirección"
                value={currentProperty.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </div>

            {/* Grid para los demás campos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Región"
                value={currentProperty.state || ''}
                onChange={(e) => handleInputChange('state', e.target.value)}
              />
              <TextField
                label="Comuna"
                value={currentProperty.city || ''}
                onChange={(e) => handleInputChange('city', e.target.value)}
              />
              <TextField
                label="Latitud"
                type="number"
                value={currentProperty.latitude || ''}
                onChange={(e) => handleInputChange('latitude', e.target.value)}
              />
              <TextField
                label="Longitud"
                type="number"
                value={currentProperty.longitude || ''}
                onChange={(e) => handleInputChange('longitude', e.target.value)}
              />
            </div>
          </div>
        );
      case 'multimedia':
        return (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <IconButton
                icon="add"
                variant="containedSecondary"
                onClick={() => {
                  // Trigger file input click from MultimediaGallery
                  const fileInput = document.getElementById('multimedia-file-input') as HTMLInputElement;
                  fileInput?.click();
                }}
                aria-label="Agregar multimedia"
                style={{
                  borderRadius: '50%',
                  minWidth: 40,
                  minHeight: 40,
                  width: 40,
                  height: 40
                }}
              />
              <span className="text-sm text-muted-foreground">Agregar archivos multimedia</span>
            </div>
            
            {/* Mostrar multimedia existente */}
            {currentProperty.multimedia && currentProperty.multimedia.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Multimedia Existente</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {currentProperty.multimedia.map((media: any, index: number) => (
                    <div key={media.id || index} className="relative group">
                      {media.type === 'IMAGE' ? (
                        <img
                          src={media.url}
                          alt={media.filename || `Media ${index + 1}`}
                          className="w-full h-24 object-cover rounded border"
                        />
                      ) : (
                        <div className="w-full h-24 bg-muted rounded border flex items-center justify-center">
                          <span className="text-sm text-muted-foreground">Video</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded flex items-center justify-center">
                        <IconButton
                          icon="delete"
                          variant="text"
                          className="opacity-0 group-hover:opacity-100 text-white"
                          onClick={() => {
                            // Remover multimedia existente
                            const updatedMultimedia = currentProperty.multimedia.filter((_: any, i: number) => i !== index);
                            handleInputChange('multimedia', updatedMultimedia);
                          }}
                          aria-label="Eliminar multimedia"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <MultimediaGallery
              uploadPath="/uploads/properties"
              onChange={(files) => {
                console.log('Archivos multimedia seleccionados:', files);
                // Agregar nuevos archivos a la multimedia existente
                const existingMedia = currentProperty.multimedia || [];
                const newMedia = files.map((file: any) => ({
                  id: `temp-${Date.now()}-${Math.random()}`,
                  filename: file.name,
                  url: URL.createObjectURL(file),
                  type: file.type.startsWith('image/') ? 'IMAGE' : 'VIDEO',
                  uploadedAt: new Date().toISOString()
                }));
                handleInputChange('multimedia', [...existingMedia, ...newMedia]);
              }}
              maxFiles={20}
            />
          </div>
        );
      case 'postRequest':
        return (
          <div className="space-y-4">
            <TextField label="Mensaje" value={currentProperty.postRequest?.message || ''} onChange={() => {}} rows={3} readOnly />
            <TextField label="Nombre Contacto" value={currentProperty.postRequest?.contactInfo?.name || ''} onChange={() => {}} readOnly />
            <TextField label="Email Contacto" value={currentProperty.postRequest?.contactInfo?.email || ''} onChange={() => {}} readOnly />
            <TextField label="Teléfono Contacto" value={currentProperty.postRequest?.contactInfo?.phone || ''} onChange={() => {}} readOnly />
            <TextField label="Fecha Solicitud" value={currentProperty.postRequest?.requestedAt ? moment(currentProperty.postRequest.requestedAt).format('DD/MM/YYYY HH:mm:ss') : 'Fecha no disponible'} onChange={() => {}} readOnly />
          </div>
        );
      case 'history':
        return (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <TextField label="Favoritos" value={stats.favoritesCount.toString()} onChange={() => {}} readOnly />
              <TextField label="Leads" value={stats.leadsCount.toString()} onChange={() => {}} readOnly />
              <TextField label="Vistas" value={stats.viewsCount.toString()} onChange={() => {}} readOnly />
            </div>
            <TextField 
              label="Notas Internas" 
              value={currentProperty.internalNotes || ''} 
              onChange={(e) => handleInputChange('internalNotes', e.target.value)}
              rows={3} 
            />
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Vistas Recientes</h4>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {(currentProperty.views || []).slice(0, 10).map((view: any, index: number) => (
                  <div key={index} className="border p-3 rounded-lg bg-muted/30">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Usuario: {view.userId}</p>
                        <p className="text-sm text-muted-foreground">Duración: {view.duration}s</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {view.viewedAt ? moment(view.viewedAt).format('DD/MM/YYYY HH:mm') : 'Fecha no disponible'}
                      </p>
                    </div>
                  </div>
                ))}
                {(currentProperty.views || []).length === 0 && (
                  <p className="text-muted-foreground text-sm">No hay vistas registradas</p>
                )}
              </div>
            </div>
            {currentProperty.changeHistory && currentProperty.changeHistory.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Historial de Cambios</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {currentProperty.changeHistory.map((change: any, index: number) => (
                    <div key={index} className="border p-3 rounded-lg bg-muted/20">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium text-sm">
                          {change.userId ? `Usuario: ${change.userId}` : 'Sistema'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {change.changedAt ? moment(change.changedAt).format('DD/MM/YYYY HH:mm:ss') : 'Fecha no disponible'}
                        </p>
                      </div>
                      <div className="space-y-1">
                        {change.changes && change.changes.map((fieldChange: any, changeIndex: number) => (
                          <div key={changeIndex} className="text-sm">
                            <span className="font-medium">{fieldChange.field}:</span>{' '}
                            <span className="text-red-600 line-through">{fieldChange.oldValue || 'N/A'}</span>{' '}
                            <span className="text-green-600">→ {fieldChange.newValue || 'N/A'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case 'dates':
        return (
          <div className="space-y-4">
            <TextField
              label="Creado"
              value={currentProperty.createdAt ? moment(currentProperty.createdAt).format('DD/MM/YYYY HH:mm:ss') : ''}
              onChange={() => {}}
              readOnly
            />
            <TextField
              label="Actualizado"
              value={currentProperty.updatedAt ? moment(currentProperty.updatedAt).format('DD/MM/YYYY HH:mm:ss') : ''}
              onChange={() => {}}
              readOnly
            />
            <TextField
              label="Eliminado"
              value={currentProperty.deletedAt ? moment(currentProperty.deletedAt).format('DD/MM/YYYY HH:mm:ss') : 'No eliminado'}
              onChange={() => {}}
              readOnly
            />
            <TextField
              label="Publicado"
              value={currentProperty.publishedAt ? moment(currentProperty.publishedAt).format('DD/MM/YYYY HH:mm:ss') : 'No publicado'}
              onChange={() => {}}
              readOnly
            />
            <TextField
              label="Fecha Publicación"
              value={currentProperty.publicationDate ? moment(currentProperty.publicationDate).format('DD/MM/YYYY HH:mm:ss') : 'No definida'}
              onChange={() => {}}
              readOnly
            />
          </div>
        );
      default:
        return <p>Sección no encontrada</p>;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-neutral overflow-hidden">
      <header className="flex items-center justify-between p-6 border-b border-border bg-background shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-primary text-xl">home</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Propiedad: {currentProperty.title || 'Sin título'}
            </h1>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="material-symbols-outlined text-xs">tag</span>
              ID: {currentProperty.id}
              <span className="mx-2 text-border">•</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                currentProperty.status === 'PUBLISHED' 
                  ? 'bg-success/10 text-success' 
                  : currentProperty.status === 'DRAFT'
                  ? 'bg-warning/10 text-warning'
                  : 'bg-muted/10 text-muted-foreground'
              }`}>
                {PROPERTY_STATUSES.find(s => s.value === currentProperty.status)?.label || currentProperty.status}
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {hasChanges && (
            <div className="flex items-center gap-2 px-3 py-2 bg-warning/10 border border-warning/20 rounded-lg animate-pulse">
              <span className="material-symbols-outlined text-warning text-sm">warning</span>
              <span className="text-sm font-medium text-warning">
                Cambios sin guardar
              </span>
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-background text-foreground flex flex-col shadow-lg border-r border-border/20">
          {/* Navegación */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {sections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm group relative ${
                      activeSection === section.id
                        ? 'border border-secondary text-secondary bg-secondary/5'
                        : 'text-foreground/90 hover:bg-muted hover:text-foreground hover:shadow-sm'
                    }`}
                    data-test-id={`section-${section.id}`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Icono simple basado en la sección */}
                      <span className={`material-symbols-outlined text-lg ${
                        activeSection === section.id ? 'text-secondary' : 'text-muted-foreground group-hover:text-foreground'
                      }`}>
                        {section.id === 'basic' && 'info'}
                        {section.id === 'price' && 'attach_money'}
                        {section.id === 'features' && 'home_work'}
                        {section.id === 'location' && 'location_on'}
                        {section.id === 'multimedia' && 'photo_library'}
                        {section.id === 'postRequest' && 'post_add'}
                        {section.id === 'history' && 'history'}
                        {section.id === 'dates' && 'schedule'}
                      </span>
                      <span className="truncate">{section.label}</span>
                      {activeSection === section.id && (
                        <span className="material-symbols-outlined text-xs ml-auto text-secondary animate-pulse">
                          chevron_right
                        </span>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer del sidebar */}
          <div className="p-4 border-t border-border/20">
            <div className="text-xs text-muted-foreground text-center">
              Selecciona una sección para editar
            </div>
          </div>
        </aside>

        {/* Contenido */}
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="p-8 max-w-4xl mx-auto">
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FullProperty;
