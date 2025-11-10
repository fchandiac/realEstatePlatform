import React from 'react';
import { getTeamMembers } from '@/app/actions/ourTeam';
import TeamMembersDisplay from './ui/TeamMembersDisplay';

export default async function OurTeamPage() {
  const result = await getTeamMembers();
  const members = result.success && result.data ? result.data : [];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Section */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
          Nuestro Equipo
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
          Conoce a los profesionales que hacen posible nuestra visión inmobiliaria
        </p>
      </div>

      {/* Team Members Grid - Client Component */}
      <TeamMembersDisplay members={members} />
    </div>
  );
}
