'use client';

import React, { useState } from 'react';
import { TextField } from '@/components/TextField/TextField';
import { Button } from '@/components/Button/Button';
import Dialog from '@/components/Dialog/Dialog';
import CircularProgress from '@/components/CircularProgress/CircularProgress';
import Alert from '@/components/Alert/Alert';
import FileImageUploader from '@/components/FileUploader/FileImageUploader';
import { updateTeamMember, type TeamMember } from '@/app/actions/ourTeam';

interface UpdateTeamMemberDialogProps {
  open: boolean;
  member: TeamMember | null;
  onClose: () => void;
  onSuccess: (member: TeamMember) => void;
}

export default function UpdateTeamMemberDialog({
  open,
  member,
  onClose,
  onSuccess,
}: UpdateTeamMemberDialogProps) {
  const [formData, setFormData] = useState({
    name: member?.name || '',
    position: member?.position || '',
    bio: member?.bio || '',
    mail: member?.mail || '',
    phone: member?.phone || '',
  });
  const [currentPhoto, setCurrentPhoto] = useState<string | undefined>(
    member?.multimediaUrl,
  );
  const [newPhotoFile, setNewPhotoFile] = useState<File[] >([]);
  const [showPhotoUploader, setShowPhotoUploader] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleChangePhoto = () => {
    setShowPhotoUploader(true);
    setCurrentPhoto('');
  };

  const handleKeepCurrentPhoto = () => {
    setShowPhotoUploader(false);
    setNewPhotoFile([]);
    setCurrentPhoto(member?.multimediaUrl);
  };

  const handlePhotoChange = (files: File[]) => {
    setNewPhotoFile(files);
  };

  const handleSubmit = async () => {
    if (!member) return;

    setErrors([]);

    if (!formData.name.trim()) {
      setErrors(['El nombre es requerido']);
      return;
    }
    if (!formData.position.trim()) {
      setErrors(['La posición es requerida']);
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

    if (newPhotoFile.length > 0) {
      fd.append('photo', newPhotoFile[0]);
    }

    const result = await updateTeamMember(member.id, fd);

    if (result.success && result.data) {
      onSuccess(result.data);
      onClose();
    } else {
      setErrors([result.error || 'Error al actualizar miembro']);
    }

    setIsSubmitting(false);
  };

  if (!open || !member) return null;

  const hasPhoto = currentPhoto && currentPhoto.trim();

  return (
    <Dialog open={open} onClose={onClose} title="Editar miembro del equipo">
      {errors.length > 0 && (
        <Alert variant="error">
          {errors.map((err, idx) => (
            <div key={idx}>{err}</div>
          ))}
        </Alert>
      )}

      <div className="space-y-4 py-4">
        {/* Foto actual */}
        {hasPhoto && !showPhotoUploader && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto actual
            </label>
            <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={currentPhoto}
                alt="Foto actual"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    const icon = document.createElement('span');
                    icon.className = 'material-symbols-outlined text-gray-400';
                    icon.style.fontSize = '80px';
                    icon.textContent = 'person';
                    parent.innerHTML = '';
                    parent.appendChild(icon);
                  }
                }}
              />
            </div>
            <Button
              onClick={handleChangePhoto}
              variant="secondary"
              size="sm"
              className="mt-2"
            >
              Cambiar foto
            </Button>
          </div>
        )}

        {/* Upload de foto */}
        {(showPhotoUploader || !hasPhoto) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto del miembro
            </label>
            <FileImageUploader
              accept="image/*"
              maxFiles={1}
              maxSize={5}
              onChange={handlePhotoChange}
              uploadPath="/public/web/team-members"
              buttonType="normal"
            />
            {newPhotoFile.length > 0 && (
              <p className="text-sm text-green-600 mt-2">
                ✓ Nueva foto: {newPhotoFile[0].name}
              </p>
            )}
            {hasPhoto && (
              <Button
                onClick={handleKeepCurrentPhoto}
                variant="text"
                size="sm"
                className="mt-2"
              >
                Mantener foto actual
              </Button>
            )}
          </div>
        )}

        <TextField
          label="Nombre *"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <TextField
          label="Posición *"
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
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button
          onClick={onClose}
          variant="secondary"
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <CircularProgress size={16} className="mr-2" />
              Actualizando...
            </>
          ) : (
            'Actualizar'
          )}
        </Button>
      </div>
    </Dialog>
  );
}
