'use client'

import React, { useEffect, useState } from 'react'
import { getSliders, createSlider, updateSlider, deleteSlider, reorderSliders } from '@/app/actions/sliders'
import DataGrid from '@/components/DataGrid/DataGrid'
import Dialog from '@/components/Dialog/Dialog'
import { Button } from '@/components/Button/Button'
import { TextField } from '@/components/TextField/TextField'
import FileImageUploader from '@/components/FileUploader/FileImageUploader'
import Alert from '@/components/Alert/Alert'
import CircularProgress from '@/components/CircularProgress/CircularProgress'

interface Slider {
  id: string
  title: string
  description?: string
  imageUrl?: string
  url?: string
  duration: number
  startDate?: string
  endDate?: string
  order: number
}

export default function SliderPage() {
  const [sliders, setSliders] = useState<Slider[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSlider, setEditingSlider] = useState<Slider | null>(null)
  const [form, setForm] = useState<Partial<Slider>>({})
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [alert, setAlert] = useState<{ variant: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    loadSliders()
  }, [])

  const loadSliders = async () => {
    try {
      const data = await getSliders()
      setSliders(data)
    } catch (error) {
      setAlert({ variant: 'error', message: 'Error loading sliders' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      if (editingSlider) {
        await updateSlider(editingSlider.id, form, imageFile || undefined)
        setAlert({ variant: 'success', message: 'Slider updated successfully' })
      } else {
        await createSlider(form, imageFile || undefined)
        setAlert({ variant: 'success', message: 'Slider created successfully' })
      }
      setDialogOpen(false)
      setEditingSlider(null)
      setForm({})
      setImageFile(null)
      loadSliders()
    } catch (error) {
      setAlert({ variant: 'error', message: 'Error saving slider' })
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this slider?')) {
      try {
        await deleteSlider(id)
        setAlert({ variant: 'success', message: 'Slider deleted successfully' })
        loadSliders()
      } catch (error) {
        setAlert({ variant: 'error', message: 'Error deleting slider' })
      }
    }
  }

  const handleMoveUp = async (index: number) => {
    if (index === 0) return
    const newSliders = [...sliders]
    const temp = newSliders[index]
    newSliders[index] = newSliders[index - 1]
    newSliders[index - 1] = temp
    setSliders(newSliders)
    const ids = newSliders.map(s => s.id)
    try {
      await reorderSliders(ids)
    } catch (error) {
      setAlert({ variant: 'error', message: 'Error reordering sliders' })
      loadSliders() // Revert on error
    }
  }

  const handleMoveDown = async (index: number) => {
    if (index === sliders.length - 1) return
    const newSliders = [...sliders]
    const temp = newSliders[index]
    newSliders[index] = newSliders[index + 1]
    newSliders[index + 1] = temp
    setSliders(newSliders)
    const ids = newSliders.map(s => s.id)
    try {
      await reorderSliders(ids)
    } catch (error) {
      setAlert({ variant: 'error', message: 'Error reordering sliders' })
      loadSliders() // Revert on error
    }
  }

  if (loading) return <CircularProgress />

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Slider Management</h1>
        <Button onClick={() => setDialogOpen(true)} variant="primary">
          Add Slider
        </Button>
      </div>
      {alert && (
        <Alert variant={alert.variant} className="mb-4">
          {alert.message}
        </Alert>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sliders.map((slider, index) => (
          <div key={slider.id} className="bg-white rounded-lg border border-gray-300 p-4 relative">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">Order: {slider.order}</span>
              <div className="flex space-x-1">
                <Button size="small" onClick={() => handleMoveUp(index)} disabled={index === 0}>
                  ↑
                </Button>
                <Button size="small" onClick={() => handleMoveDown(index)} disabled={index === sliders.length - 1}>
                  ↓
                </Button>
              </div>
            </div>
            {slider.imageUrl && (
              <img src={slider.imageUrl} alt={slider.title} className="w-full h-32 object-cover mb-4 rounded" />
            )}
            <h3 className="font-bold text-lg mb-2">{slider.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{slider.description}</p>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <i className="fas fa-link mr-1"></i>
              {slider.url}
            </div>
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <i className="fas fa-clock mr-1"></i>
              {slider.duration}s
            </div>
            <div className="flex justify-end space-x-2">
              <Button size="small" onClick={() => { setEditingSlider(slider); setForm(slider); setDialogOpen(true) }}>
                <i className="fas fa-edit"></i>
              </Button>
              <Button size="small" color="error" onClick={() => handleDelete(slider.id)}>
                <i className="fas fa-trash"></i>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onClose={() => { setDialogOpen(false); setEditingSlider(null); setForm({}); setImageFile(null) }} size="lg">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">{editingSlider ? 'Edit Slider' : 'Add Slider'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <TextField
              label="Title"
              value={form.title || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, title: e.target.value })}
              required
            />
            <TextField
              label="Description"
              value={form.description || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, description: e.target.value })}
            />
            <TextField
              label="URL"
              value={form.url || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, url: e.target.value })}
            />
            <TextField
              label="Duration (seconds)"
              type="number"
              value={form.duration?.toString() || '3'}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, duration: parseInt(e.target.value) })}
            />
            <TextField
              label="Start Date"
              type="datetime-local"
              value={form.startDate || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, startDate: e.target.value })}
            />
            <TextField
              label="End Date"
              type="datetime-local"
              value={form.endDate || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, endDate: e.target.value })}
            />
          </div>
          <FileImageUploader
            uploadPath="/uploads/web/sliders"
            onChange={(files: File[]) => setImageFile(files[0] || null)}
            accept="image/*"
            maxFiles={1}
          />
          {form.imageUrl && !imageFile && (
            <img src={form.imageUrl} alt="Current" className="w-32 h-32 object-cover mt-4" />
          )}
          <div className="flex justify-end mt-4 space-x-2">
            <Button onClick={() => { setDialogOpen(false); setEditingSlider(null); setForm({}); setImageFile(null) }}>
              Cancel
            </Button>
            <Button onClick={handleSave} variant="primary">
              {editingSlider ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}