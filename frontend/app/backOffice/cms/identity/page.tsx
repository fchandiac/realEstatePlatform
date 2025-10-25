'use client'

import React, { useEffect, useState } from 'react'
import { getIdentity, updateIdentity } from '@/app/actions/identity'
import { env } from '@/lib/env'
import { TextField } from '@/components/TextField/TextField'
import { Button } from '@/components/Button/Button'
import Alert from '@/components/Alert/Alert'
import DotProgress from '@/components/DotProgress/DotProgress'
import Switch from '@/components/Switch/Switch'
import IconButton from '@/components/IconButton/IconButton'
import FontAwesome from '@/components/FontAwesome/FontAwesome'
import FileImageUploader from '@/components/FileUploader/FileImageUploader'

interface SocialMediaItem {
  url?: string
  available?: boolean
}

interface SocialMedia {
  instagram?: SocialMediaItem
  facebook?: SocialMediaItem
  linkedin?: SocialMediaItem
  youtube?: SocialMediaItem
}

interface Partnership {
  name: string
  description: string
  logoUrl?: string
}

interface Identity {
  id?: string
  name: string
  address: string
  phone: string
  mail: string
  businessHours: string
  urlLogo?: string
  socialMedia?: SocialMedia
  partnerships?: Partnership[]
}

