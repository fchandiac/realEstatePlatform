'use client';

import { useState, useEffect, useRef } from 'react';
import DotProgress from '@/components/DotProgress/DotProgress';
import IconButton from '@/components/IconButton/IconButton';
import Alert from '@/components/Alert/Alert';
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
 */
function normalizeMediaUrl(url?: string | null): string | undefined {
  if (!url) return undefined;

  const cleaned = url.replace('/../', '/');

  try {
    new URL(cleaned);
    return cleaned;
  } catch {
    // No es URL absoluta
  }

  if (cleaned.startsWith('/')) {
    return `${env.backendApiUrl}${cleaned}`;
  }

  return `${env.backendApiUrl}/${cleaned}`;
}

/**
 * Extrae la ruta relativa para comparación
 */
function getRelativePath(url?: string | null): string | undefined {
  if (!url) return undefined;

  try {
    const urlObj = new URL(url);
    return urlObj.pathname;
  } catch {
    return url;
  }
}

/**
 * Detecta si es video
 */
function isVideoUrl(url: string, type?: string): boolean {
  if (type === 'VIDEO') return true;

  const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv'];
  return videoExtensions.some(ext => url.toLowerCase().includes(ext));
}

/**
 * Compara dos URLs normalizando ambas primero
 * Maneja URLs absolutas y relativas de manera consistente
 */
function urlsAreEqual(url1?: string | null, url2?: string | null): boolean {
  if (!url1 || !url2) return false;

  const normalized1 = normalizeMediaUrl(url1);
  const normalized2 = normalizeMediaUrl(url2);

  return normalized1 === normalized2;
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
  const [updating, setUpdating] = useState(false);
  const [alert, setAlert] = useState<{
    variant: 'success' | 'error' | 'info' | 'warning';
    message: string;
  } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    loadMultimedia();
  }, [multimediaId]);

  const loadMultimedia = async () => {
    try {
      setLoading(true);
      const result = await getMultimedia(multimediaId);
      if (result.success && result.data) {
        setMultimedia(result.data);
      }
    } catch (error) {
      console.error('Error loading multimedia:', error);
    } finally {
      setLoading(false);
    }
  };

  const normalizedUrl = normalizeMediaUrl(multimedia?.url);
  const isVideo = normalizedUrl ? isVideoUrl(normalizedUrl, multimedia?.type) : false;
  
  // Comparar URLs normalizadas para detectar si es la imagen principal
  const isMainImage = urlsAreEqual(multimedia?.url, mainImageUrl);

  // DEBUG: Loguear para ver qué está pasando
  useEffect(() => {
    console.log(`🎬 [${multimedia?.filename}] URL Comparison:`, {
      multimediaUrl: multimedia?.url,
      mainImageUrl,
      normalizedUrl,
      normalizedMainImageUrl: normalizeMediaUrl(mainImageUrl),
      isMainImage,
    });
  }, [multimedia?.url, mainImageUrl, normalizedUrl, isMainImage]);

  const handleSetMain = async () => {
    if (!normalizedUrl || !propertyId) {
      setAlert({
        variant: 'error',
        message: 'Datos inválidos',
      });
      return;
    }

    try {
      setUpdating(true);
      
      // Llamar la acción del servidor
      const result = await updateMainImage(propertyId, normalizedUrl);

      if (result.success) {
        setAlert({
          variant: 'success',
          message: 'Imagen principal actualizada correctamente',
        });
        // Notificar al padre
        onUpdate?.(normalizedUrl);
        
        // Limpiar alerta después de 3 segundos
        setTimeout(() => setAlert(null), 3000);
      } else {
        setAlert({
          variant: 'error',
          message: result.error || 'Error al actualizar imagen principal',
        });
      }
    } catch (error) {
      console.error('Error setting main image:', error);
      setAlert({
        variant: 'error',
        message: 'Error al actualizar imagen principal',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Eliminar esta multimedia?')) return;
    
    try {
      setDeleting(true);
      const result = await deleteMultimedia(multimediaId);
      
      if (result.success) {
        setAlert({
          variant: 'success',
          message: 'Multimedia eliminada',
        });
        onDelete?.(multimediaId);
      } else {
        setAlert({
          variant: 'error',
          message: 'Error al eliminar multimedia',
        });
      }
    } catch (error) {
      console.error('Error deleting multimedia:', error);
      setAlert({
        variant: 'error',
        message: 'Error al eliminar multimedia',
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="aspect-video min-h-[7rem] rounded-lg flex items-center justify-center bg-neutral">
        <DotProgress />
      </div>
    );
  }

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
    <div className="space-y-2">
      {/* Alert */}
      {alert && (
        <Alert variant={alert.variant}>
          {alert.message}
        </Alert>
      )}

      {/* Media container */}
      <div className="relative aspect-video min-h-[7rem] rounded-lg overflow-hidden bg-neutral">
        {isVideo ? (
          <video
            ref={videoRef}
            src={normalizedUrl}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
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

        {/* Controls */}
        <div className="absolute top-2 right-2 flex gap-2 z-10">
          <IconButton
            icon={'star'}
            variant={isMainImage ? 'containedPrimary' : 'containedSecondary'}
            size="sm"
            onClick={handleSetMain}
            disabled={updating || deleting || isMainImage}
            title={isMainImage ? 'Es la imagen principal' : 'Establecer como principal'}
          />
          
          <IconButton
            icon="delete"
            variant="containedSecondary"
            size="sm"
            onClick={handleDelete}
            disabled={updating || deleting}
            title="Eliminar"
          />
        </div>
      </div>
    </div>
  );
}
