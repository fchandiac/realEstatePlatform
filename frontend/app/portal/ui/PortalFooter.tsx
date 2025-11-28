'use client'

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faFacebook,
  faLinkedin,
  faYoutube
} from "@fortawesome/free-brands-svg-icons";
import { getIdentity } from "@/app/actions/identity";

interface SocialMediaItem {
  url?: string;
  available?: boolean;
}

interface SocialMedia {
  instagram?: SocialMediaItem;
  facebook?: SocialMediaItem;
  linkedin?: SocialMediaItem;
  youtube?: SocialMediaItem;
}

interface Partnership {
  name: string;
  description: string;
  logoUrl?: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface Identity {
  id?: string;
  name: string;
  address: string;
  phone: string;
  mail: string;
  businessHours: string;
  urlLogo?: string;
  socialMedia?: SocialMedia;
  partnerships?: Partnership[];
  faqs?: FAQItem[];
}

const PortalFooter: React.FC = () => {
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [loading, setLoading] = useState(true);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function loadIdentity() {
      try {
        const data = await getIdentity();
        if (data) {
          setIdentity(data);
        }
      } catch (error) {
        console.error('Error loading identity:', error);
      } finally {
        setLoading(false);
      }
    }
    loadIdentity();
  }, []);

  if (loading) {
    return (
      <footer className="bg-foreground text-background p-8 mt-12 border-t border-border">
        <div className="container mx-auto text-center">
          <div className="text-background">Cargando...</div>
        </div>
      </footer>
    );
  }

  const handleImageError = (imageKey: string) => {
    setFailedImages(prev => new Set([...prev, imageKey]));
  };

  return (
    <footer className="bg-foreground text-background p-8 mt-12 border-t border-border">
      <div>
        {/* Fila superior: alianzas y redes sociales */}
        <div className="container mx-auto mb-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Columna 1: Nuestras alianzas */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-background">Nuestras alianzas</h3>
            <div className="flex flex-col md:flex-row gap-4">
              {identity?.partnerships && identity.partnerships.length > 0 ? (
                identity.partnerships.slice(0, 2).map((partnership, index) => {
                  const imageKey = `partnership-${index}`;
                  const imageError = failedImages.has(imageKey);
                  
                  return (
                    <div key={index} className="flex items-center gap-3">
                      {imageError ? (
                        <span className="material-symbols-outlined text-background" style={{ fontSize: '48px' }}>
                          image_not_supported
                        </span>
                      ) : (
                        <img
                          src={partnership.logoUrl || "/globe.svg"}
                          alt={partnership.name}
                          className="w-12 h-12 object-contain"
                          onError={() => handleImageError(imageKey)}
                        />
                      )}
                      <div>
                        <div className="text-base font-semibold text-background">{partnership.name}</div>
                        <div className="text-xs text-background font-light">{partnership.description}</div>
                      </div>
                    </div>
                  );
                })
              ) : null}
            </div>
          </div>
          {/* Columna 2: Síguenos en redes sociales (vertical y alineado arriba) */}
          <div className="flex flex-col items-start md:items-end justify-start">
            <h3 className="text-lg font-semibold mb-4 text-background text-left md:text-right items-start">Síguenos en redes sociales</h3>

            <div className="flex flex-row gap-4 justify-start md:justify-end items-start md:items-end">
              {identity?.socialMedia?.instagram?.available && (
                <a
                  href={identity.socialMedia.instagram.url || '#'}
                  aria-label="Instagram"
                  className="text-background hover:text-primary text-2xl"
                >
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
              )}
              {identity?.socialMedia?.facebook?.available && (
                <a
                  href={identity.socialMedia.facebook.url || '#'}
                  aria-label="Facebook"
                  className="text-background hover:text-primary text-2xl"
                >
                  <FontAwesomeIcon icon={faFacebook} />
                </a>
              )}
              {identity?.socialMedia?.linkedin?.available && (
                <a
                  href={identity.socialMedia.linkedin.url || '#'}
                  aria-label="LinkedIn"
                  className="text-background hover:text-primary text-2xl"
                >
                  <FontAwesomeIcon icon={faLinkedin} />
                </a>
              )}
              {identity?.socialMedia?.youtube?.available && (
                <a
                  href={identity.socialMedia.youtube.url || '#'}
                  aria-label="YouTube"
                  className="text-background hover:text-primary text-2xl"
                >
                  <FontAwesomeIcon icon={faYoutube} />
                </a>
              )}
            </div>
          </div>
        </div>
        <hr className="my-8 border-t border-gray-400/30" />
        <div className={`container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 text-left ${identity?.faqs && identity.faqs.length > 0 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
          {/* Columna 1: Información de Contacto */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-6 text-background border-b border-primary/30 pb-2">
              Información de Contacto
            </h3>
            <div className="space-y-4">
              {/* Logo y nombre de la empresa */}
              <div className="flex items-center gap-3 mb-6">
                {failedImages.has('company-logo') ? (
                  <span className="material-symbols-outlined text-background" style={{ fontSize: '48px' }}>
                    image_not_supported
                  </span>
                ) : (
                  <img
                    src={identity?.urlLogo || "/PropLogo2.png"}
                    alt="Logo Plataforma Inmobiliaria"
                    className="w-12 h-12 object-contain"
                    onError={() => handleImageError('company-logo')}
                  />
                )}
                <div>
                  <h4 className="text-lg font-semibold text-background">
                    {identity?.name || 'Plataforma Inmobiliaria'}
                  </h4>
                </div>
              </div>

              {/* Información de contacto */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                    <span className="material-symbols-rounded text-background text-lg">location_on</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-background mb-1">Dirección</p>
                    <p className="text-sm text-background/90 leading-relaxed">
                      {identity?.address || '572 Francesca Stream, Parral, Región del Maule'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                    <span className="material-symbols-rounded text-background text-lg">call</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-background mb-1">Teléfono</p>
                    <p className="text-sm text-background/90">
                      {identity?.phone || '+56 9 1429 0441'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                    <span className="material-symbols-rounded text-background text-lg">mail</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-background mb-1">Correo Electrónico</p>
                    <p className="text-sm text-background/90">
                      {identity?.mail || 'Giuseppe53@yahoo.com'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                    <span className="material-symbols-rounded text-background text-lg">schedule</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-background mb-1">Horario de Atención</p>
                    <p className="text-sm text-background/90 leading-relaxed">
                      {identity?.businessHours || 'Lunes a Viernes: 9:00 - 18:00<br />Sábado: 9:00 - 13:00<br />Domingo: Cerrado'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Columna 2: Navegación del Sitio */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-background border-b border-primary/30 pb-2">Navegación</h3>
            <ul className="mt-2 custom-footer-menu-gap">
              <li>
                <a href="/portal" className="flex items-center gap-3 px-3 py-1 rounded-lg text-sm font-semibold text-background transition-colors">
                  <span className="material-symbols-sharp text-xl text-background">home</span>
                  Inicio
                </a>
              </li>
              <li>
                <div className="flex flex-col gap-1 px-3 py-1 rounded-lg">
                  <span className="flex items-center gap-2 text-sm font-semibold text-background">
                    <span className="material-symbols-sharp text-xl text-background">apartment</span>
                    Propiedades
                  </span>
                  <ul className="ml-6 mt-1 space-y-1">
                    <li><a href="/portal/properties/rent" className="block text-xs text-background hover:underline">Arriendos</a></li>
                    <li><a href="/portal/properties/sale" className="block text-xs text-background hover:underline">Ventas</a></li>
                    <li><a href="/portal/services/management" className="block text-xs text-background hover:underline">Administraciones</a></li>
                  </ul>
                </div>
              </li>
              <li>
                <div className="flex flex-col gap-1 px-3 py-1 rounded-lg">
                  <span className="flex items-center gap-2 text-sm font-semibold text-background">
                    <span className="material-symbols-sharp text-xl text-background">groups</span>
                    Nosotros
                  </span>
                  <ul className="ml-6 mt-1 space-y-1">
                    <li><a href="/portal/aboutUs" className="block text-xs text-background hover:underline">Quiénes somos</a></li>
                    <li><a href="/portal/ourTeam" className="block text-xs text-background hover:underline">Nuestro Equipo</a></li>
                    <li><a href="/portal/testimonials" className="block text-xs text-background hover:underline">Testimonios</a></li>
                  </ul>
                </div>
              </li>
              <li>
                <a href="/portal/publish" className="flex items-center gap-3 px-3 py-1 rounded-lg text-sm font-semibold text-background transition-colors">
                  <span className="material-symbols-sharp text-xl text-background">edit_note</span>
                  Publica tu propiedad
                </a>
              </li>
              <li>
                <a href="/portal/blog" className="flex items-center gap-3 px-3 py-1 rounded-lg text-sm font-semibold text-background transition-colors">
                  <span className="material-symbols-sharp text-xl text-background">edit_note</span>
                  Blog
                </a>
              </li>
            </ul>
          </div>
          {/* Columna 4: Preguntas Frecuentes - Solo visible si hay FAQs del backend */}
          {identity?.faqs && identity.faqs.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-6 text-background border-b border-primary/30 pb-2">Preguntas Frecuentes</h3>
              <div className="space-y-4 text-left">
                {identity.faqs.slice(0, 4).map((faq, index) => (
                  <div key={index} className="border-l-2 border-primary pl-3">
                    <h4 className="text-sm font-semibold text-background mb-1">{faq.question}</h4>
                    <p className="text-sm font-extralight text-background leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="mt-8 text-center text-sm font-extralight text-background border-t border-gray-400/30 pt-4">
          &copy; 2025 {identity?.name || 'Plataforma Inmobiliaria'}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};


export default PortalFooter;
