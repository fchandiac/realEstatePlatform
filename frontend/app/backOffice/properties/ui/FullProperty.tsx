"use client";

import { useState } from 'react';
import { TextField } from '@/components/TextField/TextField';
import MultimediaGallery from '@/components/FileUploader/MultimediaGallery';

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
  property?: any; // Para futuro uso con datos reales
  onSave?: (data: any) => void;
}

const FullProperty: React.FC<FullPropertyDialogProps> = ({ property, onSave }) => {
  const [activeSection, setActiveSection] = useState('basic');

  // Usar datos reales si se pasan, sino mock
  const currentProperty = property || mockProperty;

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

  const renderSection = () => {
    switch (activeSection) {
      case 'basic':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField label="Título" value={currentProperty.title || ''} onChange={() => {}} readOnly />
            <TextField label="Descripción" value={currentProperty.description || ''} onChange={() => {}} rows={3} readOnly />
            <TextField label="Estado" value={currentProperty.status || ''} onChange={() => {}} readOnly />
            <TextField label="Tipo de Operación" value={currentProperty.operationType || ''} onChange={() => {}} readOnly />
            <TextField label="Tipo Propiedad" value={currentProperty.propertyType?.name || ''} onChange={() => {}} readOnly />
            <TextField label="Creador" value={currentProperty.creatorUser?.personalInfo?.firstName + ' ' + currentProperty.creatorUser?.personalInfo?.lastName || ''} onChange={() => {}} readOnly />
            <TextField label="Email Creador" value={currentProperty.creatorUser?.email || ''} onChange={() => {}} readOnly />
            <TextField label="Agente Asignado" value={currentProperty.assignedAgent?.personalInfo?.firstName + ' ' + currentProperty.assignedAgent?.personalInfo?.lastName || 'Ninguno'} onChange={() => {}} readOnly />
          </div>
        );
      case 'price':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField label="Precio" value={currentProperty.price?.toString() || ''} onChange={() => {}} readOnly />
            <TextField label="Moneda" value={currentProperty.currencyPrice || ''} onChange={() => {}} readOnly />
            <TextField label="Título SEO" value={currentProperty.seoTitle || ''} onChange={() => {}} readOnly />
            <TextField label="Descripción SEO" value={currentProperty.seoDescription || ''} onChange={() => {}} rows={3} readOnly />
          </div>
        );
      case 'features':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField label="Metros Construidos" value={currentProperty.builtSquareMeters || ''} onChange={() => {}} readOnly />
            <TextField label="Metros Terreno" value={currentProperty.landSquareMeters || ''} onChange={() => {}} readOnly />
            <TextField label="Dormitorios" value={currentProperty.bedrooms?.toString() || ''} onChange={() => {}} readOnly />
            <TextField label="Baños" value={currentProperty.bathrooms?.toString() || ''} onChange={() => {}} readOnly />
            <TextField label="Estacionamientos" value={currentProperty.parkingSpaces?.toString() || ''} onChange={() => {}} readOnly />
            <TextField label="Plantas" value={currentProperty.floors?.toString() || ''} onChange={() => {}} readOnly />
            <TextField label="Año Construcción" value={currentProperty.constructionYear?.toString() || ''} onChange={() => {}} readOnly />
          </div>
        );
      case 'location':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField label="Región" value={currentProperty.state || ''} onChange={() => {}} readOnly />
            <TextField label="Comuna" value={currentProperty.city || ''} onChange={() => {}} readOnly />
            <TextField label="Dirección" value={currentProperty.address || ''} onChange={() => {}} readOnly />
            <TextField label="Latitud" value={currentProperty.latitude || ''} onChange={() => {}} readOnly />
            <TextField label="Longitud" value={currentProperty.longitude || ''} onChange={() => {}} readOnly />
          </div>
        );
      case 'multimedia':
        return (
          <div>
            <h4 className="font-semibold mb-4">Multimedia de la Propiedad</h4>
            <MultimediaGallery
              uploadPath="/uploads/properties"
              onChange={(files) => {
                console.log('Archivos multimedia seleccionados:', files);
                // Aquí puedes manejar los archivos seleccionados
                // Por ejemplo, subirlos al backend o actualizar el estado
              }}
              maxFiles={20}
            />
          </div>
        );
      case 'postRequest':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField label="Mensaje" value={currentProperty.postRequest?.message || ''} onChange={() => {}} rows={3} readOnly />
            <TextField label="Nombre Contacto" value={currentProperty.postRequest?.contactInfo?.name || ''} onChange={() => {}} readOnly />
            <TextField label="Email Contacto" value={currentProperty.postRequest?.contactInfo?.email || ''} onChange={() => {}} readOnly />
            <TextField label="Teléfono Contacto" value={currentProperty.postRequest?.contactInfo?.phone || ''} onChange={() => {}} readOnly />
            <TextField label="Fecha Solicitud" value={currentProperty.postRequest?.requestedAt || ''} onChange={() => {}} readOnly />
          </div>
        );
      case 'history':
        return (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <TextField label="Favoritos" value={currentProperty.favoritesCount?.toString() || '0'} onChange={() => {}} readOnly />
              <TextField label="Leads" value={currentProperty.leadsCount?.toString() || '0'} onChange={() => {}} readOnly />
              <TextField label="Vistas" value={currentProperty.viewsCount?.toString() || '0'} onChange={() => {}} readOnly />
            </div>
            <TextField label="Notas Internas" value={currentProperty.internalNotes || ''} onChange={() => {}} rows={3} readOnly />
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Vistas</h4>
              {(currentProperty.views || []).map((view: any, index: number) => (
                <div key={index} className="border p-2 mb-2 rounded">
                  <p>Usuario: {view.userId}</p>
                  <p>Duración: {view.duration}s</p>
                  <p>Fecha: {view.viewedAt}</p>
                </div>
              ))}
            </div>
            {currentProperty.changeHistory && currentProperty.changeHistory.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Historial de Cambios</h4>
                {/* Renderizar changeHistory si existe */}
              </div>
            )}
          </div>
        );
      case 'dates':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField label="Creado" value={currentProperty.createdAt || ''} onChange={() => {}} readOnly />
            <TextField label="Actualizado" value={currentProperty.updatedAt || ''} onChange={() => {}} readOnly />
            <TextField label="Eliminado" value={currentProperty.deletedAt || ''} onChange={() => {}} readOnly />
            <TextField label="Publicado" value={currentProperty.publishedAt || ''} onChange={() => {}} readOnly />
            <TextField label="Fecha Publicación" value={currentProperty.publicationDate || ''} onChange={() => {}} readOnly />
          </div>
        );
      default:
        return <p>Sección no encontrada</p>;
    }
  };

  return (
    <div className="flex h-96">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-300 p-4">
        <h3 className="font-semibold mb-4">Secciones</h3>
        <div className="space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full text-left p-2 rounded ${
                activeSection === section.id ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>
      {/* Contenido */}
      <div className="flex-1 p-4 overflow-y-auto">
        {renderSection()}
      </div>
    </div>
  );
};

export default FullProperty;
