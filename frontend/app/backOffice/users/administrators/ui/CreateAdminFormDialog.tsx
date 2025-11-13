"use client";

import React, { useState } from 'react';
import Dialog from '@/components/Dialog/Dialog';
import Button from '@/components/Button/Button';
import TextField from '@/components/TextField/TextField';
import { createAdmin } from '@/app/actions/users';
import { useAlert } from '@/app/hooks/useAlert';
import CircularProgress from '@/components/CircularProgress/CircularProgress';

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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: any) => {
    setValues(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (formValues: AdminFormData): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (!formValues.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    } else if (formValues.username.trim().length < 3) {
      newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    }

    if (!formValues.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formValues.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }

    if (!formValues.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }

    if (!formValues.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formValues.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (!formValues.confirmPassword) {
      newErrors.confirmPassword = 'Debe confirmar la contraseña';
    } else if (formValues.password !== formValues.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showAlert({
        message: 'Por favor corrige los errores del formulario',
        type: 'error',
        duration: 4000
      });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      console.log('[CreateAdminFormDialog] Submitting with:', {
        username: values.username,
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        hasAvatar: !!values.avatarFile,
      });

      const result = await createAdmin({
        username: values.username.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        phone: values.phone.trim() || undefined,
        avatarFile: values.avatarFile || undefined,
      });

      console.log('[CreateAdminFormDialog] Result:', result);

      if (result.success) {
        showAlert({
          message: 'Administrador creado exitosamente',
          type: 'success',
          duration: 3000
        });
        handleClose();
        onSuccess?.();
      } else {
        const errorMsg = result.error || 'Error al crear administrador';
        console.error('[CreateAdminFormDialog] Creation failed:', errorMsg);
        showAlert({
          message: errorMsg,
          type: 'error',
          duration: 5000
        });
      }
    } catch (error) {
      console.error('[CreateAdminFormDialog] Exception:', error);
      const errorMsg = error instanceof Error ? error.message : 'Error interno del servidor';
      showAlert({
        message: errorMsg,
        type: 'error',
        duration: 5000
      });
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
    setErrors({});
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        showAlert({
          message: 'El archivo no debe superar 2MB',
          type: 'error',
          duration: 3000
        });
        return;
      }
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showAlert({
          message: 'El archivo debe ser una imagen',
          type: 'error',
          duration: 3000
        });
        return;
      }
      handleChange('avatarFile', file);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Crear Nuevo Administrador"
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-6 p-4">
        {/* Username */}
        <TextField
          label="Nombre de usuario"
          type="text"
          value={values.username}
          onChange={(e) => handleChange('username', e.target.value)}
          error={!!errors.username}
          helperText={errors.username}
          placeholder="ej: juan.perez"
          disabled={isSubmitting}
        />

        {/* Email */}
        <TextField
          label="Email"
          type="email"
          value={values.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
          placeholder="ej: juan@ejemplo.com"
          disabled={isSubmitting}
        />

        {/* First Name */}
        <TextField
          label="Nombre"
          type="text"
          value={values.firstName}
          onChange={(e) => handleChange('firstName', e.target.value)}
          error={!!errors.firstName}
          helperText={errors.firstName}
          placeholder="ej: Juan"
          disabled={isSubmitting}
        />

        {/* Last Name */}
        <TextField
          label="Apellido"
          type="text"
          value={values.lastName}
          onChange={(e) => handleChange('lastName', e.target.value)}
          error={!!errors.lastName}
          helperText={errors.lastName}
          placeholder="ej: Pérez"
          disabled={isSubmitting}
        />

        {/* Phone */}
        <TextField
          label="Teléfono (opcional)"
          type="tel"
          value={values.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="ej: +56 9 1234 5678"
          disabled={isSubmitting}
        />

        {/* Password */}
        <TextField
          label="Contraseña"
          type="password"
          value={values.password}
          onChange={(e) => handleChange('password', e.target.value)}
          error={!!errors.password}
          helperText={errors.password}
          placeholder="Mínimo 8 caracteres"
          disabled={isSubmitting}
        />

        {/* Confirm Password */}
        <TextField
          label="Confirmar Contraseña"
          type="password"
          value={values.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          placeholder="Repite tu contraseña"
          disabled={isSubmitting}
        />

        {/* Avatar (Optional) */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Avatar (Opcional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isSubmitting}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-primary file:text-white
              hover:file:bg-primary/90
              disabled:opacity-50"
          />
          {values.avatarFile && (
            <p className="text-xs text-muted-foreground mt-2">
              Archivo seleccionado: {values.avatarFile.name}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-6 border-t border-neutral-200">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <CircularProgress size="sm" />
                <span>Creando...</span>
              </div>
            ) : (
              'Crear Administrador'
            )}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
