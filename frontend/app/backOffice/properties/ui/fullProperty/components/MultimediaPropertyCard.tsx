'use client';

import React from 'react';
import IconButton from '@/components/IconButton/IconButton';
import CircularProgress from '@/components/CircularProgress/CircularProgress';

interface MultimediaPropertyCardProps {
  multimediaItem: { id: string; url: string; type: string; filename?: string };
  propertyId: string;
  mainImageUrl?: string;
  isDeleting: boolean;
  onSetMain: (newMainUrl: string) => void;
  onDelete: (multimediaId: string) => void;
}

export default function MultimediaPropertyCard({
  multimediaItem,
  mainImageUrl,
  isDeleting,
  onSetMain,
  onDelete,
}: MultimediaPropertyCardProps) {
  const { id, url, type, filename } = multimediaItem;
  const isMain = mainImageUrl === url;
  const isImage = type?.startsWith('image/') || type === 'IMAGE' || type === 'IMG';
  const isVideo = type?.startsWith('video/') || type === 'VIDEO';

  // Determinar icono según tipo de multimedia
  const getMediaIcon = () => {
    if (isVideo) return 'play_circle';
    return 'image';
  };

  return (
    <div className="relative group rounded-lg overflow-hidden border border-border bg-neutral/50 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      {/* Miniatura de multimedia */}
      <div className="relative aspect-video bg-neutral/50 overflow-hidden flex-shrink-0">
        {isImage ? (
          <img
            src={url}
            alt={filename || 'Property media'}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback si la imagen no se puede cargar
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : isVideo ? (
          <>
            <video
              src={url}
              className="w-full h-full object-cover"
              muted
              playsInline
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
              <span className="material-symbols-outlined text-white text-5xl">
                {getMediaIcon()}
              </span>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-muted-foreground">
              {getMediaIcon()}
            </span>
          </div>
        )}

        {/* Overlay con acciones */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          {isDeleting ? (
            <CircularProgress size={24} />
          ) : (
            <>
              <IconButton
                icon="delete"
                variant="containedSecondary"
                title="Eliminar multimedia"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id);
                }}
              />

              {!isMain && isImage && (
                <IconButton
                  icon="star"
                  variant="containedSecondary"
                  title="Establecer como imagen principal"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSetMain(url);
                  }}
                />
              )}
            </>
          )}
        </div>

        {/* Badge de imagen principal */}
        {isMain && (
          <div className="absolute top-2 right-2 bg-secondary text-white rounded-full p-2 flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-sm font-bold">star</span>
          </div>
        )}

        {/* Badge de tipo de archivo */}
        <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
          {isVideo ? 'VIDEO' : 'IMAGEN'}
        </div>
      </div>

      {/* Información del archivo */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground truncate">
            {filename || 'Multimedia'}
          </p>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {url.split('/').pop() || 'Archivo'}
          </p>
        </div>

        {/* Estado */}
        <div className="flex items-center justify-center pt-2">
          {isDeleting && (
            <span className="text-xs text-red-500 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">close</span>
              Eliminando...
            </span>
          )}
          {isMain && !isDeleting && (
            <span className="text-xs text-secondary font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">star</span>
              Principal
            </span>
          )}
        </div>
      </div>
    </div>
  );
}