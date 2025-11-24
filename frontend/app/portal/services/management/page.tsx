

import React from 'react';

export default function PropertyManagementServicePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Section */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">Administración de Propiedades</h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
          Tu inversión, nuestra prioridad. Gestión integral, arriendo, mantención y cobranza para tu tranquilidad.
        </p>
      </div>

      {/* Hero Multimedia */}
      <div className="mb-12">
        <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
          <img
            src="/portal/img/property-management.jpg"
            alt="Administración de propiedades"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
      </div>

      {/* Descripción principal */}
      <div className="mb-12">
        <div className="bg-card rounded-lg p-6 md:p-8 shadow-sm">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 text-center">¿Por qué elegirnos?</h2>
          <div className="prose prose-lg max-w-none text-foreground">
            <p className="text-base md:text-lg leading-relaxed whitespace-pre-line">
              Administrar una propiedad puede volverse complicado: pagos atrasados, reparaciones urgentes, trámites legales y la preocupación constante por mantener el inmueble en buen estado. Nuestro objetivo es que tu inversión te dé tranquilidad, no problemas.
            </p>
            <p className="text-base md:text-lg leading-relaxed whitespace-pre-line">
              Nos ocupamos de todo lo relacionado con tu alquiler: <span className="font-semibold text-primary">selección del inquilino, contratos, cobranza, control de gastos y mantenimiento preventivo</span> con proveedores de confianza. Cuidamos tu propiedad para preservar y potenciar su valor en el tiempo.
            </p>
            <p className="text-base md:text-lg leading-relaxed whitespace-pre-line">
              Centralizamos la comunicación con el inquilino y la gestión operativa de la propiedad, mientras tú recibes <span className="font-semibold text-primary">reportes claros sobre tu rentabilidad</span>. Menos vacancia, ingresos estables y cero complicaciones.
            </p>
          </div>
        </div>
      </div>

      {/* Servicios Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Gestión de arriendo */}
        <div className="bg-card border border-border rounded-lg p-6 md:p-8 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
              <span className="material-symbols-outlined text-primary text-2xl">person_search</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-primary">Gestión de arriendo</h3>
          </div>
          <p className="text-foreground leading-relaxed whitespace-pre-line">
            Selección de arrendatarios, contratos, cobranza y administración de pagos.
          </p>
        </div>

        {/* Mantención y reportes */}
        <div className="bg-card border border-border rounded-lg p-6 md:p-8 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
              <span className="material-symbols-outlined text-primary text-2xl">build</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-primary">Mantención y reportes</h3>
          </div>
          <p className="text-foreground leading-relaxed whitespace-pre-line">
            Mantención preventiva y correctiva, reportes mensuales y atención personalizada.
          </p>
        </div>
      </div>

      {/* CTA final */}
    
    </div>
  );
}
