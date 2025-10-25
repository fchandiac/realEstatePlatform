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
      { label: 'Tipos de propiedad' },
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
      { label: 'Slider' },
      { label: 'Sobre nosotros' },
      { label: 'Testimonios' },
      { label: 'Nuestro Equipo' },
      { label: 'Artículos de blog' },
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
      <TopBar menuItems={menuItems} />

      <main className="container mx-auto mt-20">{children}</main>
    </div>
  );
}