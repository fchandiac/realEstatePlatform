"use client";

import React, { useState } from 'react';
import Dialog from '@/components/Dialog/Dialog';
import CreateBaseForm, { BaseFormField, BaseFormFieldGroup } from '@/components/BaseForm/CreateBaseForm';
import { createAdmin } from '@/app/actions/users';
import { useAlert } from '@/app/hooks/useAlert';

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
  const { showAlert } = useAlert();
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

  const fields: BaseFormFieldGroup[] = [
    {
      id: 'username-field',
      columns: 1,
      gap: 4,
      fields: [
        {
          name: 'username',
          label: 'Nombre de usuario',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      id: 'email-field',
      columns: 1,
      gap: 4,
      fields: [
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          required: true,
        },
      ],
    },
    {
      id: 'firstName-field',
      columns: 1,
      gap: 4,
      fields: [
        {
          name: 'firstName',
          label: 'Nombre',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      id: 'lastName-field',
      columns: 1,
      gap: 4,
      fields: [
        {
          name: 'lastName',
          label: 'Apellido',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      id: 'phone-field',
      columns: 1,
      gap: 4,
      fields: [
        {
          name: 'phone',
          label: 'Teléfono',
          type: 'text',
        },
      ],
    },
    {
      id: 'password-field',
      columns: 1,
      gap: 4,
      fields: [
        {
          name: 'password',
          label: 'Contraseña',
          type: 'password',
          required: true,
        },
      ],
    },
    {
      id: 'confirmPassword-field',
      columns: 1,
      gap: 4,
      fields: [
        {
          name: 'confirmPassword',
          label: 'Confirmar contraseña',
          type: 'password',
          required: true,
        },
      ],
    },
    {
      id: 'avatar-field',
      columns: 1,
      gap: 4,
      fields: [
        {
          name: 'avatarFile',
          label: '',
          type: 'avatar',
          acceptedTypes: ['image/*'],
          maxSize: 2,
          uploadPath: '/users/avatar',
        },
      ],
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

  const validateForm = (formValues: AdminFormData): string[] => {
    const newErrors: string[] = [];

    if (!formValues.username.trim()) {
      newErrors.push('El nombre de usuario es requerido');
    }

    if (!formValues.email.trim()) {
      newErrors.push('El email es requerido');
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      newErrors.push('El email no es válido');
    }

    if (!formValues.firstName.trim()) {
      newErrors.push('El nombre es requerido');
    }

    if (!formValues.lastName.trim()) {
      newErrors.push('El apellido es requerido');
    }

    if (!formValues.password) {
      newErrors.push('La contraseña es requerida');
    } else if (formValues.password.length < 8) {
      newErrors.push('La contraseña debe tener al menos 8 caracteres');
    }

    if (formValues.password !== formValues.confirmPassword) {
      newErrors.push('Las contraseñas no coinciden');
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm(values);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      showAlert({
        message: 'Por favor corrige los errores del formulario',
        type: 'error',
        duration: 3000
      });
      return;
    }

    setIsSubmitting(true);
    setErrors([]);

    try {
      console.log('Submitting admin creation with values:', {
        username: values.username,
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        hasAvatar: !!values.avatarFile,
      });

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
        showAlert({
          message: 'Administrador creado exitosamente',
          type: 'success',
          duration: 3000
        });
        onSuccess?.();
        handleClose();
      } else {
        const errorMsg = result.error || 'Error al crear administrador';
        console.error('Creation failed:', errorMsg);
        showAlert({
          message: errorMsg,
          type: 'error',
          duration: 5000
        });
        setErrors([errorMsg]);
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      const errorMsg = error instanceof Error ? error.message : 'Error interno del servidor';
      showAlert({
        message: errorMsg,
        type: 'error',
        duration: 5000
      });
      setErrors([errorMsg]);
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
          errors={errors}
          validate={(vals) => validateForm(vals as AdminFormData)}
        />
      </div>
    </Dialog>
  );
}
