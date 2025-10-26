'use client'

import React, { useState, useEffect } from "react";
import { TextField } from "@/components/TextField/TextField";
import { Button } from "@/components/Button/Button";
import IconButton from "@/components/Button/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { getIdentity } from "@/app/actions/identity";
import { env } from "@/lib/env";

// Configurar FontAwesome para que no agregue CSS automáticamente
config.autoAddCss = false;

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
                identity.partnerships.slice(0, 2).map((partnership, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <img
                      src={partnership.logoUrl || "/globe.svg"}
                      alt={partnership.name}
                      className="w-12 h-12 object-contain"
                    />
                    <div>
                      <div className="text-base font-semibold text-background">{partnership.name}</div>
                      <div className="text-xs text-background font-light">{partnership.description}</div>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  {/* Tarjeta 1 por defecto */}
                  <div className="flex items-center gap-3">
                    <img src="/globe.svg" alt="Cámara Chilena de Propiedades" className="w-12 h-12 object-contain" />
                    <div>
                      <div className="text-base font-semibold text-background">Cámara Chilena de Propiedades</div>
                      <div className="text-xs text-background font-light">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
                    </div>
                  </div>
                  {/* Tarjeta 2 por defecto */}
                  <div className="flex items-center gap-3">
                    <img src="/globe.svg" alt="Alianza Global" className="w-12 h-12 object-contain" />
                    <div>
                      <div className="text-base font-semibold text-background">Alianza Global</div>
                      <div className="text-xs text-background font-light">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
                    </div>
                  </div>
                </>
              )}
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
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
          {/* Columna 1: Información de la Empresa */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-background flex items-center">
              <img
                src={identity?.urlLogo || "/PropLogo2.png"}
                alt="Logo Plataforma Inmobiliaria"
                className="w-8 h-8 mr-2 inline-block align-middle"
              />
              {identity?.name || 'Plataforma Inmobiliaria'}
            </h3>
            <p className="text-sm font-extralight text-background flex items-center mb-2">
              <span className="material-symbols-rounded align-middle mr-2">location_on</span>
              {identity?.address || 'Calle Falsa 123, Parral, Región del Maule'}
            </p>
            <p className="text-sm font-extralight text-background flex items-center mb-2">
              <span className="material-symbols-rounded align-middle mr-2">call</span>
              {identity?.phone || '+56 9 1234 5678'}
            </p>
            <p className="text-sm font-extralight text-background flex items-center mb-2">
              <span className="material-symbols-rounded align-middle mr-2">mail</span>
              {identity?.mail || 'info@plataformainmobiliaria.cl'}
            </p>
            <p className="text-sm font-extralight text-background flex items-center mt-4">
              <span className="material-symbols-rounded align-middle mr-2">schedule</span>
              {identity?.businessHours || 'Lunes a Viernes: 9:00 - 18:00'}
            </p>
          </div>
          {/* Columna 2: Menú estilizado del SideBar */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-background">Menú</h3>
            <ul className="mt-2 custom-footer-menu-gap">
              <li>
                <a href="#" className="flex items-center gap-3 px-3 py-1 rounded-lg text-sm font-semibold text-background transition-colors">
                  <span className="material-symbols-sharp text-xl text-background">home</span>
                  Inicio
                </a>
              </li>
              <li>
                <div className="flex flex-col gap-1 px-3 py-1 rounded-lg">
                  <span className="flex items-center gap-2 text-sm font-semibold text-background">
                    <span className="material-symbols-sharp text-xl text-background">groups</span>
                    Nosotros
                  </span>
                  <ul className="ml-6 mt-1 space-y-1">
                    <li><a href="#" className="block text-xs text-background hover:underline">Historia</a></li>
                    <li><a href="#" className="block text-xs text-background hover:underline">Equipo</a></li>
                  </ul>
                </div>
              </li>
              <li>
                <div className="flex flex-col gap-1 px-3 py-2 rounded-lg">
                  <span className="flex items-center gap-2 text-sm font-semibold text-background">
                    <span className="material-symbols-sharp text-xl text-background">apartment</span>
                    Propiedades
                  </span>
                  <ul className="ml-6 mt-1 space-y-1">
                    <li><a href="#" className="block text-xs text-background hover:underline">En venta</a></li>
                    <li><a href="#" className="block text-xs text-background hover:underline">En arriendo</a></li>
                  </ul>
                </div>
              </li>
              <li>
                <a href="#" className="flex items-center gap-3 px-3 py-1 rounded-lg text-sm font-semibold text-background transition-colors">
                  <span className="material-symbols-sharp text-xl text-background">edit_note</span>
                  Publica tu propiedad
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-3 px-3 py-1 rounded-lg text-sm font-semibold text-background transition-colors">
                  <span className="material-symbols-sharp text-xl text-background">price_check</span>
                  Valoriza tu propiedad
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-3 px-3 py-1 rounded-lg text-sm font-semibold text-background transition-colors">
                  <span className="material-symbols-sharp text-xl text-background">edit_note</span>
                  Blog
                </a>
              </li>
            </ul>
          </div>
          {/* Columna 3: Formulario de Contacto */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-background">Contáctanos</h3>
            <ContactForm />
          </div>
          {/* Columna 4: Preguntas Frecuentes */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-left">Preguntas Frecuentes</h3>
            <div className="space-y-4 text-left">
              {identity?.faqs && identity.faqs.length > 0 ? (
                identity.faqs.slice(0, 4).map((faq, index) => (
                  <div key={index} className="border-l-2 border-primary pl-3">
                    <h4 className="text-sm font-semibold text-background mb-1">{faq.question}</h4>
                    <p className="text-sm font-extralight text-background leading-relaxed">{faq.answer}</p>
                  </div>
                ))
              ) : (
                <>
                  <div className="border-l-2 border-primary pl-3">
                    <h4 className="text-sm font-semibold text-background mb-1">¿Cómo puedo publicar una propiedad?</h4>
                    <p className="text-sm font-extralight text-background leading-relaxed">Para publicar tu propiedad, regístrate en nuestra plataforma y accede al panel de administración donde podrás crear y gestionar tus anuncios inmobiliarios.</p>
                  </div>
                  <div className="border-l-2 border-primary pl-3">
                    <h4 className="text-sm font-semibold text-background mb-1">¿Cuál es el costo del servicio?</h4>
                    <p className="text-sm font-extralight text-background leading-relaxed">Ofrecemos diferentes planes según tus necesidades. Contacta con nuestro equipo para obtener información detallada sobre precios y servicios.</p>
                  </div>
                  <div className="border-l-2 border-primary pl-3">
                    <h4 className="text-sm font-semibold text-background mb-1">¿Cómo puedo contactar a un agente?</h4>
                    <p className="text-sm font-extralight text-background leading-relaxed">Puedes contactar directamente a nuestros agentes a través de la página de cada propiedad o utilizando el formulario de contacto disponible en nuestro sitio.</p>
                  </div>
                  <div className="border-l-2 border-primary pl-3">
                    <h4 className="text-sm font-semibold text-background mb-1">¿Ofrecen servicios de tasación?</h4>
                    <p className="text-sm font-extralight text-background leading-relaxed">Sí, contamos con un servicio profesional de tasación inmobiliaria. Solicita una evaluación gratuita a través de nuestro formulario de contacto.</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-sm font-extralight text-background border-t border-gray-400/30 pt-4">
          &copy; 2025 {identity?.name || 'Plataforma Inmobiliaria'}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};


// Formulario de contacto usando TextField y Button
export const ContactForm: React.FC = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviado(true);
    setTimeout(() => setEnviado(false), 3000);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
  <TextField label="Tu Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} name="nombre" placeholder="Nombre" className="text-sm font-extralight" />
  <TextField label="Tu Correo Electrónico" value={email} onChange={(e) => setEmail(e.target.value)} name="email" type="email" placeholder="Correo Electrónico" className="text-sm font-extralight" />
  <TextField label="Tu Mensaje" value={mensaje} onChange={(e) => setMensaje(e.target.value)} name="mensaje" type="text" placeholder="Mensaje" className="text-sm font-extralight" rows={2} />
      <div className="flex justify-end">
        <IconButton icon="send" variant="text" type="submit" className="text-primary">
          <span className="material-symbols-rounded text-2xl text-primary">send</span>
        </IconButton>
      </div>
    </form>
  );
};

export default PortalFooter;
