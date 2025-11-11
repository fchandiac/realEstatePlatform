'use client';

import React, { useState } from 'react';
import UpdateBaseForm, { BaseUpdateFormField } from './UpdateBaseForm';

interface AdminData {
  username: string;
  email: string;
  avatar: string;
  avatarFile?: File | null;
  coverImage: string;
  coverImageFile?: File | null;
  promoVideo: string;
  promoVideoFile?: File | null;
}

const UpdateBaseFormMultimediaExample: React.FC = () => {
  const [adminData, setAdminData] = useState<AdminData>({
    username: 'admin123',
    email: 'admin@example.com',
    avatar: '/api/user/avatar/current.jpg',
    avatarFile: null,
    coverImage: '/api/property/cover.jpg',
    coverImageFile: null,
    promoVideo: '/api/property/video.mp4',
    promoVideoFile: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const fields: BaseUpdateFormField[] = [
    {
      name: 'username',
      label: 'Nombre de usuario',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      label: 'Correo electrónico',
      type: 'email',
      required: true,
    },
    {
      name: 'avatar',
      label: 'Avatar',
      type: 'avatar',
      currentUrl: adminData.avatar,
    },
    {
      name: 'coverImage',
      label: 'Imagen de portada',
      type: 'image',
      currentUrl: adminData.coverImage,
      aspectRatio: '16:9',
      maxSize: 10,
      buttonText: 'Cambiar imagen de portada',
    },
    {
      name: 'promoVideo',
      label: 'Video promocional',
      type: 'video',
      currentUrl: adminData.promoVideo,
      currentType: 'video',
      maxSize: 50,
      buttonText: 'Actualizar video promocional',
    },
  ];

  const handleSubmit = async (values: Record<string, any>) => {
    setIsSubmitting(true);
    setErrors([]);

    try {
      // Simular subida de archivos multimedia
      const formData = new FormData();

      // Agregar archivos si existen
      if (values.avatarFile) {
        formData.append('avatar', values.avatarFile);
        console.log('Subiendo avatar:', values.avatarFile.name);
      }

      if (values.coverImageFile) {
        formData.append('coverImage', values.coverImageFile);
        console.log('Subiendo imagen de portada:', values.coverImageFile.name);
      }

      if (values.promoVideoFile) {
        formData.append('promoVideo', values.promoVideoFile);
        console.log('Subiendo video promocional:', values.promoVideoFile.name);
      }

      // Agregar otros campos
      formData.append('username', values.username);
      formData.append('email', values.email);

      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Datos enviados:', {
        username: values.username,
        email: values.email,
        avatarFile: values.avatarFile?.name,
        coverImageFile: values.coverImageFile?.name,
        promoVideoFile: values.promoVideoFile?.name,
      });

      alert('Datos actualizados exitosamente!');
    } catch (error) {
      setErrors(['Error al actualizar los datos']);
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Ejemplo: UpdateBaseForm con Multimedia</h1>

      <UpdateBaseForm
        fields={fields}
        initialState={adminData}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        errors={errors}
        title="Actualizar Perfil de Administrador"
        subtitle="Modifica la información y multimedia del administrador"
        submitLabel="Guardar Cambios"
        showCloseButton={true}
        closeButtonText="Cancelar"
        onClose={() => alert('Cancelado')}
      />

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Estado Actual:</h3>
        <pre className="text-sm text-gray-600">
          {JSON.stringify({
            username: adminData.username,
            email: adminData.email,
            avatar: adminData.avatar,
            coverImage: adminData.coverImage,
            promoVideo: adminData.promoVideo,
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default UpdateBaseFormMultimediaExample;