'use client'

import React, { useState } from 'react'
import { env } from '@/lib/env';
import { AgentType } from './types'
import IconButton from '@/components/IconButton/IconButton'
import { useAlert } from '@/app/hooks/useAlert'

interface AgentCardProps {
  agent: AgentType
  onEdit: (agent: AgentType) => void
  onDelete: (agent: AgentType) => void
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-emerald-600'
    case 'INACTIVE':
      return 'bg-amber-600'
    case 'VACATION':
      return 'bg-sky-600'
    case 'LEAVE':
      return 'bg-rose-600'
    default:
      return 'bg-slate-600'
  }
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    ACTIVE: 'Activo',
    INACTIVE: 'Inactivo',
    VACATION: 'Vacaciones',
    LEAVE: 'Permiso',
  }
  return labels[status] || status
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onEdit, onDelete }) => {
  const { showAlert } = useAlert()

  const [showAvatarDialog, setShowAvatarDialog] = useState(false)
  const fullName = agent.personalInfo
    ? `${agent.personalInfo.firstName || ''} ${agent.personalInfo.lastName || ''}`.trim()
    : agent.username
  // Normalizar avatar URL como en AdminCard
  const avatarUrl = agent.personalInfo?.avatarUrl
    ? (agent.personalInfo.avatarUrl.startsWith('http')
        ? agent.personalInfo.avatarUrl
        : `${env.backendApiUrl}${agent.personalInfo.avatarUrl}`)
    : undefined

  return (
    <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      {/* Avatar and Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative flex-shrink-0 mx-auto">
          <div className="h-12 w-12 rounded-full bg-muted border-2 border-secondary flex items-center justify-center overflow-hidden">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={`Avatar ${fullName}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="material-symbols-outlined text-secondary" style={{ fontSize: '2rem' }}>person</span>
            )}
          </div>
          {!avatarUrl && (
            <IconButton
              icon="add"
              variant="containedPrimary"
              size="xs"
              className="absolute bottom-0 right-2 z-10"
              aria-label="Agregar avatar"
              title="Agregar avatar"
              onClick={() => setShowAvatarDialog(true)}
            />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">{fullName}</h3>
          <p className="text-sm text-muted-foreground">@{agent.username}</p>
              {/* Diálogo para subir avatar */}
              {/* Reemplaza por el componente que uses para subir avatar de agentes */}
              {/* <UploadUserAvatarDialog
                open={showAvatarDialog}
                onClose={() => setShowAvatarDialog(false)}
                userId={agent.id}
                currentAvatarUrl={agent.personalInfo?.avatarUrl || undefined}
              /> */}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2 flex-1">
        <div>
          <p className="text-xs text-muted-foreground">Email</p>
          <p className="text-sm text-foreground break-all">{agent.email}</p>
        </div>

        {agent.personalInfo?.phone && (
          <div>
            <p className="text-xs text-muted-foreground">Teléfono</p>
            <p className="text-sm text-foreground">{agent.personalInfo.phone}</p>
          </div>
        )}

        <div>
          <p className="text-xs text-muted-foreground">Estado</p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`${getStatusColor(agent.status)} text-white text-xs px-3 py-1 rounded-full`}
            >
              {getStatusLabel(agent.status)}
            </span>
          </div>
        </div>

        {agent.lastLogin && (
          <div>
            <p className="text-xs text-muted-foreground">Último acceso</p>
            <p className="text-sm text-foreground">
              {new Date(agent.lastLogin).toLocaleDateString('es-CL')}
            </p>
          </div>
        )}
      </div>

      {/* Actions Footer */}
      <div className="flex justify-between items-center gap-2 mt-4">
        <p className="text-xs text-muted-foreground">
          Creado: {new Date(agent.createdAt).toLocaleDateString('es-CL')}
        </p>
        <div className="flex gap-2">
          <IconButton
            icon="edit"
            variant="text"
            onClick={() => onEdit(agent)}
            title="Editar agente"
          />
          <IconButton
            icon="delete"
            variant="text"
            className="text-red-500 hover:text-red-600"
            onClick={() => onDelete(agent)}
            title="Eliminar agente"
          />
        </div>
      </div>
    </div>
  )
}

export default AgentCard
