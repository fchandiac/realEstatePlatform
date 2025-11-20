'use client'

import React from 'react'
import DeleteButton from '@/components/DeleteButton/DeleteButton'
import { deleteProperty } from '@/app/actions/properties'
import { useAlert } from '@/app/hooks/useAlert'
import { useRouter } from 'next/navigation'

interface DeletePropertyButtonProps {
  propertyId: string
  propertyTitle?: string
  onSuccess?: () => void
  className?: string
  variant?: 'primary' | 'secondary' | 'outlined' | 'text'
  icon?: string
  buttonText?: string
}

export default function DeletePropertyButton({
  propertyId,
  propertyTitle,
  onSuccess,
  className,
  variant = 'text',
  icon = 'delete',
  buttonText = '',
}: DeletePropertyButtonProps) {
  const { showAlert } = useAlert()
  const router = useRouter()

  const handleDelete = async () => {
    const result = await deleteProperty(propertyId)
    
    if (result.success) {
      showAlert({
        type: 'success',
        message: 'Propiedad eliminada correctamente',
      })
      if (onSuccess) {
        onSuccess()
      } else {
        router.refresh()
      }
    } else {
      throw new Error(result.error || 'Error al eliminar la propiedad')
    }
  }

  return (
    <DeleteButton
      onDelete={handleDelete}
      title="Eliminar Propiedad"
      message={`¿Estás seguro de que deseas eliminar la propiedad "${propertyTitle || 'seleccionada'}"? Esta acción no se puede deshacer.`}
      buttonText={buttonText}
      buttonVariant={variant}
      icon={icon}
      className={`${className || ''} text-secondary`}
    />
  )
}
