import React, { useState } from 'react'
import Dialog from '@/components/Dialog/Dialog'
import Stepper from '@/components/Stepper/Stepper'
import { TextField } from '@/components/TextField/TextField'
import Select from '@/components/Select/Select'
import AutoComplete from '@/components/AutoComplete/AutoComplete'
import FileImageUploader from '@/components/FileUploader/FileImageUploader'
import CreateLocationPicker from '@/components/LocationPicker/CreateLocationPickerWrapper'
import { Button } from '@/components/Button/Button'
import Alert from '@/components/Alert/Alert'
import DotProgress from '@/components/DotProgress/DotProgress'
import FontAwesome from '@/components/FontAwesome/FontAwesome'

// Iconos FontAwesome: usa nombres string para FontAwesome wrapper
const ICONS = {
  bed: 'bed',
  bath: 'bath',
  ruler: 'ruler-combined',
  tree: 'tree',
  car: 'car',
  layer: 'layer-group',
  calendar: 'calendar-alt',
}

const STEPS = [
  'Datos generales',
  'Ubicación',
  'Características',
  'Precio y publicación',
  'SEO',
  'Multimedia',
  'Internos',
]

interface FullPropertyDialogProps {
  property: any;
  open: boolean;
  onClose: () => void;
  onSave: (form: any) => Promise<void>;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  scroll?: 'body' | 'paper';
}

