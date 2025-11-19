'use client'

import React, { useState, useEffect } from 'react'
import { TextField } from '@/components/TextField/TextField'
import Select from '@/components/Select/Select'
import CircularProgress from '@/components/CircularProgress/CircularProgress'
import { listPropertyTypes, getBasicPropertyInfo, updatePropertyBasic } from '@/app/actions/properties'
import { getStatusInSpanish } from '@/app/backOffice/properties/utils/statusTranslation'
import { useAlert } from '@/app/hooks/useAlert'
import { Button } from '@/components/Button/Button'

interface BasicInfoSectionProps {
  propertyId: string
  title?: string
  onUpdateSuccess?: () => void
}

const operationOptions = [
  { id: 'SALE', label: 'Venta' },
  { id: 'RENT', label: 'Arriendo' },
]

const currencyOptions = [
  { id: 'CLP', label: 'Pesos chilenos (CLP)' },
  { id: 'UF', label: 'Unidad de Fomento (UF)' },
]

const statusOptions = [
  { id: 'REQUEST', label: 'Solicitud' },
  { id: 'PRE-APPROVED', label: 'Pre-aprobada' },
  { id: 'PUBLISHED', label: 'Publicada' },
  { id: 'INACTIVE', label: 'Inactiva' },
  { id: 'SOLD', label: 'Vendida' },
  { id: 'RENTED', label: 'Arrendada' },
  { id: 'CONTRACT-IN-PROGRESS', label: 'Contrato en progreso' },
]

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  propertyId,
  title = 'Información básica',
  onUpdateSuccess,
}) => {
  const { showAlert } = useAlert()
  const [propertyTypes, setPropertyTypes] = useState<Array<{ id: string; name: string }>>([])
  const [propertyData, setPropertyData] = useState<any>(null)
  const [loadingTypes, setLoadingTypes] = useState(true)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    operationType: '',
    propertyTypeId: '',
    description: '',
    status: '',
    price: '',
    currencyPrice: '',
  })

  // Load property data
  useEffect(() => {
    const loadPropertyData = async () => {
      try {
        setLoadingData(true)
        const response = await getBasicPropertyInfo(propertyId)
        if (response.success && response.data) {
          setPropertyData(response.data)
          setSelectedStatus(response.data.status || null)
          setFormData({
            title: response.data.title || '',
            operationType: response.data.operationType || '',
            propertyTypeId: response.data.propertyType?.id || '',
            description: response.data.description || '',
            status: response.data.status || '',
            price: response.data.price?.toString() || '',
            currencyPrice: response.data.currencyPrice || '',
          })
        } else {
          setError(response.error || 'Failed to load property data')
        }
      } catch (err) {
        console.error('Error loading property data:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoadingData(false)
      }
    }

    if (propertyId) {
      loadPropertyData()
    }
  }, [propertyId])

  // Load property types
  useEffect(() => {
    const loadPropertyTypes = async () => {
      try {
        const response = await listPropertyTypes()
        setPropertyTypes(response.data || [])
      } catch (err) {
        console.error('Error loading property types:', err)
      } finally {
        setLoadingTypes(false)
      }
    }

    loadPropertyTypes()
  }, [])

  const findOption = (options: Array<{ id: string; label: string }>, value?: string) => {
    if (!value) return null
    return options.find((option) => option.id.toLowerCase() === value.toLowerCase() || option.label.toLowerCase() === value.toLowerCase())
  }

  const handleUpdateBasicInfo = async () => {
    if (!propertyId) return

    try {
      setIsUpdating(true)
      const result = await updatePropertyBasic(propertyId, {
        title: formData.title,
        operationType: formData.operationType,
        propertyTypeId: formData.propertyTypeId,
        description: formData.description,
        status: formData.status,
        price: formData.price ? parseFloat(formData.price) : undefined,
        currencyPrice: formData.currencyPrice,
      })

      if (result.success) {
        showAlert({
          message: 'Información básica actualizada correctamente',
          type: 'success',
          duration: 3000,
        })
        // Recargar data del header y basic info
        const headerResponse = await getBasicPropertyInfo(propertyId)
        if (headerResponse.success && headerResponse.data) {
          setPropertyData(headerResponse.data)
          setFormData({
            title: headerResponse.data.title || '',
            operationType: headerResponse.data.operationType || '',
            propertyTypeId: headerResponse.data.propertyType?.id || '',
            description: headerResponse.data.description || '',
            status: headerResponse.data.status || '',
            price: headerResponse.data.price?.toString() || '',
            currencyPrice: headerResponse.data.currencyPrice || '',
          })
          setSelectedStatus(headerResponse.data.status || null)
        }
        // Llamar al callback para recargar el header del FullPropertyDialog
        onUpdateSuccess?.()
      } else {
        showAlert({
          message: result.error || 'Error al actualizar información básica',
          type: 'error',
          duration: 3000,
        })
      }
    } catch (err) {
      console.error('Error updating basic info:', err)
      showAlert({
        message: 'Error al actualizar información básica',
        type: 'error',
        duration: 3000,
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Get creator user info
  const creatorUserInfo = propertyData?.creatorUser
    ? `${propertyData.creatorUser.username || propertyData.creatorUser.email}`
    : '—'

  if (loadingTypes || loadingData) {
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

  const propertyTypeOptions = propertyTypes.map((type) => ({
    id: type.id,
    label: type.name,
  }))

  return (
    <section className="space-y-4 ">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{title}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          label="Título"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Ej. Departamento con vista al parque"
          className="w-full"
        />
        <Select
          placeholder="Operación"
          options={operationOptions}
          value={formData.operationType}
          onChange={(value) => setFormData({ ...formData, operationType: value as string })}
        />
        <Select
          placeholder="Tipo de propiedad"
          options={propertyTypeOptions}
          value={formData.propertyTypeId}
          onChange={(value) => setFormData({ ...formData, propertyTypeId: value as string })}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Precio"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            type="number"
            className="w-full"
            placeholder="Ej. 50000000"
          />
          <Select
            placeholder="Moneda"
            options={currencyOptions}
            value={formData.currencyPrice}
            onChange={(value) => setFormData({ ...formData, currencyPrice: value as string })}
          />
        </div>
        <TextField
          label="Creado por"
          value={creatorUserInfo}
          onChange={() => {}}
          readOnly
        />
        <Select
          placeholder="Estado"
          options={statusOptions}
          value={formData.status}
          onChange={(value) => setFormData({ ...formData, status: value as string })}
        />
        <textarea
          className="md:col-span-2 w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          placeholder="Descripción de la propiedad"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
        />
      </div>

      <div className="flex justify-end mt-4">
        <Button variant="outlined" onClick={handleUpdateBasicInfo} disabled={isUpdating}>
          {isUpdating ? 'Actualizando...' : 'Actualizar'}
        </Button>
      </div>
    </section>
  )
}

export default BasicInfoSection