import React, { ReactNode } from 'react'
import Dialog from '@/components/Dialog/Dialog'
import BasicInfoSection from './components/BasicInfoSection'

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
  if (normalized.includes('list')) {
    return 'bg-amber-100 text-amber-700'
  }
  if (normalized.includes('sold') || normalized.includes('cerrada')) {
    return 'bg-rose-100 text-rose-700'
  }
  if (normalized.includes('draft') || normalized.includes('borrador')) {
    return 'bg-slate-100 text-slate-700'
  }
  return 'bg-emerald-100 text-emerald-700'
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
        <header className="w-full rounded-t-xl border-b border-border bg-gradient-to-r from-foreground/5 to-primary/10 px-6 py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Propiedad</p>
              <h3 className="text-lg font-semibold text-foreground">
                {propertyTitle || 'Sin título de propiedad'}
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {propertyStatus && (
                <span className={`rounded-full py-1 text-xs font-medium ${getStatusChipClasses(propertyStatus)}`}>
                  {propertyStatus}
                </span>
              )}
              {propertyId && (
                <p className="text-sm font-mono text-muted-foreground">ID {propertyId}</p>
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
                <BasicInfoSection />
              </div>
            )}
          </div>
        </section>
      </div>
    </Dialog>
  )
}
