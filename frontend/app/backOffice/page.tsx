'use client'

import React from 'react'
import KPICards from './components/KPICards'
import PropertyDistribution from './components/PropertyDistribution'
import AgentRanking from './components/AgentRanking'
import RevenueChart from './components/RevenueChart'
import RevenueComparison from './components/RevenueComparison'

// Sample data - Replace with real API calls
const kpiData = [
  {
    title: 'Ingresos Totales del Mes',
    value: '14.2',
    unit: 'M',
    variation: 21,
    isPositive: true
  },
  {
    title: 'Propiedades Activas',
    value: '256',
    unit: '',
    variation: 8,
    isPositive: true
  },
  {
    title: 'Nuevos Miembros',
    value: '48',
    unit: '',
    variation: 12,
    isPositive: true
  },
  {
    title: 'Tiempo Promedio Venta',
    value: '42',
    unit: 'días',
    variation: -5,
    isPositive: false
  }
]

const propertyDistributionData = [
  { type: 'Departamento', count: 128, percentage: 50 },
  { type: 'Casa', count: 77, percentage: 30 },
  { type: 'Oficina', count: 38, percentage: 15 },
  { type: 'Parcela', count: 13, percentage: 5 }
]

const agentRankingData = [
  { name: 'Carlos Rodríguez', performance: 95, rank: 1 },
  { name: 'María González', performance: 87, rank: 2 },
  { name: 'Juan Pérez', performance: 82, rank: 3 },
  { name: 'Ana López', performance: 78, rank: 4 },
  { name: 'Roberto Silva', performance: 72, rank: 5 },
  { name: 'Catalina Martínez', performance: 68, rank: 6 }
]

const revenueData = [8.5, 9.2, 8.8, 11.5, 12.3, 14.2]

export default function BackOfficeDashboard() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {/* <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Bienvenido al panel de control de la plataforma inmobiliaria</p>
        </div> */}

        {/* Section 1: KPI Cards */}
        <KPICards data={kpiData} />

        {/* Section 2: Bottom row with 3 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column: Revenue Chart (spans 8 columns) */}
          <div className="lg:col-span-8">
            <RevenueChart data={revenueData} />
          </div>

          {/* Right column: Revenue Comparison (spans 4 columns) */}
          <div className="lg:col-span-4">
            <RevenueComparison currentMonth={14.2} previousYearSameMonth={11.8} monthName="Junio" />
          </div>
        </div>

        {/* Section 3: Bottom row with Property Distribution and Agent Ranking */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Left: Property Distribution */}
          <PropertyDistribution data={propertyDistributionData} />

          {/* Right: Agent Ranking */}
          <AgentRanking data={agentRankingData} />
        </div>
      </div>
    </div>
  )
}
