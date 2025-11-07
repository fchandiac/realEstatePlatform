'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import IconButton from '@/components/IconButton/IconButton';
import CircularProgress from '@/components/CircularProgress/CircularProgress';
import { getMultimedia, deleteMultimedia, type MultimediaItem } from '@/app/actions/multimedia';
import { updateMainImage } from '@/app/actions/properties';
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
    <div className="relative group aspect-video min-h-[7rem] bg-muted rounded-lg overflow-hidden">
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
        <Image
          src={mediaUrl}
          alt={multimedia.filename}
          fill
          className="object-cover transition-transform duration-200 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onError={(e) => {
            // Fallback a placeholder SVG si falla la carga
            const target = e.target as HTMLImageElement;
            target.src = `data:image/svg+xml;base64,${btoa(`
              <svg width="400" height="225" viewBox="0 0 400 225" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="400" height="225" fill="#f3f4f6"/>
                <path d="M160 112.5C160 104.492 166.492 98 174.5 98H225.5C233.508 98 240 104.492 240 112.5V137.5C240 145.508 233.508 152 225.5 152H174.5C166.492 152 160 145.508 160 137.5V112.5Z" fill="#d1d5db"/>
                <circle cx="200" cy="125" r="15" fill="#9ca3af"/>
                <path d="M185 125L195 135L215 115" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <text x="200" y="180" text-anchor="middle" fill="#6b7280" font-family="Arial, sans-serif" font-size="14">Imagen no disponible</text>
              </svg>
            `)}`;
          }}
        />
      )}

      {/* Indicador de carga sutil */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Overlay con acciones */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 rounded-lg">
        {/* Botón estrella para main */}
        <IconButton
          icon="star"
          variant={isMain ? "containedPrimary" : "containedSecondary"}
          size="md"
          className="bg-white/20 hover:bg-white/30"
          onClick={handleSetMain}
          disabled={deleting}
        />

        {/* Botón eliminar */}
        <IconButton
          icon="delete"
          variant="containedSecondary"
          size="md"
          className="bg-red-500/80 hover:bg-red-600"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting && <CircularProgress size={16} className="absolute" />}
        </IconButton>
      </div>

      {/* Indicadores */}
      <div className="absolute top-3 left-3 bg-black/80 text-white text-sm px-3 py-1 rounded-full font-medium">
        {multimedia.type === 'VIDEO' ? '🎥' : '📷'}
      </div>

      {isMain && (
        <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-sm px-3 py-1 rounded-full flex items-center gap-1 font-medium">
          <span className="material-symbols-outlined text-base">star</span>
          Principal
        </div>
      )}
    </div>
  );
}