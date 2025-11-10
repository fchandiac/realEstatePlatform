'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TextField } from '@/components/TextField/TextField';
import IconButton from '@/components/IconButton/IconButton';
import CircularProgress from '@/components/CircularProgress/CircularProgress';
import Alert from '@/components/Alert/Alert';
import TeamMemberCard from './TeamMemberCard';
import CreateTeamMemberDialog from './CreateTeamMemberDialog';
import UpdateTeamMemberDialog from './UpdateTeamMemberDialog';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import { deleteTeamMember, type TeamMember } from '@/app/actions/ourTeam';

interface TeamMemberListProps {
  initialMembers: TeamMember[];
  initialSearch: string;
}

export default function TeamMemberList({
  initialMembers,
  initialSearch,
}: TeamMemberListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Estados
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [search, setSearch] = useState(initialSearch);
  const [isSearching, setIsSearching] = useState(false);

  // Diálogos
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Manejo de búsqueda con modificación de URL
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setSearch(value);
    setIsSearching(true);

    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    router.push(`?${params.toString()}`);
  };

  // El cambio de URL dispara re-render de page.tsx que llamará getTeamMembers nuevamente
  useEffect(() => {
    if (initialMembers) {
      setMembers(initialMembers);
      setIsSearching(false);
    }
  }, [initialMembers]);

  // Handlers de diálogos
  const handleCreateSuccess = (newMember: TeamMember) => {
    setMembers([...members, newMember]);
    setShowCreateDialog(false);
  };

  const handleUpdateSuccess = (updatedMember: TeamMember) => {
    setMembers(members.map(m => m.id === updatedMember.id ? updatedMember : m));
    setShowUpdateDialog(false);
    setSelectedMember(null);
  };

  const handleDeleteClick = async () => {
    if (!selectedMember) return;

    setIsDeleting(true);
    const result = await deleteTeamMember(selectedMember.id);

    if (result.success) {
      setMembers(members.filter(m => m.id !== selectedMember.id));
      setShowConfirmDelete(false);
      setSelectedMember(null);
    }

    setIsDeleting(false);
  };

  return (
    <div>
      {/* Header con IconButton Plus */}
      <div className="flex justify-between items-center mb-8">
       
        <IconButton
          icon="add"
          onClick={() => setShowCreateDialog(true)}
          variant="containedPrimary"
          size="lg"
        />
          {/* TextField de Búsqueda */}
      <div className="mb-6 relative">
        <TextField
          label="Buscar"
          placeholder="Buscar por nombre, posición, email..."
          value={search}
          onChange={handleSearch}
          className="w-full"
        />
        {isSearching && (
          <div className="absolute right-3 top-3">
            <CircularProgress size={20} />
          </div>
        )}
      </div>
      </div>

    

      {/* Grid de Cards */}
      {members.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              onEdit={() => {
                setSelectedMember(member);
                setShowUpdateDialog(true);
              }}
              onDelete={() => {
                setSelectedMember(member);
                setShowConfirmDelete(true);
              }}
            />
          ))}
        </div>
      ) : (
        <Alert variant="info">
          {search
            ? `No se encontraron miembros con "${search}"`
            : 'No hay miembros del equipo. Crea uno para comenzar.'}
        </Alert>
      )}

      {/* Diálogos */}
      {showCreateDialog && (
        <CreateTeamMemberDialog
          open={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {showUpdateDialog && selectedMember && (
        <UpdateTeamMemberDialog
          open={showUpdateDialog}
          member={selectedMember}
          onClose={() => {
            setShowUpdateDialog(false);
            setSelectedMember(null);
          }}
          onSuccess={handleUpdateSuccess}
        />
      )}

      {showConfirmDelete && selectedMember && (
        <ConfirmDeleteDialog
          open={showConfirmDelete}
          member={selectedMember}
          onConfirm={handleDeleteClick}
          onCancel={() => {
            setShowConfirmDelete(false);
            setSelectedMember(null);
          }}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}
