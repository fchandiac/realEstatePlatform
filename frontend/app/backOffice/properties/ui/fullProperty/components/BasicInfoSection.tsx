'use client'

import React, { useState, useEffect } from 'react'
import { TextField } from '@/components/TextField/TextField'
import Select from '@/components/Select/Select'
import CircularProgress from '@/components/CircularProgress/CircularProgress'
import { listPropertyTypes, getBasicPropertyInfo } from '@/app/actions/properties'
import { getStatusInSpanish } from '@/app/backOffice/properties/utils/statusTranslation'

interface BasicInfoSectionProps {
  propertyId: string
  title?: string
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
}) => {
  const [propertyTypes, setPropertyTypes] = useState<Array<{ id: string; name: string }>>([])
  const [propertyData, setPropertyData] = useState<any>(null)
  const [loadingTypes, setLoadingTypes] = useState(true)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  // Load property data
  useEffect(() => {
    const loadPropertyData = async () => {
      try {
        setLoadingData(true)
        const response = await getBasicPropertyInfo(propertyId)
        if (response.success && response.data) {
          setPropertyData(response.data)
          setSelectedStatus(response.data.status || null)
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
          value={propertyData?.title || ''}
          onChange={() => {}}
          placeholder="Ej. Departamento con vista al parque"
          className="w-full"
          readOnly
        />
        <Select
          placeholder="Operación"
          options={operationOptions}
          value={findOption(operationOptions, propertyData?.operationType)?.id ?? null}
          onChange={() => null}
        />
        <Select
          placeholder="Tipo de propiedad"
          options={propertyTypeOptions}
          value={findOption(propertyTypeOptions, propertyData?.propertyType?.id)?.id ?? null}
          onChange={() => null}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Precio"
            value={propertyData?.price ? propertyData.price.toString() : ''}
            onChange={() => {}}
            type="number"
            className="w-full"
            readOnly
          />
          <Select
            placeholder="Moneda"
            options={currencyOptions}
            value={findOption(currencyOptions, propertyData?.currencyPrice)?.id ?? null}
            onChange={() => null}
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
          value={propertyData?.status}
          onChange={() => null}
        />
      </div>
    </section>
  )
}

export default BasicInfoSection