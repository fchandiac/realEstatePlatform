'use server';

import { env } from '@/lib/env';

// In a real-world scenario, this would come from a database.
const regions = [
  { id: '7', name: 'Metropolitana de Santiago' },
  { id: '6', name: 'Valparaíso' },
  { id: '5', name: 'Coquimbo' },
  // Add other regions as needed
];

const communesByRegion: { [key: string]: { id: string, name: string }[] } = {
    '7': [ // Metropolitana
        { id: '701', name: 'Santiago' },
        { id: '702', name: 'Providencia' },
        { id: '703', name: 'Las Condes' },
        { id: '704', name: 'La Reina' },
        { id: '705', name: 'Ñuñoa' },
    ],
    '6': [ // Valparaíso
        { id: '601', name: 'Valparaíso' },
        { id: '602', name: 'Viña del Mar' },
        { id: '603', name: 'Concón' },
    ],
    '5': [ // Coquimbo
        { id: '501', name: 'La Serena' },
        { id: '502', name: 'Coquimbo' },
    ]
};

export interface Location {
  id: string;
  name: string;
}

export async function getRegions(): Promise<Location[]> {
  // Simulate an API call
  return Promise.resolve(regions);
}

export async function getCommunesByRegion(regionId: string): Promise<Location[]> {
  // Simulate an API call
  return Promise.resolve(communesByRegion[regionId] || []);
}
