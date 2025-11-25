'use client'

import React from 'react'
import DeleteButton from '@/components/DeleteButton/DeleteButton'
import { deleteCommunityUser } from '@/app/actions/users'
import { useAlert } from '@/app/contexts/AlertContext'
import { useRouter } from 'next/navigation'

interface DeleteCommunityUserButtonProps {
  userId: string
  username?: string
  onSuccess?: () => void
  className?: string
  variant?: 'primary' | 'secondary' | 'outlined' | 'text'
  icon?: string
  buttonText?: string
}

export default function DeleteCommunityUserButton({
  userId,
  username,
  onSuccess,
  className,
  variant = 'text',
  icon = 'delete',
  buttonText = '',
}: DeleteCommunityUserButtonProps) {
  const { showAlert } = useAlert()
  const router = useRouter()

  const handleDelete = async () => {
    const result = await deleteCommunityUser(userId)
    
    if (result.success) {
      showAlert({
        type: 'success',
        message: 'Usuario de comunidad eliminado correctamente',
        duration: 3000,
      })
      if (onSuccess) {
        onSuccess()
      } else {
        router.refresh()
      }
    } else {
      throw new Error(result.error || 'Error al eliminar el usuario')
    }
  }

  return (
    <DeleteButton
      onDelete={handleDelete}
      title="Eliminar Usuario"
      message={`¿Estás seguro de que deseas eliminar el usuario "${username || 'seleccionado'}"? Esta acción no se puede deshacer.`}
      buttonText={buttonText}
      buttonVariant={variant}
      icon={icon}
      className={`${className || ''} text-red-500 hover:text-red-700`}
    />
  )
}
