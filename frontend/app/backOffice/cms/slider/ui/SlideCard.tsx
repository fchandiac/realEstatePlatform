'use client'

import { useState } from 'react'

interface SlideCardProps {
  id?: string
  title?: string
  description?: string
  multimediaUrl?: string
  linkUrl?: string
  duration?: number
  startDate?: string
  endDate?: string
  isActive?: boolean
  order?: number
}

export default function SliderCard({
  id = "1",
  title = "¡Vende tu Propiedad con Nosotros!",
  description = "Obtén la mejor valorización y vende rápido con nuestro equipo de expertos.",
  multimediaUrl,
  linkUrl = "/properties/detail/rtyfbjd6d",
  duration = 3,
  startDate = new Date().toISOString(),
  endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  isActive = true,
  order = 1
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
    <div className="bg-white rounded-lg w-full border-l-4 border-secondary border-t border-b border-r border-border shadow-lg text-left relative">
      {/* Drag handle */}
      <div className="absolute top-2 left-2 z-10 cursor-move">
        <span className="material-symbols-outlined text-gray-400 hover:text-gray-600 text-xl">
          drag_indicator
        </span>
      </div>

      {/* Status indicator */}
      <div className="absolute top-2 right-2 z-10">
        <div 
          className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`}
          title={isActive ? 'Activo' : 'Inactivo'}
        />
      </div>

      {/* Image container */}
      <div className="flex items-center justify-center w-full h-40 bg-gray-200 text-gray-400 overflow-hidden rounded-t-lg">
        {multimediaUrl && !imageError ? (
          <img
            src={multimediaUrl}
            alt={title}
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
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
          {title}
        </h3>
        
        {/* Description */}
        {description && (
          <p className="text-sm font-medium text-gray-500 mb-2 line-clamp-2">
            {description}
          </p>
        )}
        
        {/* Link URL */}
        <div className="flex items-start justify-start flex-col space-y-2">
          {linkUrl && (
            <div className="flex items-center space-x-1">
              <span className="material-symbols-outlined text-gray-400 text-sm">
                link
              </span>
              <a 
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-blue-500 hover:text-blue-700 underline truncate max-w-xs transition-colors"
                title={linkUrl}
              >
                {linkUrl}
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
              <span>{duration}s</span>
            </div>
            
            {/* Start date */}
            <div className="flex items-center space-x-1">
              <span className="material-symbols-outlined text-sm">
                calendar_today
              </span>
              <span className="text-xs">{formatDate(startDate)}</span>
            </div>
            
            {/* End date */}
            <div className="flex items-center space-x-1">
              <span className="material-symbols-outlined text-sm">
                event
              </span>
              <span className="text-xs">{formatDate(endDate)}</span>
            </div>
          </div>
        </div>
        
        {/* Order badge */}
        <div className="flex justify-center items-center mt-4">
          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            Orden: {order}
          </div>
        </div>
      </div>
    </div>
  )
}
