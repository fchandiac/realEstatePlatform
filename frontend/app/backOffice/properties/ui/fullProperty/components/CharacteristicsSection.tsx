'use client'

import React, { useState, useEffect } from 'react'
import { TextField } from '@/components/TextField/TextField'
import CircularProgress from '@/components/CircularProgress/CircularProgress'
import { getPropertyCharacteristics } from '@/app/actions/properties'

interface CharacteristicsSectionProps {
  propertyId: string
  title?: string
}

const CharacteristicsSection: React.FC<CharacteristicsSectionProps> = ({
  propertyId,
  title = 'Características',
}) => {
  const [characteristics, setCharacteristics] = useState<Array<{ name: string; value: number | string }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<{ [key: string]: string }>({})

  // Load characteristics
  useEffect(() => {
    const loadCharacteristics = async () => {
      try {
        setLoading(true)
        const response = await getPropertyCharacteristics(propertyId)
        if (response.success && response.data) {
          const chars = response.data.characteristics || []
          setCharacteristics(chars)
          
          // Initialize formData with characteristic values
          const initialData: { [key: string]: string } = {}
          chars.forEach((char: any) => {
            initialData[char.name] = char.value?.toString() || ''
          })
          setFormData(initialData)
        } else {
          setError(response.error || 'Failed to load characteristics')
        }
      } catch (err) {
        console.error('Error loading characteristics:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    if (propertyId) {
      loadCharacteristics()
    }
  }, [propertyId])

  if (loading) {
    return (
      <section className="flex items-center justify-center py-8">
        <CircularProgress />
      </section>
    )
  }

  if (error) {
    return (
      <section className="space-y-4">
        <header className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{title}</p>
          <p className="text-sm text-red-500">Error: {error}</p>
        </header>
      </section>
    )
  }

  if (characteristics.length === 0) {
    return (
      <section className="space-y-4">
        <header className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{title}</p>
        </header>
        <p className="text-sm text-muted-foreground">No hay características disponibles para este tipo de propiedad.</p>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{title}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {characteristics.map((char: any) => (
          <TextField
            key={char.name}
            label={char.name}
            value={formData[char.name] || ''}
            onChange={(e) => setFormData({ ...formData, [char.name]: e.target.value })}
            type="number"
            placeholder={`Ingrese ${char.name}`}
            className="w-full"
            readOnly
          />
        ))}
      </div>
    </section>
  )
}

export default CharacteristicsSection
