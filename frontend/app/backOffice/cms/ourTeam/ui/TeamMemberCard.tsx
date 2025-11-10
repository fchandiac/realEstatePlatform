'use client';

import React from 'react';
import IconButton from '@/components/IconButton/IconButton';
import type { TeamMember } from '@/app/actions/ourTeam';

export interface TeamMemberCardProps {
  member: TeamMember;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TeamMemberCard({
  member,
  onEdit,
  onDelete,
}: TeamMemberCardProps) {
  const hasPhoto = member.multimediaUrl && member.multimediaUrl.trim();

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm group hover:shadow-md transition-shadow">
      {/* Foto o Icon de persona */}
      <div className="relative w-full h-48 bg-gray-200 overflow-hidden flex items-center justify-center">
        {hasPhoto ? (
          <img
            src={member.multimediaUrl}
            alt={member.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                const icon = document.createElement('span');
                icon.className = 'material-symbols-outlined text-gray-400';
                icon.style.fontSize = '80px';
                icon.textContent = 'person';
                parent.innerHTML = '';
                parent.appendChild(icon);
              }
            }}
          />
        ) : (
          <span className="material-symbols-outlined text-gray-400" style={{ fontSize: '80px' }}>
            person
          </span>
        )}

        {/* Acciones en hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          <IconButton
            icon="edit"
            onClick={onEdit}
            variant="text"
            size="lg"
            className="text-white"
          />
          <IconButton
            icon="delete"
            onClick={onDelete}
            variant="text"
            size="lg"
            className="text-white"
          />
        </div>
      </div>

      {/* Información */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
        <p className="text-sm text-primary font-medium">{member.position}</p>

        {member.mail && (
          <p className="text-xs text-muted-foreground mt-2">{member.mail}</p>
        )}

        {member.bio && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {member.bio}
          </p>
        )}
      </div>
    </div>
  );
}
