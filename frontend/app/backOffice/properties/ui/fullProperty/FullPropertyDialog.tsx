'use client'

import React, { ReactNode, useState, useEffect } from 'react'
import Dialog from '@/components/Dialog/Dialog'
import BasicInfoSection from './components/BasicInfoSection'
import CircularProgress from '@/components/CircularProgress/CircularProgress'
import { getPropertyHeaderInfo } from '@/app/actions/properties'

export interface FullPropertyDialogProps {
  open: boolean
  onClose: () => void
  propertyTitle?: string
  propertyStatus?: string
  propertyId?: string
  sidebar?: ReactNode
  children?: ReactNode
  propertyInfo?: {
    price?: number
    currency?: string
    operationType?: string
    propertyType?: string
    bedrooms?: number
    bathrooms?: number
    parkingSpaces?: number
    floors?: number
    builtSquareMeters?: number
    landSquareMeters?: number
    address?: string
    city?: string
    state?: string
    multimediaCount?: number
    mainImageUrl?: string
    seoTitle?: string
    seoDescription?: string
    publicationDate?: string
    isFeatured?: boolean
    viewsCount?: number
    leadsCount?: number
    favoritesCount?: number
    assignedAgent?: string
    internalNotes?: string
    changeHistory?: Array<{
      date?: string
      actor?: string
      summary?: string
    }>
  }
}

const getStatusChipClasses = (status?: string) => {
  if (!status) return 'bg-muted/70 text-muted-foreground'
  const normalized = status.toLowerCase()
  if (normalized.includes('request')) {
    return 'bg-blue-100 text-blue-700'
  }
  if (normalized.includes('published') || normalized.includes('publicada')) {
    return 'bg-emerald-100 text-emerald-700'
  }
  if (normalized.includes('draft') || normalized.includes('borrador')) {
    return 'bg-slate-100 text-slate-700'
  }
  if (normalized.includes('sold') || normalized.includes('vendida')) {
    return 'bg-rose-100 text-rose-700'
  }
  return 'bg-muted/70 text-muted-foreground'
}

const getStatusInSpanish = (status?: string): string => {
  if (!status) return '—'
  const normalized = status.toLowerCase()
  if (normalized.includes('request')) return 'Solicitud'
  if (normalized.includes('published')) return 'Publicada'
  if (normalized.includes('draft')) return 'Borrador'
  if (normalized.includes('sold')) return 'Vendida'
  return status
}

export default function FullPropertyDialog({
  open,
  onClose,
  propertyTitle,
  propertyStatus,
  propertyId,
  sidebar,
  propertyInfo,
  children,
}: FullPropertyDialogProps) {
  const [headerData, setHeaderData] = useState<any>(null)
  const [loadingHeader, setLoadingHeader] = useState(true)

  // Load header data when dialog opens
  useEffect(() => {
    if (open && propertyId) {
      const loadHeaderData = async () => {
        try {
          setLoadingHeader(true)
          const response = await getPropertyHeaderInfo(propertyId)
          if (response.success && response.data) {
            setHeaderData(response.data)
          } else {
            console.error('Failed to load header:', response.error)
          }
        } catch (error) {
          console.error('Error loading property header:', error)
        } finally {
          setLoadingHeader(false)
        }
      }

      loadHeaderData()
    } else {
      setLoadingHeader(false)
    }
  }, [open, propertyId])

  // Use header data if available, fallback to props
  const displayTitle = headerData?.title || propertyTitle || 'Sin título de propiedad'
  const displayStatus = headerData?.status || propertyStatus
  const formatCurrency = (value?: number, currency?: string) => {
    if (value == null) return '—'
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: currency || 'CLP',
      maximumFractionDigits: 0,
    }).format(value)
  }

  const safeValue = (value?: string | number | boolean | null) => {
    if (value === null || value === undefined) return '—'
    if (typeof value === 'boolean') return value ? 'Sí' : 'No'
    return value
  }

  const sidebarSections = [
    { title: 'Información básica' },
    { title: 'Características' },
    { title: 'Localización' },
    { title: 'Multimedia' },
    { title: 'SEO y marketing' },
    { title: 'Nota interna' },
  ]

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Full Property"
      size="xl"
      showCloseButton={true}
    >
      <div>
        <header className="w-full px-6 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Propiedad</p>
              {loadingHeader ? (
                <div className="flex items-center gap-2">
                  <CircularProgress size={20} />
                  <span className="text-sm text-muted-foreground">Cargando...</span>
                </div>
              ) : (
                <h3 className="text-xl font-semibold text-foreground">{displayTitle}</h3>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {displayStatus && (
                <span className={`rounded-lg px-4 py-2 text-sm font-medium ${getStatusChipClasses(displayStatus)}`}>
                  {getStatusInSpanish(displayStatus)}
                </span>
              )}
              {propertyId && (
                <p className="text-xs font-mono text-muted-foreground">ID {propertyId}</p>
              )}
            </div>
          </div>
        </header>

        <section className="grid gap-6 py-6 md:grid-cols-[260px_1fr]">
          <aside className="flex min-h-[200px] flex-col gap-4 py-4">
            {sidebar ?? (
              <nav className="space-y-2">
                {sidebarSections.map((section) => (
                  <button
                    key={section.title}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:bg-muted/50 transition-colors"
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            )}
          </aside>

          <div>
            {children ?? (
              <div>
                {propertyId && <BasicInfoSection propertyId={propertyId} />}
              </div>
            )}
          </div>
        </section>
      </div>
    </Dialog>
  )
}
