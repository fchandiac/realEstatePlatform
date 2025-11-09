


'use client'
import React, { useState, useRef, useEffect } from 'react'


export default function NavBar() {
  const [openNosotros, setOpenNosotros] = useState(false);
  const [openPropiedades, setOpenPropiedades] = useState(false);
  const nosotrosRef = useRef<HTMLLIElement>(null);
  const propiedadesRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (openNosotros && nosotrosRef.current && !nosotrosRef.current.contains(event.target as Node)) {
        setOpenNosotros(false);
      }
      if (openPropiedades && propiedadesRef.current && !propiedadesRef.current.contains(event.target as Node)) {
        setOpenPropiedades(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openNosotros, openPropiedades]);

  return (
    <nav className="w-full bg-background shadow-[0_4px_8px_-4px_rgba(0,0,0,0.12)] sticky top-16 z-20" aria-label="Main navigation">
      <ul className="flex items-center justify-center gap-3 px-4 py-3">
        <li>
          <a href="#" className="flex items-center gap-2 text-sm font-medium text-neutral-900 hover:text-primary">
            <span className="material-symbols-sharp text-2xl text-primary" aria-hidden>
              home
            </span>
          </a>
        </li>
        <li className="hidden sm:block">
          <a href="/portal/aboutUs" className="text-sm font-medium text-neutral-900 hover:text-primary">
            Sobre nosotros
          </a>
        </li>
        <li className="relative" ref={propiedadesRef}>
          <div className="flex items-center gap-1">
            <a href="#" className="text-sm font-medium text-neutral-900 hover:text-primary">
              Propiedades
            </a>
            <button type="button" aria-label="Desplegar submenú Propiedades" onClick={() => setOpenPropiedades((v) => !v)} className="focus:outline-none">
              <span className="material-symbols-outlined text-base text-primary">arrow_drop_down</span>
            </button>
          </div>
          {openPropiedades && (
            <ul className="absolute left-0 top-full mt-2 w-56 bg-white border border-neutral-200 rounded shadow z-30">
              <li><a href="#" className="block px-4 py-2 text-sm text-neutral-900 hover:bg-primary/10">En Arriendo</a></li>
              <li><a href="#" className="block px-4 py-2 text-sm text-neutral-900 hover:bg-primary/10">En Venta</a></li>
              <li><a href="#" className="block px-4 py-2 text-sm text-neutral-900 hover:bg-primary/10">Servicio de Administración Inmobiliaria</a></li>
            </ul>
          )}
        </li>
        <li>
          <a href="#" className="text-sm font-medium text-neutral-900 hover:text-primary">
            Publica tu propiedad
          </a>
        </li>
        <li>
          <a href="#" className="text-sm font-medium text-neutral-900 hover:text-primary">
            Valoriza tu propiedad
          </a>
        </li>
        <li className="hidden sm:block">
          <a href="#" className="text-sm font-medium text-neutral-900 hover:text-primary">
            Blog
          </a>
        </li>
      </ul>
    </nav>
  )
}
