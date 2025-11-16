import React, { ReactNode } from 'react'
import Dialog from '@/components/Dialog/Dialog'

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
    {
      title: 'Información básica',
      items: [
        { label: 'Operación', value: safeValue(propertyInfo?.operationType) },
        { label: 'Tipo', value: safeValue(propertyInfo?.propertyType) },
        { label: 'Precio', value: formatCurrency(propertyInfo?.price, propertyInfo?.currency) },
        {
          label: 'Publicado',
          value: propertyInfo?.publicationDate
            ? new Date(propertyInfo.publicationDate).toLocaleDateString('es-CL')
            : '—',
        },
        { label: 'Agente asignado', value: safeValue(propertyInfo?.assignedAgent) },
      ],
    },
    {
      title: 'Características',
      items: [
        { label: 'Dormitorios', value: safeValue(propertyInfo?.bedrooms) },
        { label: 'Baños', value: safeValue(propertyInfo?.bathrooms) },
        { label: 'Estacionamientos', value: safeValue(propertyInfo?.parkingSpaces) },
        { label: 'Pisos', value: safeValue(propertyInfo?.floors) },
        {
          label: 'Superficie constr.',
          value: propertyInfo?.builtSquareMeters
            ? `${propertyInfo.builtSquareMeters} m²`
            : '—',
        },
        {
          label: 'Terreno',
          value: propertyInfo?.landSquareMeters ? `${propertyInfo.landSquareMeters} m²` : '—',
        },
      ],
    },
    {
      title: 'Localización',
      items: [
        { label: 'Estado', value: safeValue(propertyInfo?.state) },
        { label: 'Ciudad', value: safeValue(propertyInfo?.city) },
        { label: 'Dirección', value: safeValue(propertyInfo?.address) },
      ],
    },
    {
      title: 'Multimedia',
      items: [
        { label: 'Archivos disponibles', value: safeValue(propertyInfo?.multimediaCount) },
        { label: 'Imagen principal', value: propertyInfo?.mainImageUrl ? 'Sí' : 'No' },
      ],
    },
    {
      title: 'SEO y marketing',
      items: [
        { label: 'Título SEO', value: safeValue(propertyInfo?.seoTitle) },
        { label: 'Descripción SEO', value: safeValue(propertyInfo?.seoDescription) },
        { label: 'Vistas', value: safeValue(propertyInfo?.viewsCount ?? 0) },
        { label: 'Leads', value: safeValue(propertyInfo?.leadsCount ?? 0) },
        { label: 'Favoritos', value: safeValue(propertyInfo?.favoritesCount ?? 0) },
        { label: 'Destacado', value: safeValue(propertyInfo?.isFeatured) },
      ],
    },
    {
      title: 'Nota interna',
      items: [
        { label: 'Comentario', value: propertyInfo?.internalNotes ?? 'No hay notas internas aún.' },
      ],
    },
  ]

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Full Property"
      size="xl"
      showCloseButton={true}
    >
      <div className="rounded-xl bg-card shadow-lg">
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
          <aside className="flex min-h-[200px] flex-col gap-3 rounded-xl border border-muted/40 bg-muted/20 py-4">
            {sidebar ?? (
              <div className="space-y-4">
                {sidebarSections.map((section) => (
                  <div key={section.title} className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {section.title}
                    </p>
                    <ul className="space-y-1">
                      {section.items.map((item) => (
                        <li key={item.label} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{item.label}</span>
                          <span className="font-semibold text-foreground">{item.value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </aside>

          <div className="flex min-h-[200px] flex-col rounded-xl border border-muted/40 bg-white/80 py-4 shadow-sm">
            {children ?? (
              <p className="text-sm text-muted-foreground">
                Agrega subcomponentes o listas detalladas en esta sección.
              </p>
            )}
          </div>
        </section>
      </div>
    </Dialog>
  )
}
