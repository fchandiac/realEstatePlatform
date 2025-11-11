'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Dialog from '@/components/Dialog/Dialog';
import UpdateBaseForm from '@/components/BaseForm/UpdateBaseForm';
import Alert from '@/components/Alert/Alert';
import CircularProgress from '@/components/CircularProgress/CircularProgress';
import { BaseUpdateFormField } from '@/components/BaseForm/UpdateBaseForm';
import { updateUserProfile, changePassword, uploadMultimedia } from '@/app/actions/users';

interface MyAccountDialogProps {
  open: boolean;
  onClose: () => void;
}

interface MyAccountData {
  // Usuario
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;

  // Persona
  dni: string;
  address: string;
  personPhone: string;
  personEmail: string;

  // Seguridad
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;

  // Archivos
  avatar: File | null;
  dniCardFront: File | null;
  dniCardRear: File | null;
}

const MyAccountDialog: React.FC<MyAccountDialogProps> = ({ open, onClose }) => {
  const { data: session, update: updateSession } = useSession();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [initialData, setInitialData] = useState<Partial<MyAccountData>>({});

  const loadUserData = useCallback(async () => {
    try {
      setLoading(true);
      // Aquí cargarías los datos del usuario y persona desde el backend
      // Por ahora usamos datos de ejemplo basados en la sesión
      const user = session?.user as {
        username?: string;
        email?: string;
        personalInfo?: {
          firstName?: string;
          lastName?: string;
          phone?: string;
        };
      };

      setInitialData({
        username: user?.username || '',
        email: user?.email || '',
        firstName: user?.personalInfo?.firstName || '',
        lastName: user?.personalInfo?.lastName || '',
        phone: user?.personalInfo?.phone || '',
        dni: '', // Cargar desde persona
        address: '', // Cargar desde persona
        personPhone: '', // Cargar desde persona
        personEmail: '', // Cargar desde persona
      });
    } catch (error: unknown) {
      console.error('Error loading user data:', error);
      setAlert({ type: 'error', message: 'Error al cargar los datos del usuario' });
    } finally {
      setLoading(false);
    }
  }, [session]);

  // Cargar datos iniciales cuando se abre el dialog
  useEffect(() => {
    if (open && session?.user) {
      loadUserData();
    }
  }, [open, session, loadUserData]);

  const fields: BaseUpdateFormField[] = [
    // Información básica del usuario
    {
      name: 'username',
      label: 'Nombre de usuario',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
    },
    {
      name: 'firstName',
      label: 'Nombre',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      label: 'Apellido',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      label: 'Teléfono',
      type: 'text',
    },

    // Información de la persona
    {
      name: 'dni',
      label: 'DNI',
      type: 'dni',
      required: true,
    },
    {
      name: 'address',
      label: 'Dirección',
      type: 'textarea',
    },
    {
      name: 'personPhone',
      label: 'Teléfono adicional',
      type: 'text',
    },
    {
      name: 'personEmail',
      label: 'Email adicional',
      type: 'email',
    },

    // Avatar
    {
      name: 'avatar',
      label: 'Foto de perfil',
      type: 'avatar',
      maxSize: 2,
      buttonText: 'Cambiar foto de perfil',
    },

    // Documentos DNI
    {
      name: 'dniCardFront',
      label: 'DNI - Frente',
      type: 'image',
      maxSize: 5,
      buttonText: 'Subir frente del DNI',
    },

    {
      name: 'dniCardRear',
      label: 'DNI - Reverso',
      type: 'image',
      maxSize: 5,
      buttonText: 'Subir reverso del DNI',
    },

    // Cambio de contraseña (sección separada)
    {
      name: 'currentPassword',
      label: 'Contraseña actual',
      type: 'password',
    },
    {
      name: 'newPassword',
      label: 'Nueva contraseña',
      type: 'password',
    },
    {
      name: 'confirmPassword',
      label: 'Confirmar nueva contraseña',
      type: 'password',
    },
  ];

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      setLoading(true);
      setAlert(null);

      const userId = (session?.user as {
        id?: string;
        username?: string;
        email?: string;
        personalInfo?: {
          firstName?: string;
          lastName?: string;
          phone?: string;
        };
      })?.id;
      if (!userId) {
        throw new Error('Usuario no identificado');
      }

      const data: MyAccountData = {
        username: String(values.username || ''),
        email: String(values.email || ''),
        firstName: String(values.firstName || ''),
        lastName: String(values.lastName || ''),
        phone: String(values.phone || ''),
        dni: String(values.dni || ''),
        address: String(values.address || ''),
        personPhone: String(values.personPhone || ''),
        personEmail: String(values.personEmail || ''),
        currentPassword: String(values.currentPassword || ''),
        newPassword: String(values.newPassword || ''),
        confirmPassword: String(values.confirmPassword || ''),
        avatar: values.avatar as File | null,
        dniCardFront: values.dniCardFront as File | null,
        dniCardRear: values.dniCardRear as File | null,
      };

      // 1. Actualizar información del usuario
      const userData = {
        username: data.username,
        email: data.email,
        personalInfo: {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        }
      };

      await updateUserProfile(userId, userData);

      // 2. Actualizar información de la persona (si existe)
      // Nota: Necesitarías obtener el personId desde el backend
      // Por ahora asumimos que existe una relación
      // const personData = {
      //   dni: data.dni,
      //   address: data.address,
      //   phone: data.personPhone,
      //   email: data.personEmail,
      // };

      // await updatePerson(personId, personData);

      // 3. Subir avatar si cambió
      if (data.avatar) {
        // await updateUserAvatar(userId, data.avatar);
        console.log('Avatar would be uploaded:', data.avatar.name);
      }

      // 4. Subir documentos DNI si cambiaron
      if (data.dniCardFront) {
        const frontResult = await uploadMultimedia(data.dniCardFront);
        console.log('DNI Front uploaded:', frontResult);
        // await updatePerson(personId, { dniCardFrontId: frontResult.id });
      }
      if (data.dniCardRear) {
        const rearResult = await uploadMultimedia(data.dniCardRear);
        console.log('DNI Rear uploaded:', rearResult);
        // await updatePerson(personId, { dniCardRearId: rearResult.id });
      }

      // 5. Cambiar contraseña (proceso independiente)
      if (data.newPassword && data.currentPassword) {
        if (data.newPassword !== data.confirmPassword) {
          throw new Error('Las contraseñas no coinciden');
        }

        await changePassword(userId, {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        });
      }

      // Actualizar la sesión si cambió el email o nombre
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          email: data.email,
          name: `${data.firstName} ${data.lastName}`,
        }
      });

      setAlert({ type: 'success', message: 'Perfil actualizado correctamente' });

      // Cerrar el dialog después de un breve delay
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error: unknown) {
      console.error('Error updating profile:', error);
      setAlert({
        type: 'error',
        message: error instanceof Error ? error.message : 'Error al actualizar el perfil'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAlert(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Mi Cuenta"
      maxWidth="md"
      fullWidth
    >
      <div className="space-y-6">
        {alert && (
          <Alert
            variant={alert.type}
            className="mb-4"
          >
            {alert.message}
          </Alert>
        )}

        {loading && !initialData.username ? (
          <div className="flex justify-center py-8">
            <CircularProgress />
          </div>
        ) : (
          <UpdateBaseForm
            fields={fields}
            initialState={initialData}
            onSubmit={handleSubmit}
            submitLabel="Guardar Cambios"
            isSubmitting={loading}
            onClose={handleClose}
          />
        )}
      </div>
    </Dialog>
  );
};

export default MyAccountDialog;