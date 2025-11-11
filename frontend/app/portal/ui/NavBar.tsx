'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';

export default function NavBar() {
  const router = useRouter();
  // Un solo estado para controlar qué menú está abierto
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // Función para navegar y cerrar todos los menús
  const handleNavigation = (path: string) => {
    router.push(path);
    setOpenMenu(null);
  };

  // Función para abrir/cerrar un menú específico
  const toggleMenu = (menuName: string) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  // Cierra el menú si el foco sale del contenedor del menú
  const handleBlur = (e: React.FocusEvent<HTMLLIElement>) => {
    // We check if the new focused element is a child of the menu.
    // If it is not, we close the menu.
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setOpenMenu(null);
    }
  };

  return (
    <nav className="w-full bg-background shadow-[0_4px_8px_-4px_rgba(0,0,0,0.12)] sticky top-16 z-20" aria-label="Main navigation">
      <ul className="flex items-center justify-center gap-3 px-4 py-3">
        {/* --- Home Link --- */}
        <li>
          <button onClick={() => router.push('/portal')} className="flex items-center gap-2 text-sm font-medium text-neutral-900 hover:text-primary">
            <span className="material-symbols-sharp text-2xl text-primary" aria-hidden>
              home
            </span>
          </button>
        </li>

        {/* --- DROPDOWN NOSOTROS --- */}
        <li className="relative" onBlur={handleBlur}>
          <button
            onClick={() => toggleMenu('nosotros')}
            aria-haspopup="true"
            aria-expanded={openMenu === 'nosotros'}
            className="flex items-center gap-1 cursor-pointer py-2 px-1"
          >
            <span className="text-sm font-medium text-neutral-900">Nosotros</span>
            <span className="material-symbols-outlined text-base text-primary">arrow_drop_down</span>
          </button>
          
          {openMenu === 'nosotros' && (
            <ul className="absolute left-0 top-full mt-1 w-56 bg-white border border-neutral-200 rounded shadow-lg z-50">
              <li>
                <button onClick={() => handleNavigation('/portal/aboutUs')} className="w-full text-left px-4 py-2 text-sm text-neutral-900 hover:bg-primary/10 transition-colors">
                  Quiénes somos
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('/portal/ourTeam')} className="w-full text-left px-4 py-2 text-sm text-neutral-900 hover:bg-primary/10 transition-colors">
                  Nuestro Equipo
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('/portal/testimonials')} className="w-full text-left px-4 py-2 text-sm text-neutral-900 hover:bg-primary/10 transition-colors">
                  Testimonios
                </button>
              </li>
            </ul>
          )}
        </li>

        {/* --- DROPDOWN PROPIEDADES --- */}
        <li className="relative" onBlur={handleBlur}>
          <button
            onClick={() => toggleMenu('propiedades')}
            aria-haspopup="true"
            aria-expanded={openMenu === 'propiedades'}
            className="flex items-center gap-1 cursor-pointer py-2 px-1"
          >
            <span className="text-sm font-medium text-neutral-900">Propiedades</span>
            <span className="material-symbols-outlined text-base text-primary">arrow_drop_down</span>
          </button>
          
          {openMenu === 'propiedades' && (
            <ul className="absolute left-0 top-full mt-1 w-56 bg-white border border-neutral-200 rounded shadow-lg z-50">
              <li><button onClick={() => handleNavigation('/portal/properties/rent')} className="w-full text-left block px-4 py-2 text-sm text-neutral-900 hover:bg-primary/10 transition-colors">En Arriendo</button></li>
              <li><button onClick={() => handleNavigation('/portal/properties/sale')} className="w-full text-left block px-4 py-2 text-sm text-neutral-900 hover:bg-primary/10 transition-colors">En Venta</button></li>
              <li><button onClick={() => handleNavigation('/portal/services/management')} className="w-full text-left block px-4 py-2 text-sm text-neutral-900 hover:bg-primary/10 transition-colors">Servicio de Administración</button></li>
            </ul>
          )}
        </li>

        {/* --- Otros Links --- */}
        <li>
          <button onClick={() => handleNavigation('/portal/publish')} className="text-sm font-medium text-neutral-900 hover:text-primary">
            Publica tu propiedad
          </button>
        </li>
        {/* <li>
          <button onClick={() => handleNavigation('/portal/valuation')} className="text-sm font-medium text-neutral-900 hover:text-primary">
            Valoriza tu propiedad
          </button>
        </li> */}
        <li className="hidden sm:block">
          <button onClick={() => handleNavigation('/portal/blog')} className="text-sm font-medium text-neutral-900 hover:text-primary">
            Blog
          </button>
        </li>
      </ul>
    </nav>
  )
}
