'use client'

import { useState } from 'react'
import { Slide } from '@/app/actions/slides'

interface SlideCardProps {
  slide: Slide;
  dragAttributes?: any;
  dragListeners?: any;
  isDragging?: boolean;
}

export default function SlideCard({
  slide,
  dragAttributes,
  dragListeners,
  isDragging = false
}: SlideCardProps) {
  const [imageError, setImageError] = useState(false)

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No definida'
    return new Date(dateString).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <div className={`bg-white rounded-lg w-full border-l-4 border-secondary border-t border-b border-r border-border shadow-lg text-left relative transition-all duration-200 ${isDragging ? 'opacity-50' : ''}`}>
      


      {/* Drag handle */}
      <div 
        className="absolute top-2 left-2 z-10 cursor-move touch-none"
        {...dragAttributes}
        {...dragListeners}
      >
        <span className="material-symbols-outlined text-gray-400 hover:text-gray-600 text-xl">
          drag_indicator
        </span>
      </div>

      {/* Status indicator */}
      <div className="absolute top-14 left-2 z-10">
        <div 
          className={`w-3 h-3 rounded-full ${slide.isActive ? 'bg-green-500' : 'bg-gray-400'}`}
          title={slide.isActive ? 'Activo' : 'Inactivo'}
        />
      </div>

      {/* Image container */}
      <div className="flex items-center justify-center w-full h-40 bg-gray-200 text-gray-400 overflow-hidden rounded-t-lg">
        {slide.multimediaUrl && !imageError ? (
          <img
            src={slide.multimediaUrl}
            alt={slide.title}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <span className="material-symbols-outlined text-6xl">
            image
          </span>
        )}
      </div>

      {/* Card content */}
      <div className="p-6 pt-16">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
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
        
        {/* Order badge */}
        <div className="flex justify-center items-center mt-4">
          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            Orden: {slide.order}
          </div>
        </div>
      </div>
    </div>
  )
}
