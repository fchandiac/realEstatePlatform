'use client'

import React, { useState } from 'react'
import { Slide, deleteSlide } from '@/app/actions/slides'
import DeleteBaseForm from '@/components/BaseForm/DeleteBaseForm'

interface DeleteSlideFormProps {
  slide: Slide;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function DeleteSlideForm({ 
  slide, 
  onSuccess, 
  onCancel 
}: DeleteSlideFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setErrors([])

    try {
      const result = await deleteSlide(slide.id)
      
      if (result.success) {
        onSuccess?.()
      } else {
        setErrors([result.error || 'Error al eliminar el slide'])
      }
    } catch (error) {
      console.error('Error eliminando slide:', error)
      setErrors(['Error interno del servidor'])
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DeleteBaseForm
      title="Eliminar Slide"
      subtitle={`Slide: "${slide.title}"`}
      message={`¿Estás seguro de que deseas eliminar el slide "${slide.title}"? Esta acción no se puede deshacer.`}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Eliminar Slide"
      errors={errors}
      data-test-id="delete-slide-form"
    />
  )
}
