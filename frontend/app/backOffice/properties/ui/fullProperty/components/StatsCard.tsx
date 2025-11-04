'use client';

import { TextField } from '@/components/TextField/TextField';

interface StatsCardProps {
  label: string;
  value: number;
}

export default function StatsCard({ label, value }: StatsCardProps) {
  return (
    <TextField 
      label={label} 
      value={value.toString()} 
      onChange={() => {}} 
      readOnly 
    />
  );
}
