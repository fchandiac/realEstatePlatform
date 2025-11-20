'use client'

import React, { useState, useEffect } from 'react'
import { TextField } from '@/components/TextField/TextField'
import { Button } from '@/components/Button/Button'
import CircularProgress from '@/components/CircularProgress/CircularProgress'
import { useAlert } from '@/app/hooks/useAlert'
import { getProperty, updateProperty } from '@/app/actions/properties'

interface InternalNotesSectionProps {
  propertyId: string
}

export default function InternalNotesSection({ propertyId }: InternalNotesSectionProps) {
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { showAlert } = useAlert()

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true)
        const response = await getProperty(propertyId)
        if (response.success && response.data) {
          setNotes(response.data.internalNotes || '')
        } else {
          showAlert({
            type: 'error',
            message: response.error || 'Error al cargar las notas',
          })
        }
      } catch (error) {
        console.error('Error fetching notes:', error)
        showAlert({
          type: 'error',
          message: 'Error inesperado al cargar las notas',
        })
      } finally {
        setLoading(false)
      }
    }

    if (propertyId) {
      fetchNotes()
    }
  }, [propertyId, showAlert])

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await updateProperty(propertyId, {
        internalNotes: notes,
      })

      if (response.success) {
        showAlert({
          type: 'success',
          message: 'Notas actualizadas correctamente',
        })
      } else {
        showAlert({
          type: 'error',
          message: response.error || 'Error al guardar las notas',
        })
      }
    } catch (error) {
      console.error('Error saving notes:', error)
      showAlert({
        type: 'error',
        message: 'Error inesperado al guardar',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <CircularProgress />
      </div>
    )
  }

  return (
    <section className="space-y-6 p-1">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">NOTA INTERNA</p>
      </header>

      <div className="space-y-4">
        <TextField
          label="Contenido de la nota"
          value={notes}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setNotes(e.target.value)}
          placeholder="Escribe aquí detalles importantes, recordatorios o información confidencial sobre esta propiedad..."
          rows={8}
        />

        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={loading || saving}
          >
            {saving ? 'Guardando...' : 'Guardar Nota'}
          </Button>
        </div>
      </div>
    </section>
  )
}
