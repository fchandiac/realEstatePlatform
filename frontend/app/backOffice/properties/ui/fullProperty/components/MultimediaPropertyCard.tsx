'use client';

import { useState, useEffect, useRef } from 'react';
import DotProgress from '@/components/DotProgress/DotProgress';
import IconButton from '@/components/IconButton/IconButton';
import { getMultimedia, deleteMultimedia, type MultimediaItem } from '@/app/actions/multimedia';
import { updateMainImage } from '@/app/actions/properties';
import { env } from '@/lib/env';

interface MultimediaPropertyCardProps {
  multimediaId: string;
  propertyId: string;
  mainImageUrl?: string;
  onDelete?: (id: string) => void;
  onUpdate?: (newMainImageUrl: string) => void;
}

/**
 * Normaliza URLs de multimedia a rutas absolutas
 * - Si es absoluta (http/https): devuelve tal cual
 * - Si es relativa (/uploads/...): prepend backendApiUrl
 * - Si es relativa sin /: prepend backendApiUrl + /
 */
function normalizeMediaUrl(url?: string | null): string | undefined {
  if (!url) return undefined;

  // Sanea rutas con ../
  const cleaned = url.replace('/../', '/');

  // Intenta parsear como URL absoluta
  try {
    new URL(cleaned);
    return cleaned;
  } catch {
    // No es URL absoluta, procesar como relativa
  }

  // Si empieza con /, prepend backend URL directamente
  if (cleaned.startsWith('/')) {
    return `${env.backendApiUrl}${cleaned}`;
  }

  // Si no empieza con /, asumir que es relativa sin / y agregar /
  return `${env.backendApiUrl}/${cleaned}`;
}

/**
 * Detecta si una URL es un video basándose en:
 * - type: 'VIDEO'
 * - extensión del archivo
 */
function isVideoUrl(url: string, type?: string): boolean {
  if (type === 'VIDEO') return true;

  const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv'];
  const lowerUrl = url.toLowerCase();

  return videoExtensions.some(ext => lowerUrl.includes(ext));
}

export default function MultimediaPropertyCard({
  multimediaId,
  propertyId,
  mainImageUrl,
  onDelete,
  onUpdate,
}: MultimediaPropertyCardProps) {
  const [multimedia, setMultimedia] = useState<MultimediaItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Load multimedia on mount
  useEffect(() => {
    loadMultimedia();
  }, [multimediaId]);

  const loadMultimedia = async () => {
    try {
      setLoading(true);
      const multimediaResult = await getMultimedia(multimediaId);
      if (multimediaResult.success && multimediaResult.data) {
        setMultimedia(multimediaResult.data);
      }
    } catch (error) {
      console.error('Error loading multimedia:', error);
    } finally {
      setLoading(false);
    }
  };

  // Normalizar URL usando función mejorada
  const normalizedUrl = normalizeMediaUrl(multimedia?.url);

  // Detectar si es video
  const isVideo = normalizedUrl ? isVideoUrl(normalizedUrl, multimedia?.type) : false;

  // Detectar si es la imagen principal
  const normalizedMainImageUrl = normalizeMediaUrl(mainImageUrl);
  const isMainImage = normalizedUrl && normalizedMainImageUrl && normalizedUrl === normalizedMainImageUrl;

  // Logging para debugging
  useEffect(() => {
    if (multimedia) {
      console.log('🎬 Multimedia Card Debug:', {
        originalUrl: multimedia.url,
        normalizedUrl,
        type: multimedia.type,
        isVideo,
        backendApiUrl: env.backendApiUrl,
      });
    }
  }, [multimedia, normalizedUrl, isVideo]);

  const handleSetMain = async () => {
    if (!normalizedUrl) return;
    try {
      const result = await updateMainImage(propertyId, normalizedUrl);
      if (result.success) {
        console.log('✅ Main image updated successfully');
        // Notificar al padre sobre la actualización
        onUpdate?.(normalizedUrl);
        alert('Imagen principal actualizada');
      } else {
        console.error('Error from server:', result.error);
        alert(`Error: ${result.error || 'No se pudo establecer como principal'}`);
      }
    } catch (error) {
      console.error('Error setting main image:', error);
      alert('Error al establecer como principal');
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Eliminar esta multimedia?')) return;
    try {
      setDeleting(true);
      const result = await deleteMultimedia(multimediaId);
      if (result.success) {
        onDelete?.(multimediaId);
      } else {
        alert('Error al eliminar multimedia');
      }
    } catch (error) {
      console.error('Error deleting multimedia:', error);
      alert('Error al eliminar multimedia');
    } finally {
      setDeleting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="aspect-video min-h-[7rem] rounded-lg flex items-center justify-center bg-neutral">
        <DotProgress />
      </div>
    );
  }

  // Error or no multimedia
  if (!multimedia || !normalizedUrl) {
    return (
      <div className="aspect-video min-h-[7rem] rounded-lg flex items-center justify-center bg-neutral p-4">
        <div className="text-center text-muted-foreground">
          <p className="text-xs">URL inválida</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video min-h-[7rem] rounded-lg overflow-hidden bg-neutral">
      {isVideo ? (
        // Video con autoplay, muted y loop
        <video
          ref={videoRef}
          src={normalizedUrl}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          onLoadStart={() => console.log('📹 Video loadStart:', normalizedUrl)}
          onCanPlay={() => console.log('📹 Video canPlay - autoplay should work')}
          onError={(e) => {
            const error = e.currentTarget.error;
            console.error('❌ Video error:', {
              url: normalizedUrl,
              errorCode: error?.code,
              errorMessage: error?.message,
            });
          }}
        />
      ) : (
        // Imagen
        <img
          src={normalizedUrl}
          alt={multimedia.filename || 'Multimedia'}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `data:image/svg+xml;base64,${btoa(`
              <svg width="400" height="225" viewBox="0 0 400 225" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="400" height="225" fill="#f3f4f6"/>
                <text x="200" y="112" text-anchor="middle" fill="#6b7280" font-family="Arial, sans-serif" font-size="14">Imagen no disponible</text>
              </svg>
            `)}`;
          }}
        />
      )}

      {/* Controls - siempre visibles en la esquina superior derecha */}
      <div className="absolute top-2 right-2 flex gap-2 z-10">
        {/* Star button - Set as main */}
        <IconButton
          icon={isMainImage ? "star" : "star_outline"}
          variant={isMainImage ? "containedPrimary" : "containedSecondary"}
          size="sm"
          onClick={handleSetMain}
          disabled={deleting}
          title="Establecer como principal"
        />
        
        {/* Delete button */}
        <IconButton
          icon="delete"
          variant="containedSecondary"
          size="sm"
          onClick={handleDelete}
          disabled={deleting}
          title="Eliminar"
        >
          {deleting && <DotProgress />}
        </IconButton>
      </div>
    </div>
  );
}
