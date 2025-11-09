'use client';

import { useState, useEffect, useRef } from 'react';
import DotProgress from '@/components/DotProgress/DotProgress';
import { getMultimedia, type MultimediaItem } from '@/app/actions/multimedia';

interface MultimediaPropertyCardProps {
  multimediaId: string;
  propertyId: string;
}

export default function MultimediaPropertyCard({
  multimediaId,
  propertyId,
}: MultimediaPropertyCardProps) {
  const [multimedia, setMultimedia] = useState<MultimediaItem | null>(null);
  const [loading, setLoading] = useState(true);
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

  // Build absolute URL for multimedia
  const mediaUrl = multimedia?.url.startsWith('http')
    ? multimedia.url
    : `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}${multimedia?.url || ''}`;

  // Detectar si es video
  const isVideo = 
    multimedia?.type === 'VIDEO' ||
    multimedia?.url.toLowerCase().includes('/video/') ||
    (multimedia?.url || '').toLowerCase().endsWith('.mp4') ||
    (multimedia?.url || '').toLowerCase().endsWith('.webm') ||
    (multimedia?.url || '').toLowerCase().endsWith('.mov');

  // Loading state
  if (loading) {
    return (
      <div className="aspect-video min-h-[7rem] rounded-lg flex items-center justify-center bg-neutral">
        <DotProgress />
      </div>
    );
  }

  // Error or no multimedia
  if (!multimedia) {
    return (
      <div className="aspect-video min-h-[7rem] rounded-lg flex items-center justify-center bg-neutral p-4">
        <div className="text-center text-muted-foreground">
          <p className="text-xs">No disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video min-h-[7rem] rounded-lg overflow-hidden bg-neutral group">
      {isVideo ? (
        // Video con autoplay
        <video
          ref={videoRef}
          src={mediaUrl}
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          onError={() => {
            console.error('Error cargando video:', mediaUrl);
          }}
        />
      ) : (
        // Imagen
        <img
          src={mediaUrl}
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

      {/* Filename overlay - solo visible al hover */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 max-h-20 overflow-auto break-all">
        <p className="font-mono">{multimedia.filename}</p>
      </div>
    </div>
  );
}
