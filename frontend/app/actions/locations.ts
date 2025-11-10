'use server';

import { env } from '@/lib/env';

// In a real-world scenario, this would come from a database.
const regions = [
  { id: '1', name: 'Arica y Parinacota' },
  { id: '2', name: 'Tarapacá' },
  { id: '3', name: 'Antofagasta' },
  { id: '4', name: 'Atacama' },
  { id: '5', name: 'Coquimbo' },
  { id: '6', name: 'Valparaíso' },
  { id: '7', name: 'Metropolitana de Santiago' },
  { id: '8', name: "O'Higgins" },
  { id: '9', name: 'Maule' },
  { id: '10', name: 'Ñuble' },
  { id: '11', name: 'Biobío' },
  { id: '12', name: 'La Araucanía' },
  { id: '13', name: 'Los Ríos' },
  { id: '14', name: 'Los Lagos' },
  { id: '15', name: 'Aysén' },
  { id: '16', name: 'Magallanes' },
];

const communesByRegion: { [key: string]: { id: string, name: string }[] } = {
    '1': [ // Arica y Parinacota
        { id: '101', name: 'Arica' },
        { id: '102', name: 'Camarones' },
        { id: '103', name: 'Putre' },
    ],
    '2': [ // Tarapacá
        { id: '201', name: 'Iquique' },
        { id: '202', name: 'Alto Hospicio' },
        { id: '203', name: 'Pozo Almonte' },
    ],
    '3': [ // Antofagasta
        { id: '301', name: 'Antofagasta' },
        { id: '302', name: 'Calama' },
        { id: '303', name: 'Tocopilla' },
    ],
    '4': [ // Atacama
        { id: '401', name: 'Copiapó' },
        { id: '402', name: 'Caldera' },
        { id: '403', name: 'Vallenar' },
    ],
    '5': [ // Coquimbo
        { id: '501', name: 'La Serena' },
        { id: '502', name: 'Coquimbo' },
        { id: '503', name: 'Ovalle' },
    ],
    '6': [ // Valparaíso
        { id: '601', name: 'Valparaíso' },
        { id: '602', name: 'Viña del Mar' },
        { id: '603', name: 'Concón' },
        { id: '604', name: 'Quilpué' },
    ],
    '7': [ // Metropolitana
        { id: '701', name: 'Santiago' },
        { id: '702', name: 'Providencia' },
        { id: '703', name: 'Las Condes' },
        { id: '704', name: 'La Reina' },
        { id: '705', name: 'Ñuñoa' },
        { id: '706', name: 'Macul' },
        { id: '707', name: 'Peñalolén' },
    ],
    '8': [ // O'Higgins
        { id: '801', name: 'Rancagua' },
        { id: '802', name: 'Rengo' },
        { id: '803', name: 'San Vicente' },
    ],
    '9': [ // Maule
        { id: '901', name: 'Talca' },
        { id: '902', name: 'Curicó' },
        { id: '903', name: 'Linares' },
    ],
    '10': [ // Ñuble
        { id: '1001', name: 'Chillán' },
        { id: '1002', name: 'Chillán Viejo' },
        { id: '1003', name: 'Bulnes' },
    ],
    '11': [ // Biobío
        { id: '1101', name: 'Concepción' },
        { id: '1102', name: 'Talcahuano' },
        { id: '1103', name: 'Chiguayante' },
        { id: '1104', name: 'San Pedro de la Paz' },
    ],
    '12': [ // La Araucanía
        { id: '1201', name: 'Temuco' },
        { id: '1202', name: 'Padre Las Casas' },
        { id: '1203', name: 'Villarrica' },
    ],
    '13': [ // Los Ríos
        { id: '1301', name: 'Valdivia' },
        { id: '1302', name: 'La Unión' },
        { id: '1303', name: 'Río Bueno' },
    ],
    '14': [ // Los Lagos
        { id: '1401', name: 'Puerto Montt' },
        { id: '1402', name: 'Puerto Varas' },
        { id: '1403', name: 'Osorno' },
    ],
    '15': [ // Aysén
        { id: '1501', name: 'Coyhaique' },
        { id: '1502', name: 'Puerto Aysén' },
        { id: '1503', name: 'Chile Chico' },
    ],
    '16': [ // Magallanes
        { id: '1601', name: 'Punta Arenas' },
        { id: '1602', name: 'Puerto Natales' },
        { id: '1603', name: 'Porvenir' },
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
