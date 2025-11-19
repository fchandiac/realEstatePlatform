'use client'

import React, { useState, useEffect } from 'react'
import { TextField } from '@/components/TextField/TextField'
import Select from '@/components/Select/Select'
import CircularProgress from '@/components/CircularProgress/CircularProgress'
import Alert from '@/components/Alert/Alert'
import { Button } from '@/components/Button/Button'
import LocationPicker from '@/components/LocationPicker/LocationPicker'
import { getPropertyLocation, updatePropertyLocation } from '@/app/actions/properties'
import { getRegions, getCommunesByRegion } from '@/app/actions/locations'
import { useAlert } from '@/app/hooks/useAlert'

interface LocationSectionProps {
  propertyId: string
  title?: string
}

interface LocationData {
  state?: string
  city?: string
  address?: string
  latitude?: number
  longitude?: number
}

interface Option {
  id: string | number
  label: string
}

const LocationSection: React.FC<LocationSectionProps> = ({
  propertyId,
  title = 'Ubicación',
}) => {
  const { showAlert } = useAlert()
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<LocationData>({
    state: '',
    city: '',
    address: '',
    latitude: undefined,
    longitude: undefined,
  })
  const [regions, setRegions] = useState<Option[]>([])
  const [communes, setCommunes] = useState<Option[]>([])

  // Load location data
  useEffect(() => {
    const loadLocation = async () => {
      try {
        setLoading(true)
        console.log('📍 [LocationSection] Loading location for property:', propertyId)
        const response = await getPropertyLocation(propertyId)
        console.log('📍 [LocationSection] Response received:', {
          success: response.success,
          error: response.error,
          data: response.data,
        })
        
        if (response.success && response.data) {
          console.log('📍 [LocationSection] Setting form data:', response.data)
          setFormData({
            state: response.data.state || '',
            city: response.data.city || '',
            address: response.data.address || '',
            latitude: response.data.latitude,
            longitude: response.data.longitude,
          })
        } else {
          const errorMsg = response.error || 'Failed to load location'
          console.error('📍 [LocationSection] Error:', errorMsg)
          setError(errorMsg)
        }
      } catch (err) {
        console.error('❌ [LocationSection] Exception:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    if (propertyId) {
      loadLocation()
    }
  }, [propertyId])

  // Load regions
  useEffect(() => {
    const loadRegions = async () => {
      try {
        console.log('📍 [LocationSection] Loading regions...')
        const regionList = await getRegions()
        console.log('📍 [LocationSection] Regions loaded:', regionList)
        const options: Option[] = regionList.map((region) => ({
          id: region.id,
          label: region.name,
        }))
        console.log('📍 [LocationSection] Region options created:', options)
        setRegions(options)
      } catch (err) {
        console.error('❌ [LocationSection] Error loading regions:', err)
      }
    }
    loadRegions()
  }, [])

  // Load communes based on selected region
  useEffect(() => {
    const loadCommunes = async () => {
      if (formData.state) {
        try {
          console.log('📍 [LocationSection] Loading communes for state:', formData.state)
          const communeList = await getCommunesByRegion(formData.state)
          console.log('📍 [LocationSection] Communes loaded:', communeList)
          const options: Option[] = communeList.map((commune) => ({
            id: commune.id,
            label: commune.name,
          }))
          console.log('📍 [LocationSection] Commune options created:', options)
          setCommunes(options)
        } catch (err) {
          console.error('❌ [LocationSection] Error loading communes:', err)
        }
      } else {
        console.log('📍 [LocationSection] No state selected, clearing communes')
        setCommunes([])
      }
    }
    loadCommunes()
  }, [formData.state])

  const handleLocationChange = (coordinates: { lat: number; lng: number } | null) => {
    if (coordinates) {
      setFormData({ ...formData, latitude: coordinates.lat, longitude: coordinates.lng })
    }
  }

  const handleUpdateLocation = async () => {
    try {
      setUpdating(true)
      
      const response = await updatePropertyLocation(propertyId, formData)
      
      if (response.success) {
        showAlert({
          message: 'Ubicación actualizada exitosamente',
          type: 'success',
          duration: 3000,
        })
      } else {
        showAlert({
          message: response.error || 'Error al actualizar ubicación',
          type: 'error',
          duration: 3000,
        })
      }
    } catch (err) {
      console.error('Error updating location:', err)
      showAlert({
        message: err instanceof Error ? err.message : 'Error desconocido',
        type: 'error',
        duration: 3000,
      })
    } finally {
      setUpdating(false)
    }
  }

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

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{title}</p>
      </header>

      <div className="space-y-4">
        {/* Region */}
        <Select
          options={regions}
          placeholder="Seleccione una región"
          value={formData.state || null}
          onChange={(id) => setFormData({ ...formData, state: id?.toString() || '', city: '' })}
        />

        {/* Commune */}
        <Select
          options={communes}
          placeholder="Seleccione una comuna"
          value={formData.city || null}
          onChange={(id) => setFormData({ ...formData, city: id?.toString() || '' })}
        />

        {/* Address */}
        <TextField
          label="Dirección"
          value={formData.address || ''}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          type="text"
          placeholder="Ingrese la dirección"
          className="w-full"
        />

        {/* Coordinates Display */}
        {formData.latitude && formData.longitude && (
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Latitud"
              value={formData.latitude?.toString() || ''}
              onChange={() => {}}
              readOnly
              type="number"
              className="w-full"
            />
            <TextField
              label="Longitud"
              value={formData.longitude?.toString() || ''}
              onChange={() => {}}
              readOnly
              type="number"
              className="w-full"
            />
          </div>
        )}

        {/* Location Picker */}
        <div className="mt-6">
          <p className="text-sm font-semibold text-foreground mb-2">Ubicar en mapa</p>
          <LocationPicker
            onChange={handleLocationChange}
          />
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button
          variant="outlined"
          onClick={handleUpdateLocation}
          disabled={updating}
        >
          Actualizar
        </Button>
      </div>
    </section>
  )
}

export default LocationSection

