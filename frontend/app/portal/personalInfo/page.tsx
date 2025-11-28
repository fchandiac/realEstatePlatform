'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import UpdateBaseForm, { BaseUpdateFormField } from '@/components/BaseForm/UpdateBaseForm';
import { getCurrentUserProfile, updateUserProfile, updateUserAvatar } from '@/app/actions/users';
import { useAlert } from '@/app/hooks/useAlert';
import CircularProgress from '@/components/CircularProgress/CircularProgress';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  personalInfo?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    avatarUrl?: string;
  };
  role: string;
  status: string;
  createdAt: string;
}

export default function PersonalInfoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showAlert } = useAlert();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load user profile on mount
  useEffect(() => {
    async function loadProfile() {
      try {
        if (status === 'unauthenticated') {
          router.push('/portal');
          return;
        }

        if (status !== 'authenticated') {
          return;
        }

        const result = await getCurrentUserProfile();
        if (result.success && result.data) {
          setUserProfile(result.data as UserProfile);
          setError(null);
        } else {
          setError(result.error || 'Error al cargar el perfil');
          showAlert({
            message: result.error || 'No se pudo cargar el perfil',
            type: 'error',
            duration: 3000,
          });
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error desconocido';
        setError(message);
        showAlert({
          message,
          type: 'error',
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [status, router, showAlert]);

  // Define form fields
  const formFields: BaseUpdateFormField[] = [
    {
      name: 'avatar',
      label: 'Foto de Perfil',
      type: 'avatar',
      currentUrl: userProfile?.personalInfo?.avatarUrl,
      maxSize: 5,
      aspectRatio: '1:1',
      buttonText: 'Cambiar Foto',
      labelText: 'Foto de Perfil',
      previewSize: 'md',
    },
    {
      name: 'firstName',
      label: 'Nombre',
      type: 'text',
      required: true,
      startIcon: 'person',
    },
    {
      name: 'lastName',
      label: 'Apellido',
      type: 'text',
      required: true,
      startIcon: 'person',
    },
    {
      name: 'email',
      label: 'Correo Electrónico',
      type: 'email',
      required: true,
      startIcon: 'email',
      disabled: true, // Email no se puede cambiar desde aquí
    },
    {
      name: 'phone',
      label: 'Teléfono',
      type: 'text',
      startIcon: 'phone',
    },
    {
      name: 'address',
      label: 'Dirección',
      type: 'text',
      startIcon: 'location_on',
    },
    {
      name: 'city',
      label: 'Ciudad',
      type: 'text',
      startIcon: 'location_city',
    },
    {
      name: 'state',
      label: 'Región',
      type: 'text',
      startIcon: 'public',
    },
    {
      name: 'country',
      label: 'País',
      type: 'text',
      startIcon: 'public',
    },
  ];

  const handleSubmit = async (values: Record<string, any>) => {
    setSubmitting(true);
    try {
      if (!userProfile) {
        showAlert({
          message: 'Perfil no disponible',
          type: 'error',
          duration: 3000,
        });
        return;
      }

      // Handle avatar separately if it's a File
      let avatarUrl = userProfile.personalInfo?.avatarUrl;
      if (values.avatar instanceof File) {
        const formData = new FormData();
        formData.append('file', values.avatar);

        const avatarResult = await updateUserAvatar(userProfile.id, formData);
        if (!avatarResult.success) {
          showAlert({
            message: avatarResult.error || 'Error al actualizar la foto de perfil',
            type: 'error',
            duration: 3000,
          });
          setSubmitting(false);
          return;
        }
        avatarUrl = avatarResult.data?.avatarUrl;
      }

      // Prepare update data
      const updateData = {
        personalInfo: {
          firstName: values.firstName || userProfile.personalInfo?.firstName,
          lastName: values.lastName || userProfile.personalInfo?.lastName,
          phone: values.phone || userProfile.personalInfo?.phone,
          address: values.address || userProfile.personalInfo?.address,
          city: values.city || userProfile.personalInfo?.city,
          state: values.state || userProfile.personalInfo?.state,
          country: values.country || userProfile.personalInfo?.country,
          avatarUrl: avatarUrl,
        },
      };

      // Update user profile
      const result = await updateUserProfile(userProfile.id, updateData);
      if (result.success) {
        setUserProfile(result.data as UserProfile);
        showAlert({
          message: 'Perfil actualizado exitosamente',
          type: 'success',
          duration: 3000,
        });
      } else {
        showAlert({
          message: result.error || 'Error al actualizar el perfil',
          type: 'error',
          duration: 3000,
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      showAlert({
        message,
        type: 'error',
        duration: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-foreground">Por favor inicia sesión para ver tu perfil</p>
      </div>
    );
  }

  if (error && !userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  const initialValues = {
    avatar: userProfile.personalInfo?.avatarUrl || null,
    firstName: userProfile.personalInfo?.firstName || '',
    lastName: userProfile.personalInfo?.lastName || '',
    email: userProfile.email,
    phone: userProfile.personalInfo?.phone || '',
    address: userProfile.personalInfo?.address || '',
    city: userProfile.personalInfo?.city || '',
    state: userProfile.personalInfo?.state || '',
    country: userProfile.personalInfo?.country || '',
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Mi Información Personal
        </h1>
        <p className="mt-2 text-gray-600">
          Actualiza tu información personal y foto de perfil
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <UpdateBaseForm
          fields={formFields}
          initialState={initialValues}
          onSubmit={handleSubmit}
          isSubmitting={submitting}
          title="Información Personal"
          submitLabel="Guardar Cambios"
          submitVariant="primary"
          columns={2}
          cancelButton
          onCancel={() => router.back()}
        />
      </div>
    </div>
  );
}
