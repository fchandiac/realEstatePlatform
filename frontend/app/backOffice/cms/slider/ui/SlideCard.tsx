'use client'

import { useState } from 'react'
import { Slide } from '@/app/actions/slides'
import IconButton from '@/components/IconButton/IconButton'
import { env } from '@/lib/env'

const normalizeMediaUrl = (u?: string | null): string | undefined => {
  if (!u) return undefined
  const trimmed = u.trim()
  try {
    // If it's already absolute, return as is
    new URL(trimmed)
    return trimmed
  } catch {
    // If it's a relative path (starts with /), prefix backend base URL
    if (trimmed.startsWith('/')) {
      // Ensure backend URL has no trailing slash
      return `${env.backendApiUrl.replace(/\/$/, '')}${trimmed}`
    }
    // Otherwise, return as-is
    return trimmed
  }
}

interface SlideCardProps {
  slide: Slide;
  dragAttributes?: any;
  dragListeners?: any;
  isDragging?: boolean;
  onDelete?: (slide: Slide) => void;
  onEdit?: (slide: Slide) => void;
}

export default function SlideCard({
  slide,
  dragAttributes,
  dragListeners,
  isDragging = false,
  onDelete,
  onEdit
}: SlideCardProps) {
  const [mediaError, setMediaError] = useState(false)

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No definida'
    return new Date(dateString).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const handleMediaError = () => {
    setMediaError(true)
  }

  // Detectar si es video MP4
  const isVideo = (url: string) => {
    return /\.mp4$/i.test(url)
  }

  return (
    <div
      className={`bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow flex flex-col h-full relative ${isDragging ? 'opacity-50' : ''}`}
    >
      {/* Drag handle - Absolute positioned overlay */}
      <div 
        className="absolute top-3 left-3 z-10 cursor-move border touch-none bg-white rounded-full p-2 shadow-sm hover:shadow-md transition-shadow flex items-center justify-center"
        {...dragAttributes}
        {...dragListeners}
        title="Arrastra para reordenar"
      >
        <span className="material-symbols-outlined  text-muted-foreground leading-none">
          drag_indicator
        </span>
      </div>

      {/* Status indicator - Absolute positioned badge */}
      <div className="absolute top-3 right-3 z-10">
        <div 
          className={`w-3 h-3 rounded-full border-2 border-white shadow-sm ${slide.isActive ? 'bg-green-500' : 'bg-gray-400'}`}
          title={slide.isActive ? 'Activo' : 'Inactivo'}
        />
      </div>

      {/* Media container - Standard image ratio */}
      <div className="mb-4 overflow-hidden rounded-lg">
        {slide.multimediaUrl && !mediaError ? (
          <>
            {isVideo(slide.multimediaUrl) ? (
              <video
                src={normalizeMediaUrl(slide.multimediaUrl)}
                className="w-full aspect-video object-cover"
                muted
                autoPlay
                loop
                playsInline
                onError={handleMediaError}
              />
            ) : (
              <img
                src={normalizeMediaUrl(slide.multimediaUrl)}
                alt={slide.title}
                className="w-full aspect-video object-cover"
                onError={handleMediaError}
              />
            )}
          </>
        ) : (
          <div className="w-full aspect-video bg-border rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-muted-foreground" style={{ fontSize: '40px' }}>
              {slide.multimediaUrl && isVideo(slide.multimediaUrl) ? 'videocam' : 'image_not_supported'}
            </span>
          </div>
        )}
      </div>

      {/* Content area - flex-1 to push actions to bottom */}
      <div className="space-y-2 flex-1">
        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground line-clamp-2">
          {slide.title}
        </h3>
        
        {/* Description */}
        {slide.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {slide.description}
          </p>
        )}
        
        {/* Link URL */}
        {slide.linkUrl && (
          <div className="flex items-center gap-1 text-sm">
            <span className="material-symbols-outlined text-muted-foreground text-base">
              link
            </span>
            <a 
              href={slide.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 underline truncate transition-colors"
              title={slide.linkUrl}
            >
              {slide.linkUrl}
            </a>
          </div>
        )}
        
        {/* Metadata - Duration and dates */}
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground pt-2">
          {/* Duration */}
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-base">
              schedule
            </span>
            <span>{slide.duration}s</span>
          </div>
          
          {/* Start date */}
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-base">
              calendar_today
            </span>
            <span>{formatDate(slide.startDate)}</span>
          </div>
          
          {/* End date */}
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-base">
              event
            </span>
            <span>{formatDate(slide.endDate)}</span>
          </div>
        </div>
      </div>

      {/* Actions footer - Dual zone pattern */}
      <div className="flex justify-between items-center gap-2 mt-4">
        {/* Left zone: Position badge */}
        <div className="text-xs border border-border text-muted-foreground px-3 py-1.5 rounded-full bg-card">
          Pos: {slide.order}
        </div>

        {/* Right zone: Action buttons */}
        <div className="flex gap-2">
          <IconButton
            icon="edit"
            variant="text"
            onClick={() => onEdit?.(slide)}
            aria-label="Editar slide"
          />
          <IconButton
            icon="delete"
            variant="text"
            onClick={() => onDelete?.(slide)}
            className="text-red-500"
            aria-label="Eliminar slide"
          />
        </div>
      </div>
    </div>
  )
}
