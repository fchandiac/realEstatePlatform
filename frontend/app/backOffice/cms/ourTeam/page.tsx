import React from 'react';
import { getTeamMembers } from '@/app/actions/ourTeam';
import TeamMemberList from './ui/TeamMemberList';

export default async function OurTeamPage({
  searchParams,
}: {
  searchParams?: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const search = params?.search || '';
  const result = await getTeamMembers(search);
  const initialMembers = result.success && result.data ? result.data : [];

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <TeamMemberList 
        initialMembers={initialMembers}
        initialSearch={search}
      />
    </main>
  );
}
