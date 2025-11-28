'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import UpdateBaseForm, { BaseUpdateFormField, BaseUpdateFormFieldGroup } from '@/components/BaseForm/UpdateBaseForm';
import { getCurrentUserProfile, updateUserProfile, updateUserAvatar, updatePerson } from '@/app/actions/users';
import { useAlert } from '@/app/hooks/useAlert';
import CircularProgress from '@/components/CircularProgress/CircularProgress';

interface PersonData {
  id: string;
  dni?: string;
  address?: string;
  phone?: string;
  email?: string;
  dniCardFrontUrl?: string;
  dniCardRearUrl?: string;
  verified: boolean;
}

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
  person?: PersonData;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
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

  // Define form field groups (User + Person data combined)
  const formFieldGroups: BaseUpdateFormFieldGroup[] = [
    {
      title: 'Información Básica',
      subtitle: 'Tu información de cuenta y perfil',
      columns: 1,
      fields: [
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
      ] as BaseUpdateFormField[],
    },
    {
      title: '',
      columns: 2,
      fields: [
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
          disabled: true,
        },
        {
          name: 'phone',
          label: 'Teléfono',
          type: 'text',
          startIcon: 'phone',
        },
      ] as BaseUpdateFormField[],
    },
    {
      title: 'Información Personal Detallada',
      subtitle: 'Datos adicionales de identificación y ubicación',
      columns: 2,
      fields: [
        {
          name: 'dni',
          label: 'Documento de Identidad (DNI)',
          type: 'dni',
          startIcon: 'badge',
        },
        {
          name: 'profession',
          label: 'Profesión',
          type: 'text',
          startIcon: 'work',
        },
        {
          name: 'company',
          label: 'Empresa',
          type: 'text',
          startIcon: 'business',
        },
        {
          name: 'nationality',
          label: 'Nacionalidad',
          type: 'text',
          startIcon: 'public',
        },
        {
          name: 'gender',
          label: 'Género',
          type: 'select',
          options: [
            { value: 'MALE', label: 'Masculino' },
            { value: 'FEMALE', label: 'Femenino' },
            { value: 'OTHER', label: 'Otro' },
          ],
          startIcon: 'person',
        },
        {
          name: 'maritalStatus',
          label: 'Estado Civil',
          type: 'select',
          options: [
            { value: 'SINGLE', label: 'Soltero(a)' },
            { value: 'MARRIED', label: 'Casado(a)' },
            { value: 'DIVORCED', label: 'Divorciado(a)' },
            { value: 'WIDOWED', label: 'Viudo(a)' },
          ],
          startIcon: 'people',
        },
      ] as BaseUpdateFormField[],
    },
    {
      title: 'Información de Ubicación',
      subtitle: 'Tu domicilio y ubicación geográfica',
      columns: 2,
      fields: [
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
          startIcon: 'map',
        },
        {
          name: 'country',
          label: 'País',
          type: 'text',
          startIcon: 'public',
        },
      ] as BaseUpdateFormField[],
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

      // Prepare User (personalInfo) update data
      const userUpdateData = {
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

      // Prepare Person update data if Person exists
      let personUpdateData: Record<string, any> | null = null;
      if (userProfile.person?.id) {
        personUpdateData = {
          dni: values.dni || userProfile.person?.dni,
          address: values.address || userProfile.person?.address,
          phone: values.phone || userProfile.person?.phone,
          email: userProfile.email,
        };
      }

      // Update user profile
      const userResult = await updateUserProfile(userProfile.id, userUpdateData);
      if (!userResult.success) {
        showAlert({
          message: userResult.error || 'Error al actualizar el perfil',
          type: 'error',
          duration: 3000,
        });
        setSubmitting(false);
        return;
      }

      // Update person data if exists
      if (personUpdateData && userProfile.person?.id) {
        const personResult = await updatePerson(userProfile.person.id, personUpdateData);
        if (!personResult.success) {
          showAlert({
            message: personResult.error || 'Error al actualizar información personal',
            type: 'warning',
            duration: 3000,
          });
          // Don't return here, as user data was updated successfully
        }
      }

      // Update local state with new profile
      setUserProfile(userResult.data as UserProfile);
      showAlert({
        message: 'Perfil actualizado exitosamente',
        type: 'success',
        duration: 3000,
      });
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
    phone: userProfile.personalInfo?.phone || userProfile.person?.phone || '',
    address: userProfile.personalInfo?.address || userProfile.person?.address || '',
    city: userProfile.personalInfo?.city || '',
    state: userProfile.personalInfo?.state || '',
    country: userProfile.personalInfo?.country || '',
    // Person data
    dni: userProfile.person?.dni || '',
    profession: '',
    company: '',
    nationality: '',
    gender: '',
    maritalStatus: '',
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
          fields={formFieldGroups}
          initialState={initialValues}
          onSubmit={handleSubmit}
          isSubmitting={submitting}
          submitLabel="Guardar Cambios"
          submitVariant="primary"
          cancelButton
          onCancel={() => router.back()}
        />
      </div>
    </div>
  );
}
