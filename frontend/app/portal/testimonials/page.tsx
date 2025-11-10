import React from 'react';

export default async function TestimonialsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Section */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
          Testimonios
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
          Descubre lo que nuestros clientes dicen sobre nuestra experiencia y servicio
        </p>
      </div>

      {/* Placeholder for testimonials */}
      <div className="text-center py-12">
        <span className="material-symbols-outlined text-gray-400 mx-auto mb-4" style={{ fontSize: '64px' }}>
          rate_review
        </span>
        <p className="text-muted-foreground">
          Los testimonios se cargarán próximamente
        </p>
      </div>
    </div>
  );
}
