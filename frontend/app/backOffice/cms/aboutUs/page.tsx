'use client';

import React, { useState } from 'react';
import Stepper from '@/components/Stepper/Stepper';
import Card from '@/components/Card/Card';
import { TextField } from '@/components/TextField/TextField';

export default function AboutUsPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    mission: '',
    vision: '',
    values: '',
  });

  const steps = [
    {
      number: 1,
      title: "Información Básica",
      description: "Configura el título, subtítulo y descripción principal de la sección Sobre Nosotros"
    },
    {
      number: 2,
      title: "Misión y Visión",
      description: "Define la misión y visión de la empresa"
    },
    {
      number: 3,
      title: "Valores",
      description: "Establece los valores fundamentales de la empresa"
    }
  ];

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('Form Data:', formData);
    // Aquí iría la lógica para guardar los datos
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <div className="space-y-4">
            <TextField
              label="Título"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
            />
            <TextField
              label="Subtítulo"
              value={formData.subtitle}
              onChange={(e) => handleInputChange('subtitle', e.target.value)}
            />
            <TextField
              label="Descripción"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              required
              rows={4}
            />
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <TextField
              label="Misión"
              value={formData.mission}
              onChange={(e) => handleInputChange('mission', e.target.value)}
              required
              rows={4}
            />
            <TextField
              label="Visión"
              value={formData.vision}
              onChange={(e) => handleInputChange('vision', e.target.value)}
              required
              rows={4}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <TextField
              label="Valores"
              value={formData.values}
              onChange={(e) => handleInputChange('values', e.target.value)}
              required
              rows={6}
              placeholder="Ingresa los valores separados por comas o en líneas separadas"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Configuración Sobre Nosotros</h1>
        
        <Stepper 
          steps={steps}
          activeStep={activeStep}
          onStepChange={handleStepChange}
        />

        <div className="mt-6 mb-4">
          {renderStepContent()}
        </div>
      </Card>
    </div>
  );
}
