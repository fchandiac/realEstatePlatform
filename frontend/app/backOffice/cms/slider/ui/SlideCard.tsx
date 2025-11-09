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
    <div className={`h-full bg-white rounded-lg w-full border-l-4 border-secondary border-t border-b border-r border-border shadow-lg text-left relative transition-all duration-200 flex flex-col ${isDragging ? 'opacity-50' : ''}`}>
      

      {/* Drag handle */}
      <div 
        className="absolute top-2 left-2 z-10 cursor-move touch-none bg-white rounded-full p-2 shadow-sm hover:shadow-md transition-shadow flex items-center justify-center"
        {...dragAttributes}
        {...dragListeners}
      >
        <span className="material-symbols-outlined text-gray-500 hover:text-gray-700 leading-none" style={{ fontSize: '1.5rem' }}>
          drag_indicator
        </span>
      </div>

      {/* Status indicator */}
      <div className="absolute top-2 right-2 z-10">
        <div 
          className={`w-5 h-5 rounded-full ${slide.isActive ? 'bg-green-500' : 'bg-gray-400'} border-2 border-white shadow-sm`}
          title={slide.isActive ? 'Activo' : 'Inactivo'}
        />
      </div>

      {/* Media container */}
      <div className="flex items-center justify-center w-full h-40 bg-gray-200 text-gray-400 overflow-hidden rounded-t-lg flex-shrink-0 relative">
        {slide.multimediaUrl && !mediaError ? (
          <>
            {isVideo(slide.multimediaUrl) ? (
              <video
                src={normalizeMediaUrl(slide.multimediaUrl)}
                className="w-full h-full object-cover"
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
                className="w-full h-full object-cover"
                onError={handleMediaError}
              />
            )}
          </>
        ) : (
          <span className="material-symbols-outlined text-6xl">
            {slide.multimediaUrl && isVideo(slide.multimediaUrl) ? 'videocam' : 'image'}
          </span>
        )}
      </div>

      {/* Card content */}
      <div className="p-4 pt-6 flex-1 flex flex-col">
        {/* Main content area */}
        <div className="flex-1">
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
            {slide.title}
          </h3>
          
          {/* Description */}
          {slide.description && (
            <p className="text-sm font-medium text-gray-500 mb-2 line-clamp-2">
              {slide.description}
            </p>
          )}
          
          {/* Link URL */}
          <div className="flex items-start justify-start flex-col space-y-2">
            {slide.linkUrl && (
              <div className="flex items-center space-x-1">
                <span className="material-symbols-outlined text-gray-400 text-sm">
                  link
                </span>
                <a 
                  href={slide.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-500 hover:text-blue-700 underline truncate max-w-xs transition-colors"
                  title={slide.linkUrl}
                >
                  {slide.linkUrl}
                </a>
              </div>
            )}
            
            {/* Duration and dates */}
            <div className="flex items-center space-x-4 text-gray-400 text-sm">
              {/* Duration */}
              <div className="flex items-center space-x-1">
                <span className="material-symbols-outlined text-sm">
                  schedule
                </span>
                <span>{slide.duration}s</span>
              </div>
              
              {/* Start date */}
              <div className="flex items-center space-x-1">
                <span className="material-symbols-outlined text-sm">
                  calendar_today
                </span>
                <span className="text-xs">{formatDate(slide.startDate)}</span>
              </div>
              
              {/* End date */}
              <div className="flex items-center space-x-1">
                <span className="material-symbols-outlined text-sm">
                  event
                </span>
                <span className="text-xs">{formatDate(slide.endDate)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Position badge and actions - Fixed at bottom */}
        <div className="mt-4">
          {/* Position badge centered - Above divider */}
          <div className="flex justify-center items-center mb-2">
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              Posición: {slide.order}
            </div>
          </div>
          
          {/* Divider */}
          <div className="border-t border-gray-100 pt-2">
            {/* Actions - Below divider, right aligned */}
            <div className="flex justify-end items-center gap-1">
              <IconButton
                icon="edit"
                variant="text"
                size="sm"
                onClick={() => onEdit?.(slide)}
                ariaLabel="Editar slide"
              />
              <IconButton
                icon="delete"
                variant="text"
                size="sm"
                onClick={() => onDelete?.(slide)}
                ariaLabel="Eliminar slide"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
