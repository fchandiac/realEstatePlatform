'use client';

import React, { useState } from 'react';
import { TextField } from '@/components/TextField/TextField';
import { Button } from '@/components/Button/Button';
import Dialog from '@/components/Dialog/Dialog';
import CircularProgress from '@/components/CircularProgress/CircularProgress';
import Alert from '@/components/Alert/Alert';
import MultimediaUploader from '@/components/FileUploader/MultimediaUploader';
import { createTeamMember, type TeamMember } from '@/app/actions/ourTeam';

interface CreateTeamMemberDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (member: TeamMember) => void;
}

export default function CreateTeamMemberDialog({
  open,
  onClose,
  onSuccess,
}: CreateTeamMemberDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    bio: '',
    mail: '',
    phone: '',
  });
  const [photoFile, setPhotoFile] = useState<File[] >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async () => {
    setErrors([]);

    // Validaciones básicas
    if (!formData.name.trim()) {
      setErrors(['El nombre es requerido']);
      return;
    }
    if (!formData.position.trim()) {
      setErrors(['La posición es requerida']);
      return;
    }
    if (photoFile.length === 0) {
      setErrors(['La foto es requerida']);
      return;
    }

    // Validar email si se proporciona
    if (formData.mail.trim() && !formData.mail.includes('@')) {
      setErrors(['El email debe ser válido']);
      return;
    }

    setIsSubmitting(true);

    const fd = new FormData();
    fd.append('name', formData.name);
    fd.append('position', formData.position);
    fd.append('bio', formData.bio);
    if (formData.mail.trim()) {
      fd.append('mail', formData.mail);
    }
    if (formData.phone.trim()) {
      fd.append('phone', formData.phone);
    }
    fd.append('photo', photoFile[0]);

    const result = await createTeamMember(fd);
    
    if (result.success && result.data) {
      onSuccess(result.data);
      setFormData({
        name: '',
        position: '',
        bio: '',
        mail: '',
        phone: '',
      });
      setPhotoFile([]);
      onClose();
    } else {
      setErrors([result.error || 'Error al crear miembro']);
    }

    setIsSubmitting(false);
  };

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} title="Crear miembro del equipo">
      {errors.length > 0 && (
        <Alert variant="error">
          {errors.map((err, idx) => (
            <div key={idx}>{err}</div>
          ))}
        </Alert>
      )}

      <div className="space-y-4 py-4">
        <TextField
          label="Nombre"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <TextField
          label="Posición"
          value={formData.position}
          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          required
        />

        <TextField
          label="Email"
          type="email"
          value={formData.mail}
          onChange={(e) => setFormData({ ...formData, mail: e.target.value })}
        />

        <TextField
          label="Teléfono"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />

        <TextField
          label="Bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          rows={3}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Foto del miembro *
          </label>
          <MultimediaUploader
            accept="image/*"
            maxFiles={1}
            maxSize={5}
            onChange={(files: File[]) => setPhotoFile(files)}
            uploadPath="/public/web/team-members"
            buttonType="normal"
          />
          {photoFile.length > 0 && (
            <p className="text-sm text-green-600 mt-2">
              ✓ Foto seleccionada: {photoFile[0].name}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button
          onClick={handleSubmit}
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <CircularProgress size={16} className="mr-2" />
              Creando...
            </>
          ) : (
            'Crear'
          )}
        </Button>
      </div>
    </Dialog>
  );
}
