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
    <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      {/* Foto o Icon de persona */}
      <div className="mb-4 overflow-hidden rounded-lg">
        <div className="w-full aspect-square bg-gray-100 overflow-hidden flex items-center justify-center">
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
                  icon.className = 'material-symbols-outlined text-muted-foreground';
                  icon.style.fontSize = '80px';
                  icon.textContent = 'person';
                  parent.innerHTML = '';
                  parent.appendChild(icon);
                }
              }}
            />
          ) : (
            <span className="material-symbols-outlined text-muted-foreground" style={{ fontSize: '80px' }}>
              person
            </span>
          )}
        </div>
      </div>

      {/* Información */}
      <div className="space-y-2 flex-1">
        <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
        <p className="text-sm text-primary font-medium">{member.position}</p>

        {member.mail && (
          <p className="text-xs text-muted-foreground">{member.mail}</p>
        )}

        {member.bio && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {member.bio}
          </p>
        )}
      </div>

      {/* Footer con acciones */}
      <div className="flex justify-between items-center gap-2 mt-4">
        <div></div>
        <div className="flex gap-2">
          <IconButton
            icon="edit"
            onClick={onEdit}
            variant="text"
          />
          <IconButton
            icon="delete"
            onClick={onDelete}
            variant="text"
            className="text-red-500"
          />
        </div>
      </div>
    </div>
  );
}
