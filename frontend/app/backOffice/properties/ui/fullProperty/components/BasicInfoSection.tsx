'use client'

import React, { useState, useEffect } from 'react'
import { TextField } from '@/components/TextField/TextField'
import Select from '@/components/Select/Select'
import CircularProgress from '@/components/CircularProgress/CircularProgress'
import { listPropertyTypes } from '@/app/actions/properties'

interface BasicInfoSectionProps {
  title?: string
  subtitle?: string
  propertyInfo?: {
    title?: string
    operationType?: string
    propertyType?: string
    price?: number
    currency?: string
    publicationDate?: string
    assignedAgent?: string
    state?: string
    city?: string
    address?: string
    status?: string
  }
}

const operationOptions = [
  { id: 'venta', label: 'Venta' },
  { id: 'arriendo', label: 'Arriendo' },
  { id: 'permuta', label: 'Permuta' },
]

const currencyOptions = [
  { id: 'CLP', label: 'Pesos chilenos (CLP)' },
  { id: 'UF', label: 'Unidad de Fomento (UF)' },
]

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  title = 'Información básica',
  subtitle = 'Resumen rápido de la propiedad',
  propertyInfo,
}) => {
  const [propertyTypes, setPropertyTypes] = useState<Array<{ id: string; name: string }>>([])
  const [loadingTypes, setLoadingTypes] = useState(true)

  const info = {
    title: 'Departamento en Las Condes',
    operationType: 'venta',
    propertyType: 'departamento',
    price: 120000000,
    currency: 'CLP',
    assignedAgent: 'Camila Pérez',
    status: 'Publicada',
    ...propertyInfo,
  }

  useEffect(() => {
    const loadPropertyTypes = async () => {
      try {
        const response = await listPropertyTypes()
        setPropertyTypes(response.data || [])
      } catch (error) {
        console.error('Error loading property types:', error)
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

  if (loadingTypes) {
    return (
      <section className="flex items-center justify-center py-8">
        <CircularProgress />
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
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          label="Título"
          value={info.title}
          onChange={() => {}}
          placeholder="Ej. Departamento con vista al parque"
          className="w-full"
          readOnly
        />
        <Select
          placeholder="Operación"
          options={operationOptions}
          value={findOption(operationOptions, info.operationType)?.id ?? null}
          onChange={() => null}
        />
        <Select
          placeholder="Tipo de propiedad"
          options={propertyTypeOptions}
          value={findOption(propertyTypeOptions, info.propertyType)?.id ?? null}
          onChange={() => null}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Precio"
            value={info.price ? info.price.toString() : ''}
            onChange={() => {}}
            type="currency"
            currencySymbol="$"
            className="w-full"
            readOnly
          />
          <Select
            placeholder="Moneda"
            options={currencyOptions}
            value={findOption(currencyOptions, info.currency)?.id ?? null}
            onChange={() => null}
          />
        </div>
        <TextField
          label="Agente asignado"
          value={info.assignedAgent ?? ''}
          onChange={() => {}}
          readOnly
        />
        <TextField
          label="Estado"
          value={info.status ?? ''}
          onChange={() => {}}
          readOnly
        />
      </div>
    </section>
  )
}

export default BasicInfoSection