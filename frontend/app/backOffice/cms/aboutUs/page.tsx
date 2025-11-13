'use client';

import React, { useState, useEffect } from 'react';
import { TextField } from '@/components/TextField/TextField';
import { Button } from '@/components/Button/Button';
import CircularProgress from '@/components/CircularProgress/CircularProgress';
import MultimediaUpdater from '@/components/FileUploader/MultimediaUpdater';
import { getAboutUs, updateAboutUs } from '@/app/actions/aboutUs';
import { useAlert } from '@/app/hooks/useAlert';

interface AboutUsData {
  bio: string;
  mision: string;
  vision: string;
  multimediaUrl?: string;
}

export default function AboutUsPage() {
  const { showAlert } = useAlert();
  const [data, setData] = useState<AboutUsData>({
    bio: '',
    mision: '',
    vision: '',
    multimediaUrl: '',
  });

  // Estado para multimedia file
  const [multimediaFile, setMultimediaFile] = useState<File | null>(null);

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
    }
    setIsLoading(false);
  };

  const handleMultimediaChange = (file: File | null) => {
    setMultimediaFile(file);
  };

  const handleSubmit = async () => {
    setErrors([]);
    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append('bio', data.bio);
      formData.append('mision', data.mision);
      formData.append('vision', data.vision);

      if (multimediaFile) {
        formData.append('multimedia', multimediaFile);
      }

      const result = await updateAboutUs(formData);

      if (result.success) {
        showAlert({
          message: 'Cambios guardados exitosamente',
          type: 'success',
          duration: 3000,
        });
        await loadData();
        setMultimediaFile(null);
      } else {
        const errorMsg = result.error || 'Error al guardar';
        setErrors([errorMsg]);
        showAlert({
          message: errorMsg,
          type: 'error',
          duration: 5000,
        });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error interno del servidor';
      setErrors([errorMsg]);
      showAlert({
        message: errorMsg,
        type: 'error',
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
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
        <p className="text-muted-foreground">Edita el contenido que se muestra en el portal público</p>
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
          <label className="block text-sm font-medium text-foreground mb-4">
            Multimedia 
          </label>

          <MultimediaUpdater
            currentUrl={data.multimediaUrl}
            currentType={data.multimediaUrl?.includes('.mp4') || data.multimediaUrl?.includes('.webm') || data.multimediaUrl?.includes('.ogg') ? 'video' : 'image'}
            onFileChange={handleMultimediaChange}
            buttonText="Cambiar multimedia"
            labelText="Multimedia"
            acceptedTypes={['image/*', 'video/*']}
            maxSize={9}
            aspectRatio="16:9"
            previewSize="xl"
          />
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
