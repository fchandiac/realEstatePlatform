'use client';

import { useState, useEffect } from 'react';
import IconButton from '@/components/IconButton/IconButton';
import CircularProgress from '@/components/CircularProgress/CircularProgress';
import { getMultimedia, deleteMultimedia, type MultimediaItem } from '@/app/actions/multimedia';
import { updateMainImage, isMultimediaMain } from '@/app/actions/properties';
import { useAuthRedirect } from '@/app/hooks/useAuthRedirect';

interface MultimediaPropertyCardProps {
  multimediaId: string;
  propertyId: string;
  isMain?: boolean;
  onDelete?: (deletedId: string) => void;
  onMainChange?: (newMainUrl: string) => void;
}

export default function MultimediaPropertyCard({
  multimediaId,
  propertyId,
  isMain = false,
  onDelete,
  onMainChange
}: MultimediaPropertyCardProps) {
  const [multimedia, setMultimedia] = useState<MultimediaItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [verifiedIsMain, setVerifiedIsMain] = useState(isMain);

  const { handleAuthError } = useAuthRedirect();

  useEffect(() => {
    loadMultimedia();
  }, [multimediaId]);

  const loadMultimedia = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getMultimedia(multimediaId);

      if (result.success && result.data) {
        setMultimedia(result.data);
        // Verificar si esta multimedia es la principal
        const mainResult = await isMultimediaMain(propertyId, multimediaId);
        if (mainResult.success) {
          setVerifiedIsMain(mainResult.isMain || false);
        }
      } else {
        setError(result.error || 'Error al cargar multimedia');
      }
    } catch (err) {
      setError('Error inesperado al cargar multimedia');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta multimedia? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      setDeleting(true);
      const result = await deleteMultimedia(multimediaId);

      if (result.success) {
        onDelete?.(multimediaId);
      } else {
        // Verificar error de autenticación
        if (handleAuthError(result.error || 'Error desconocido')) {
          return;
        }

        alert(result.error || 'Error al eliminar multimedia');
      }
    } catch (err) {
      // Verificar error de autenticación
      if (handleAuthError('Error inesperado al eliminar multimedia')) {
        return;
      }

      alert('Error inesperado al eliminar multimedia');
    } finally {
      setDeleting(false);
    }
  };

  const handleSetMain = async () => {
    if (!multimedia) return;

    try {
      const mediaUrl = multimedia.url.startsWith('http')
        ? multimedia.url
        : `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}${multimedia.url}`;

      const result = await updateMainImage(propertyId, mediaUrl);

      if (result.success) {
        // Actualizar el estado local y notificar al padre
        setVerifiedIsMain(true);
        onMainChange?.(mediaUrl);
      } else {
        // Verificar error de autenticación
        if (handleAuthError(result.error || 'Error desconocido')) {
          return;
        }

        alert(result.error || 'Error al establecer multimedia principal');
      }
    } catch (err) {
      // Verificar error de autenticación
      if (handleAuthError('Error inesperado al establecer multimedia principal')) {
        return;
      }

      alert('Error inesperado al establecer multimedia principal');
    }
  };

  if (loading) {
    return (
      <div className="aspect-video min-h-[7rem] bg-muted rounded-lg flex items-center justify-center">
        <CircularProgress size={32} />
      </div>
    );
  }

  if (error || !multimedia) {
    return (
      <div className="aspect-video min-h-[7rem] bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <span className="material-symbols-outlined text-4xl mb-2">error</span>
          <p className="text-sm">{error || 'Multimedia no disponible'}</p>
        </div>
      </div>
    );
  }

  const mediaUrl = multimedia.url.startsWith('http')
    ? multimedia.url
    : `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}${multimedia.url}`;

  return (
    <div className="relative group aspect-video min-h-[7rem] rounded-lg overflow-hidden">
      {/* Contenido multimedia */}
      {multimedia.type === 'VIDEO' ? (
        <video
          src={mediaUrl}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          autoPlay
          loop
          muted
          playsInline
          onError={(e) => {
            // Fallback para videos que no cargan
            const target = e.target as HTMLVideoElement;
            const container = target.parentElement;
            if (container) {
              container.innerHTML = `
                <div class="w-full h-full flex items-center justify-center bg-muted rounded-lg">
                  <div class="text-center">
                    <span class="material-symbols-outlined text-4xl text-muted-foreground mb-2">videocam_off</span>
                    <p class="text-sm text-muted-foreground">Video no disponible</p>
                  </div>
                </div>
              `;
            }
          }}
        />
      ) : (
        <img
          src={mediaUrl}
          alt={multimedia.filename}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          onError={(e) => {
            // Fallback a placeholder SVG simple si falla la carga
            const target = e.target as HTMLImageElement;
            target.src = `data:image/svg+xml;base64,${btoa(`
              <svg width="400" height="225" viewBox="0 0 400 225" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="400" height="225" fill="#f3f4f6"/>
                <text x="200" y="120" text-anchor="middle" fill="#6b7280" font-family="Arial, sans-serif" font-size="16" font-weight="500">Imagen no disponible</text>
              </svg>
            `)}`;
          }}
        />
      )}

      {/* Botones en esquina superior derecha */}
      <div className="absolute top-3 right-3 flex items-center gap-2">
        {/* Botón estrella para main */}
        <IconButton
          icon="star"
          variant={verifiedIsMain ? "containedPrimary" : "outlined"}
          size="sm"
          onClick={handleSetMain}
          disabled={deleting}
        />

        {/* Botón eliminar */}
        <IconButton
          icon="delete"
          variant="containedSecondary"
          size="sm"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting && <CircularProgress size={12} className="absolute" />}
        </IconButton>
      </div>

      {verifiedIsMain && (
        <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-sm px-3 py-1 rounded-full flex items-center gap-1 font-medium">
          <span className="material-symbols-outlined text-base">star</span>
          Principal
        </div>
      )}
    </div>
  );
}