export default function FullPropertyDialog({ property, open, onClose, onSave, size = 'xl', scroll = 'body' }: FullPropertyDialogProps) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(property || {})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  // Multimedia
  const [media, setMedia] = useState(form.multimedia || [])

  // Handler para inputs
  const handleChange = (field: string, value: any) => {
    setForm({ ...form, [field]: value })
  }

  // Handler para multimedia
  const handleMediaChange = (files: File[]) => {
    setMedia(files)
    setForm({ ...form, multimedia: files })
  }

  // Guardar cambios
  const handleSave = async () => {
    setLoading(true)
    setError('')
    try {
      // Validación básica (ejemplo)
      if (!form.title || !form.status || !form.operationType) {
        setError('Completa los campos obligatorios')
        setLoading(false)
        return
      }
      await onSave(form)
      setLoading(false)
      onClose()
    } catch (e) {
      setError('Error al guardar')
      setLoading(false)
    }
  }

  // Renderiza cada paso
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="grid grid-cols-1 gap-4">
            <TextField label="Título" value={form.title || ''} onChange={e => handleChange('title', e.target.value)} required />
            <TextField label="Descripción" value={form.description || ''} onChange={e => handleChange('description', e.target.value)} rows={4} />
            <Select
              options={[{ id: 1, label: 'Publicado' }, { id: 2, label: 'Arriendo' }, { id: 3, label: 'Venta' }]}
              placeholder="Estado"
              value={form.status || null}
              onChange={id => handleChange('status', id)}
              required
            />
            <Select
              options={[{ id: 1, label: 'Venta' }, { id: 2, label: 'Arriendo' }]}
              placeholder="Operación"
              value={form.operationType || null}
              onChange={id => handleChange('operationType', id)}
              required
            />
            <Select
              options={[]}
              placeholder="Tipo de propiedad"
              value={form.propertyTypeId || null}
              onChange={id => handleChange('propertyTypeId', id)}
            />
            <AutoComplete label="Agente asignado" value={form.assignedAgentId || ''} onChange={id => handleChange('assignedAgentId', id)} options={[]} />
          </div>
        )
      case 1:
        return (
          <div className="grid grid-cols-1 gap-4">
            <TextField label="Estado" value={form.state || ''} onChange={e => handleChange('state', e.target.value)} />
            <TextField label="Ciudad" value={form.city || ''} onChange={e => handleChange('city', e.target.value)} />
            <TextField label="Dirección" value={form.address || ''} onChange={e => handleChange('address', e.target.value)} />
            <div className="flex gap-2">
              <TextField label="Latitud" value={form.latitude || ''} onChange={e => handleChange('latitude', e.target.value)} />
              <TextField label="Longitud" value={form.longitude || ''} onChange={e => handleChange('longitude', e.target.value)} />
            </div>
            <CreateLocationPicker onChange={coords => { if (coords) { handleChange('latitude', coords.lat); handleChange('longitude', coords.lng); } }} />
          </div>
        )
      case 2:
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2"><FontAwesome icon={ICONS.bed} /><TextField label="Dormitorios" type="number" value={form.bedrooms || ''} onChange={e => handleChange('bedrooms', e.target.value)} /></div>
            <div className="flex items-center gap-2"><FontAwesome icon={ICONS.bath} /><TextField label="Baños" type="number" value={form.bathrooms || ''} onChange={e => handleChange('bathrooms', e.target.value)} /></div>
            <div className="flex items-center gap-2"><FontAwesome icon={ICONS.ruler} /><TextField label="Metros construidos" type="number" value={form.builtSquareMeters || ''} onChange={e => handleChange('builtSquareMeters', e.target.value)} /></div>
            <div className="flex items-center gap-2"><FontAwesome icon={ICONS.tree} /><TextField label="Metros terreno" type="number" value={form.landSquareMeters || ''} onChange={e => handleChange('landSquareMeters', e.target.value)} /></div>
            <div className="flex items-center gap-2"><FontAwesome icon={ICONS.car} /><TextField label="Estacionamientos" type="number" value={form.parkingSpaces || ''} onChange={e => handleChange('parkingSpaces', e.target.value)} /></div>
            <div className="flex items-center gap-2"><FontAwesome icon={ICONS.layer} /><TextField label="Pisos" type="number" value={form.floors || ''} onChange={e => handleChange('floors', e.target.value)} /></div>
            <div className="flex items-center gap-2"><FontAwesome icon={ICONS.calendar} /><TextField label="Año construcción" type="number" value={form.constructionYear || ''} onChange={e => handleChange('constructionYear', e.target.value)} /></div>
          </div>
        )
      case 3:
        return (
          <div className="grid grid-cols-1 gap-4">
            <TextField label="Precio" type="number" value={form.price || ''} onChange={e => handleChange('price', e.target.value)} />
            <Select
              options={[{ id: 1, label: 'CLP' }, { id: 2, label: 'UF' }]}
              placeholder="Moneda"
              value={form.currencyPrice || null}
              onChange={id => handleChange('currencyPrice', id)}
            />
            <TextField label="Fecha publicación" type="date" value={form.publicationDate || ''} onChange={e => handleChange('publicationDate', e.target.value)} />
            <Select
              options={[{ id: 1, label: 'Publicado' }, { id: 2, label: 'Inactivo' }]}
              placeholder="Estado publicación"
              value={form.status || null}
              onChange={id => handleChange('status', id)}
            />
          </div>
        )
      case 4:
        return (
          <div className="grid grid-cols-1 gap-4">
            <TextField label="Título SEO" value={form.seoTitle || ''} onChange={e => handleChange('seoTitle', e.target.value)} />
            <TextField label="Descripción SEO" value={form.seoDescription || ''} onChange={e => handleChange('seoDescription', e.target.value)} rows={3} />
          </div>
        )
      case 5:
        return (
          <FileImageUploader
            uploadPath="/uploads/properties"
            onChange={handleMediaChange}
            maxFiles={20}
            label="Imágenes y videos"
            accept="image/*,video/*"
          />
        )
      case 6:
        return (
          <div className="grid grid-cols-1 gap-4">
            <TextField label="Notas internas" value={form.internalNotes || ''} onChange={e => handleChange('internalNotes', e.target.value)} rows={2} />
            <TextField label="Favoritos" value={form.favoritesCount || 0} readOnly onChange={() => {}} />
            <TextField label="Leads" value={form.leadsCount || 0} readOnly onChange={() => {}} />
            <TextField label="Vistas" value={form.viewsCount || 0} readOnly onChange={() => {}} />
            <TextField label="Creado" value={form.createdAt || ''} readOnly onChange={() => {}} />
            <TextField label="Modificado" value={form.updatedAt || ''} readOnly onChange={() => {}} />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title={form.title || 'Crear propiedad'} size={size} scroll={scroll}>
      {loading && <DotProgress />}
      {error && <Alert variant="error">{error}</Alert>}
      <Stepper steps={STEPS} activeStep={step} onStepChange={setStep} />
      <div className="flex-1 min-w-0">
        {renderStep()}
      </div>
      <div className="flex justify-end gap-2 mt-6">
        {step > 0 && (
          <Button variant="secondary" onClick={() => setStep(step - 1)}>Anterior</Button>
        )}
        {step < STEPS.length - 1 ? (
          <Button variant="primary" onClick={() => setStep(step + 1)}>Siguiente</Button>
        ) : (
          <Button variant="primary" onClick={handleSave}>Guardar</Button>
        )}
      </div>
    </Dialog>
  )
}
