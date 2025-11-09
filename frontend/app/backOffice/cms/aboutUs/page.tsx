'use client';

import React, { useState, useEffect } from 'react';
import { TextField } from '@/components/TextField/TextField';
import { Button } from '@/components/Button/Button';
import CircularProgress from '@/components/CircularProgress/CircularProgress';
import { getAboutUs, updateAboutUs } from '@/app/actions/aboutUs';
import { env } from '@/lib/env';
import FileImageUploader from '@/components/FileUploader/FileImageUploader';

interface AboutUsData {
  bio: string;
  mision: string;
  vision: string;
  multimediaUrl?: string;
}

export default function AboutUsPage() {
  const [data, setData] = useState<AboutUsData>({
    bio: '',
    mision: '',
    vision: '',
    multimediaUrl: '',
  });

  // Estados para manejo de multimedia
  const [currentMultimedia, setCurrentMultimedia] = useState<string>('');
  const [newMultimediaFile, setNewMultimediaFile] = useState<File[]>([]);
  const [showMultimediaUploader, setShowMultimediaUploader] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const result = await getAboutUs();
    if (result.success && result.data) {
      setData(result.data);
      setCurrentMultimedia(result.data.multimediaUrl || '');
    }
    setIsLoading(false);
  };

  // Handlers para gestión de multimedia
  const handleChangeMultimedia = () => {
    setShowMultimediaUploader(true);
    setCurrentMultimedia('');
  };

  const handleKeepCurrentMultimedia = () => {
    setShowMultimediaUploader(false);
    setNewMultimediaFile([]);
    setCurrentMultimedia(data.multimediaUrl || '');
  };

  const handleMultimediaChange = (files: File[]) => {
    setNewMultimediaFile(files);
  };

  const handleSubmit = async () => {
    console.log('🔔 handleSubmit called');
    console.log('Data to send:', data);
    console.log('New multimedia file:', newMultimediaFile);

    setErrors([]);
    setIsSaving(true);

    const formData = new FormData();
    formData.append('bio', data.bio);
    formData.append('mision', data.mision);
    formData.append('vision', data.vision);

    if (newMultimediaFile.length > 0) {
      formData.append('multimedia', newMultimediaFile[0]);
      console.log('Appending multimedia:', newMultimediaFile[0].name);
    }

    console.log('Calling updateAboutUs...');
    const result = await updateAboutUs(formData);
    console.log('updateAboutUs result:', result);

    if (result.success) {
      console.log('Success! Reloading data...');
      await loadData(); // Recargar datos
      setNewMultimediaFile([]);
      setShowMultimediaUploader(false);
    } else {
      console.log('Error:', result.error);
      setErrors([result.error || 'Error al guardar']);
    }

    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress size={40} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Administrar Sobre Nosotros</h1>
        <p className="text-muted-foreground">Edita el contenido que se muestra en la página pública</p>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <ul className="list-disc pl-5">
            {errors.map((error, index) => (
              <li key={index} className="text-red-700">{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-6">
        {/* Multimedia */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imagen (opcional)
          </label>

          {/* Mostrar multimedia actual */}
          {currentMultimedia && !showMultimediaUploader && (
            <div className="mb-4">
              <div className="relative w-48 h-32 bg-gray-100 rounded-lg overflow-hidden border">
                <img
                  src={`${env.backendApiUrl}${currentMultimedia}`}
                  alt="Imagen actual"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex justify-start mt-2">
                <Button
                  onClick={handleChangeMultimedia}
                  variant="outlined"
                  size="sm"
                >
                  Cambiar multimedia
                </Button>
              </div>
            </div>
          )}

          {/* Mostrar uploader cuando se necesita */}
          {(showMultimediaUploader || !currentMultimedia) && (
            <div className="border border-input rounded-md p-4 bg-background">
              <FileImageUploader
                uploadPath="/public/web/aboutUs"
                onChange={handleMultimediaChange}
                maxFiles={1}
                accept="image/*"
                maxSize={9}
                aspectRatio="auto"
                buttonType="icon"
              />

              {newMultimediaFile.length > 0 && (
                <p className="text-sm text-green-600 mt-2">
                  ✓ Nueva imagen seleccionada: {newMultimediaFile[0].name}
                </p>
              )}

              {currentMultimedia && (
                <Button
                  onClick={handleKeepCurrentMultimedia}
                  variant="text"
                  size="sm"
                  className="mt-2"
                >
                  Mantener imagen actual
                </Button>
              )}

              <small className="text-xs text-muted-foreground mt-2 block">
                Máx. 1 imagen (hasta 9MB)
              </small>
            </div>
          )}
        </div>

        {/* Bio */}
        <TextField
          label="Quiénes somos (Bio)"
          value={data.bio}
          onChange={(e) => setData(prev => ({ ...prev, bio: e.target.value }))}
          rows={6}
          required
          placeholder="Describe quiénes son..."
        />

        {/* Misión */}
        <TextField
          label="Misión"
          value={data.mision}
          onChange={(e) => setData(prev => ({ ...prev, mision: e.target.value }))}
          rows={4}
          required
          placeholder="Describe la misión..."
        />

        {/* Visión */}
        <TextField
          label="Visión"
          value={data.vision}
          onChange={(e) => setData(prev => ({ ...prev, vision: e.target.value }))}
          rows={4}
          required
          placeholder="Describe la visión..."
        />

        {/* Botón guardar */}
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? (
              <>
                <CircularProgress size={16} className="mr-2" />
                Guardando...
              </>
            ) : (
              'Guardar cambios'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