export default function IdentityPage() {
  const [identity, setIdentity] = useState<Identity>({
    name: '',
    address: '',
    phone: '',
    mail: '',
    businessHours: '',
    socialMedia: {},
    partnerships: []
  })
  const [logoFile, setLogoFile] = useState<File[]>([])
  const [partnershipLogoFiles, setPartnershipLogoFiles] = useState<(File[] | null)[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    async function loadIdentity() {
      try {
        const data = await getIdentity()
        if (data) {
          setIdentity(data)
        }
      } catch (error) {
        setAlert({ type: 'error', message: 'Error loading identity' })
      } finally {
        setLoading(false)
      }
    }
    loadIdentity()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setAlert(null)
    try {
      const formData = new FormData()

      // Add identity data
      formData.append('name', identity.name)
      formData.append('address', identity.address)
      formData.append('phone', identity.phone)
      formData.append('mail', identity.mail)
      formData.append('businessHours', identity.businessHours)

      if (identity.socialMedia) {
        formData.append('socialMedia', JSON.stringify(identity.socialMedia))
      }

      if (identity.partnerships) {
        formData.append('partnerships', JSON.stringify(identity.partnerships))
      }

      // Add logo file
      if (logoFile.length > 0) {
        formData.append('logo', logoFile[0])
      }

      // Add partnership logo files
      partnershipLogoFiles.forEach((files, index) => {
        if (files && files.length > 0) {
          formData.append('partnershipLogos', files[0])
        }
      })

      await updateIdentity(formData)
      setAlert({ type: 'success', message: 'Identidad actualizada exitosamente' })
    } catch (error) {
      setAlert({ type: 'error', message: 'Error actualizando identidad' })
    } finally {
      setSaving(false)
    }
  }

  const updateSocialMedia = (platform: keyof SocialMedia, field: keyof SocialMediaItem, value: any) => {
    setIdentity(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: {
          ...prev.socialMedia?.[platform],
          [field]: value
        }
      }
    }))
  }

  const addPartnership = () => {
    setIdentity(prev => ({
      ...prev,
      partnerships: [...(prev.partnerships || []), { name: '', description: '', logoUrl: '' }]
    }))
    setPartnershipLogoFiles(prev => [...prev, []])
  }

  const updatePartnership = (index: number, field: keyof Partnership, value: string) => {
    setIdentity(prev => ({
      ...prev,
      partnerships: prev.partnerships?.map((p, i) => i === index ? { ...p, [field]: value } : p)
    }))
  }

  const removePartnership = (index: number) => {
    setIdentity(prev => ({
      ...prev,
      partnerships: prev.partnerships?.filter((_, i) => i !== index)
    }))
    setPartnershipLogoFiles(prev => prev.filter((_, i) => i !== index))
  }

  if (loading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <DotProgress />
    </div>
  )

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Identidad de la Empresa</h1>
        <p className="text-muted-foreground">Gestiona la información básica y redes sociales de tu empresa</p>
      </div>

      {alert && (
        <Alert variant={alert.type} className="mb-6">
          {alert.message}
        </Alert>
      )}

      <div className="space-y-8">
        {/* Información Básica */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <h2 className="text-xl font-semibold mb-4">Información Básica</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField
              label="Nombre de la Empresa"
              value={identity.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setIdentity({ ...identity, name: e.target.value })}
              required
            />
            <TextField
              label="Dirección"
              value={identity.address}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setIdentity({ ...identity, address: e.target.value })}
              required
            />
            <TextField
              label="Teléfono"
              value={identity.phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setIdentity({ ...identity, phone: e.target.value })}
              required
            />
            <TextField
              label="Correo Electrónico"
              type="email"
              value={identity.mail}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setIdentity({ ...identity, mail: e.target.value })}
              required
            />
            <div className="md:col-span-2">
              <TextField
                label="Horarios de Atención"
                value={identity.businessHours}
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setIdentity({ ...identity, businessHours: e.target.value })}
                type="textarea"
                rows={3}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Logo de la Empresa</label>
              <FileImageUploader
                uploadPath="/uploads/web/logos"
                onChange={setLogoFile}
                label="Haz clic aquí para seleccionar el logo de la empresa"
                maxFiles={1}
                accept="image/*"
                aspectRatio="square"
              />
              <small className="text-xs text-muted-foreground mt-1 block">Máximo 1 imagen permitida</small>
              {identity.urlLogo && (
                <div className="mt-2">
                  <img src={`${env.backendApiUrl}/uploads/${identity.urlLogo}`} alt="Current logo" className="h-20 w-auto" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Redes Sociales */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <h2 className="text-xl font-semibold mb-4">Redes Sociales</h2>
          <div className="space-y-4">
            {(['instagram', 'facebook', 'linkedin', 'youtube'] as const).map(platform => (
              <div key={platform} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="w-24 text-sm font-medium capitalize">{platform}</div>
                <Switch
                  checked={identity.socialMedia?.[platform]?.available || false}
                  onChange={(checked) => updateSocialMedia(platform, 'available', checked)}
                  label=""
                />
                <TextField
                  label="URL"
                  value={identity.socialMedia?.[platform]?.url || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateSocialMedia(platform, 'url', e.target.value)}
                  placeholder={`https://${platform}.com/...`}
                  className="flex-1"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Alianzas/Partners */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Alianzas y Partners</h2>
            <IconButton
              icon="add"
              variant="containedSecondary"
              onClick={addPartnership}
              ariaLabel="Agregar Alianza"
            />
          </div>
          <div className="space-y-4">
            {identity.partnerships?.map((partnership, index) => (
              <div key={index} className="p-4 bg-muted/50 rounded-lg border border-border">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-medium">Alianza {index + 1}</h3>
                  <IconButton
                    icon="delete"
                    variant="text"
                    onClick={() => removePartnership(index)}
                    className="text-red-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    label="Nombre"
                    value={partnership.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updatePartnership(index, 'name', e.target.value)}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium mb-2">Logo</label>
                    <FileImageUploader
                      uploadPath="/uploads/web/partnerships"
                      onChange={(files) => {
                        const newFiles = [...partnershipLogoFiles]
                        newFiles[index] = files
                        setPartnershipLogoFiles(newFiles)
                      }}
                      label="Haz clic aquí para seleccionar el logo de la alianza"
                      maxFiles={1}
                      accept="image/*"
                      aspectRatio="square"
                    />
                    <small className="text-xs text-muted-foreground mt-1 block">Máximo 1 imagen permitida</small>
                    {partnership.logoUrl && (
                      <div className="mt-2">
                        <img src={`${env.backendApiUrl}/uploads/${partnership.logoUrl}`} alt="Partnership logo" className="h-16 w-auto" />
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <TextField
                      label="Descripción"
                      value={partnership.description}
                      onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updatePartnership(index, 'description', e.target.value)}
                      type="textarea"
                      rows={3}
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
            {(!identity.partnerships || identity.partnerships.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                No hay alianzas registradas. Haz clic en "Agregar Alianza" para comenzar.
              </div>
            )}
          </div>
        </div>

        {/* Botón Guardar */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            variant="primary"
            size="large"
          >
            {saving ? (
              <>
                <DotProgress className="mr-2" />
                Guardando...
              </>
            ) : (
              identity.id ? 'Guardar Cambios' : 'Registrar Identidad'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
