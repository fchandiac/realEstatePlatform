"use client";

import TopBar from '../../components/TopBar/TopBar';
import React from 'react';

const menuItems = [
  { label: 'Dashboard' },
  {
    label: 'Propiedades',
    children: [
      { label: 'Venta', url: '/backOffice/properties/sales' },
      { label: 'Arriendo' },
      { label: 'Tipos de propiedad', url: '/backOffice/properties/propertyTypes' },
      { label: 'Solicitudes de publicación' },
      { label: 'Valoraciones' },
    ],
  },
  {
    label: 'Contratos',
    children: [
      { label: 'Contratos' },
      { label: 'Personas' },
      { label: 'Documentos' },
    ],
  },
  {
    label: 'Usuarios',
    children: [
      { label: 'Administradores', url: '/backOffice/users/administrators' },
      { label: 'Agentes' },
      { label: 'Comunidad' },
    ],
  },
  {
    label: 'CMS',
    children: [
      { label: 'Slider', url: '/backOffice/cms/slider' },
      { label: 'Sobre nosotros', url: '/backOffice/cms/aboutUs' },
      { label: 'Nuestro Equipo', url: '/backOffice/cms/ourTeam' },
      { label: 'Testimonios', url: '/backOffice/cms/testimonials' },
      { label: 'Artículos de blog', url: '/backOffice/cms/articles' },
      { label: 'Identidad de la empresa', url: '/backOffice/cms/identity' },
    ],
  },
  { label: 'Reportes' },
  { label: 'Auditoría' },
  { label: 'Notificaciones' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <TopBar
        menuItems={menuItems}
        showNotifications={true}
        notificationCount={0}
        onNotificationsClick={() => {}}
        showUserButton={true}
        onUserClick={() => {}}
        userName="Usuario Demo"
      />

      <main className="container mx-auto mt-20">{children}</main>
    </div>
  );
}

