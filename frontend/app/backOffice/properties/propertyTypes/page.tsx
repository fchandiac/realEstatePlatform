import React from 'react'
import PropertyTypeCard from './ui/PropertyTypeCard'

export default function page() {
  return (
    <div>
        <PropertyTypeCard propertyType={{id: '1', name: 'Apartment', description: 'A cozy apartment in the city center', icon: 'building', color: '#4CAF50', isActive: true}} />


    </div>
  )
}
