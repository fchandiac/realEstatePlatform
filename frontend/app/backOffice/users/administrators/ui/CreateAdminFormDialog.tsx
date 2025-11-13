"use client";

import React, { useState } from 'react';
import Dialog from '@/components/Dialog/Dialog';
import CreateBaseForm, { BaseFormField } from '@/components/BaseForm/CreateBaseForm';
import MultimediaUploader from '@/components/FileUploader/MultimediaUploader';
import { createAdmin } from '@/app/actions/users';

interface CreateAdminFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface AdminFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatarFile: File | null;
}

export default function CreateAdminFormDialog({
  open,
  onClose,
  onSuccess,
}: CreateAdminFormDialogProps) {
  const [values, setValues] = useState<AdminFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    avatarFile: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const fields: BaseFormField[] = [
    {
      name: 'username',
      label: 'Nombre de usuario',
      type: 'text',
      required: true,
      col: 1,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      col: 2,
    },
    {
      name: 'firstName',
      label: 'Nombre',
      type: 'text',
      required: true,
      col: 1,
    },
    {
      name: 'lastName',
      label: 'Apellido',
      type: 'text',
      required: true,
      col: 2,
    },
    {
      name: 'phone',
      label: 'Teléfono',
      type: 'text',
      col: 1,
    },
    {
      name: 'password',
      label: 'Contraseña',
      type: 'password',
      required: true,
      col: 1,
    },
    {
      name: 'confirmPassword',
      label: 'Confirmar contraseña',
      type: 'password',
      required: true,
      col: 2,
    },
  ];

  const handleChange = (field: string, value: any) => {
    setValues(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleAvatarChange = (files: File[]) => {
    setValues(prev => ({
      ...prev,
      avatarFile: files[0] || null,
    }));
  };

  const validateForm = (): string[] => {
    const newErrors: string[] = [];

    if (!values.username.trim()) {
      newErrors.push('El nombre de usuario es requerido');
    }

    if (!values.email.trim()) {
      newErrors.push('El email es requerido');
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      newErrors.push('El email no es válido');
    }

    if (!values.password) {
      newErrors.push('La contraseña es requerida');
    } else if (values.password.length < 8) {
      newErrors.push('La contraseña debe tener al menos 8 caracteres');
    }

    if (values.password !== values.confirmPassword) {
      newErrors.push('Las contraseñas no coinciden');
    }

    if (!values.firstName.trim()) {
      newErrors.push('El nombre es requerido');
    }

    if (!values.lastName.trim()) {
      newErrors.push('El apellido es requerido');
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors([]);

    try {
      const result = await createAdmin({
        username: values.username,
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone || undefined,
        avatarFile: values.avatarFile || undefined,
      });

      if (result.success) {
        onSuccess?.();
        handleClose();
      } else {
        setErrors([result.error || 'Error al crear administrador']);
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      setErrors(['Error interno del servidor']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setValues({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
      avatarFile: null,
    });
    setErrors([]);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Crear Nuevo Administrador"
      maxWidth="md"
    >
      <div className="space-y-6">
        <CreateBaseForm
          fields={fields}
          values={values}
          onChange={handleChange}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel="Crear Administrador"
          cancelButton={true}
          cancelButtonText="Cancelar"
          onCancel={handleClose}
          columns={2}
          errors={errors}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Avatar (opcional)
          </label>
          <MultimediaUploader
            variant="avatar"
            onChange={handleAvatarChange}
            accept="image/*"
            maxSize={2}
            uploadPath="/users/avatar"
          />
        </div>
      </div>
    </Dialog>
  );
}
