import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import IconButton from "@/components/IconButton/IconButton";
import { Button } from "@/components/Button/Button";
import Dialog from "@/components/Dialog/Dialog";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { getIdentity } from "@/app/actions/identity";
import { useRouter } from 'next/navigation';

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface Identity {
  id?: string;
  name: string;
  address: string;
  phone: string;
  mail: string;
  businessHours: string;
  urlLogo?: string;
}

function formatCLP(value: number) {
  return value.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
}

interface TopBarProps {
  onMenuClick?: () => void;
  nombreEmpresa?: string;
  uf?: number;
}

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  identity: Identity | null;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  isUserLoggedIn?: boolean;
  userName?: string;
}

// Sidebar Component
function Sidebar({ open, onClose, identity, onLoginClick, onRegisterClick, isUserLoggedIn = false, userName = "" }: SidebarProps) {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // Función para navegar y cerrar todos los menús
  const handleNavigation = (path: string) => {
    router.push(path);
    setOpenMenu(null);
    onClose(); // Cerrar el sidebar también
  };

  // Función para abrir/cerrar un menú específico
  const toggleMenu = (menuName: string) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  // Cierra el menú si el foco sale del contenedor del menú
  const handleBlur = (e: React.FocusEvent<HTMLLIElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setOpenMenu(null);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        onClick={onClose}
        data-test-id="sidebar-overlay"
      />

      {/* Sidebar Panel */}
      <div
        className="fixed left-0 top-0 h-full w-64 bg-background z-50 shadow-xl transform transition-transform duration-300 ease-in-out"
        data-test-id="sidebar-panel"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            {identity?.urlLogo ? (
              <img
                src={identity.urlLogo}
                alt="Logo"
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <span className="material-symbols-outlined text-muted-foreground w-8 h-8 flex items-center justify-center hidden">
              image_not_supported
            </span>
            <span className="font-medium text-foreground text-lg">
              {identity?.name || "Plataforma Inmobiliaria"}
            </span>
          </div>
          <IconButton
            variant="text"
            onClick={onClose}
            icon="close"
            className="text-muted-foreground hover:text-foreground"
          />
        </div>

        {/* Navigation Menu */}
        <div className="p-4 flex-1 overflow-y-auto">
          <nav className="w-full" aria-label="Mobile navigation">
            <ul className="flex flex-col gap-2">
              {/* --- Home Link --- */}
              <li>
                <button 
                  onClick={() => handleNavigation('/portal')} 
                  className="flex items-center gap-3 w-full text-left px-3 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                >
                  <span className="material-symbols-sharp text-xl text-primary" aria-hidden>
                    home
                  </span>
                  <span>Inicio</span>
                </button>
              </li>

              {/* --- DROPDOWN NOSOTROS --- */}
              <li className="relative" onBlur={handleBlur}>
                <button
                  onClick={() => toggleMenu('nosotros')}
                  aria-haspopup="true"
                  aria-expanded={openMenu === 'nosotros'}
                  className="flex items-center justify-between w-full text-left px-3 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                >
                  <span>Nosotros</span>
                  <span className="material-symbols-outlined text-base text-primary">
                    {openMenu === 'nosotros' ? 'arrow_drop_up' : 'arrow_drop_down'}
                  </span>
                </button>
                
                {openMenu === 'nosotros' && (
                  <ul className="mt-2 ml-6 space-y-1">
                    <li>
                      <button 
                        onClick={() => handleNavigation('/portal/aboutUs')} 
                        className="w-full text-left px-3 py-2 text-sm text-foreground hover:text-primary hover:bg-primary/5 rounded transition-colors"
                      >
                        Quiénes somos
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleNavigation('/portal/ourTeam')} 
                        className="w-full text-left px-3 py-2 text-sm text-foreground hover:text-primary hover:bg-primary/5 rounded transition-colors"
                      >
                        Nuestro Equipo
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleNavigation('/portal/testimonials')} 
                        className="w-full text-left px-3 py-2 text-sm text-foreground hover:text-primary hover:bg-primary/5 rounded transition-colors"
                      >
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
                  className="flex items-center justify-between w-full text-left px-3 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                >
                  <span>Propiedades</span>
                  <span className="material-symbols-outlined text-base text-primary">
                    {openMenu === 'propiedades' ? 'arrow_drop_up' : 'arrow_drop_down'}
                  </span>
                </button>
                
                {openMenu === 'propiedades' && (
                  <ul className="mt-2 ml-6 space-y-1">
                    <li>
                      <button 
                        onClick={() => handleNavigation('/portal/properties/rent')} 
                        className="w-full text-left px-3 py-2 text-sm text-foreground hover:text-primary hover:bg-primary/5 rounded transition-colors"
                      >
                        En Arriendo
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleNavigation('/portal/properties/sale')} 
                        className="w-full text-left px-3 py-2 text-sm text-foreground hover:text-primary hover:bg-primary/5 rounded transition-colors"
                      >
                        En Venta
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleNavigation('/portal/services/management')} 
                        className="w-full text-left px-3 py-2 text-sm text-foreground hover:text-primary hover:bg-primary/5 rounded transition-colors"
                      >
                        Servicio de Administración
                      </button>
                    </li>
                  </ul>
                )}
              </li>

              {/* --- Otros Links --- */}
              <li>
                <button 
                  onClick={() => handleNavigation('/portal/publish')} 
                  className="flex items-center gap-3 w-full text-left px-3 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-xl text-primary" aria-hidden>
                    add_circle
                  </span>
                  <span>Publica tu propiedad</span>
                </button>
              </li>
              
              <li className="block">
                <button 
                  onClick={() => handleNavigation('/portal/blog')} 
                  className="flex items-center gap-3 w-full text-left px-3 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-xl text-primary" aria-hidden>
                    article
                  </span>
                  <span>Blog</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-border">
          {isUserLoggedIn ? (
            // Usuario logueado: mostrar nombre
            <div className="flex items-center gap-2 px-3 py-3 text-sm font-medium text-foreground">
              <span className="material-symbols-outlined text-primary">person</span>
              <span>{userName?.split(' ')[0] || 'Usuario'}</span>
            </div>
          ) : (
            // Usuario no logueado: mostrar botones
            <div className="space-y-3">
              <Button
                variant="outlined"
                className="w-full justify-start"
                onClick={() => { onLoginClick(); onClose(); }}
                data-test-id="sidebar-login-btn"
              >
                <span className="material-symbols-outlined mr-2">login</span>
                Ingresar
              </Button>
              <Button
                variant="primary"
                className="w-full justify-start"
                onClick={() => { 
                  onClose();
                  onRegisterClick();
                }}
                data-test-id="sidebar-register-btn"
              >
                <span className="material-symbols-outlined mr-2">person_add</span>
                Registrarse
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function PortalTopBar({ onMenuClick, nombreEmpresa = "Plataforma Inmobiliaria", uf = 34879 }: TopBarProps) {
  const { data: session } = useSession();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [logoError, setLogoError] = useState(false);
  const [logoLoading, setLogoLoading] = useState(true);

  useEffect(() => {
    async function loadIdentity() {
      try {
        const data = await getIdentity();
        if (data) {
          setIdentity(data);
        }
      } catch (error) {
        console.error('Error loading identity:', error);
      }
    }
    loadIdentity();
  }, []);

  const handleLogoLoad = () => {
    setLogoLoading(false);
  };

  const handleLogoError = () => {
    setLogoLoading(false);
    setLogoError(true);
  };

  return (
    <React.Fragment>
      {/* Sidebar for mobile */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        identity={identity}
        onLoginClick={() => setLoginDialogOpen(true)}
        onRegisterClick={() => setRegisterDialogOpen(true)}
        isUserLoggedIn={!!session?.user}
        userName={session?.user?.name || ""}
      />

      {/* Main TopBar */}
      <div
        className="flex items-center justify-between h-16 w-full bg-background sm:px-8 md:px-24 box-border sticky top-0 left-0 z-50"
        data-test-id="topBar"
      >
        {/* Izquierda: icono imagen y nombre empresa */}
        <div className="flex items-center gap-3 ml-4" data-test-id="topBarLogo">
          {logoError ? (
            <span className="material-symbols-outlined text-foreground" style={{ fontSize: '40px' }}>
              image_not_supported
            </span>
          ) : (
            <img
              src={identity?.urlLogo || "/PropLogo2.png"}
              alt="Logo"
              style={{ width: "40px", height: "40px", objectFit: "contain" }}
              data-test-id="topBarLogo"
              onLoad={handleLogoLoad}
              onError={handleLogoError}
            />
          )}
          <span className="sm:text-base md:text-2xl font-medium text-foreground whitespace-nowrap">
            {identity?.name || nombreEmpresa}
          </span>
        </div>

        {/* Centro: contacto y teléfono */}
        <div className="hidden lg:flex flex-col items-center justify-center flex-1">
          <div className="flex items-center gap-6 justify-center">
            <span className="flex items-center gap-1 text-xs text-foreground whitespace-nowrap">
              <span className="material-symbols-outlined text-base">mail</span>
              {identity?.mail || "contacto@empresa.cl"}
            </span>
            <span className="flex items-center gap-1 text-xs text-foreground whitespace-nowrap">
              <span className="material-symbols-outlined text-base">call</span>
              {identity?.phone || "+56 9 1234 5678"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Hide UF on small screens (xs/sm) - will be shown in sidebar */}
          <span className="hidden md:inline text-main text-xs font-normal whitespace-nowrap">
            UF hoy: {formatCLP(uf)}
          </span>
          
          {/* Show user info when logged in, otherwise show login/register buttons */}
          {session?.user ? (
            // Usuario logueado: mostrar nombre + ícono
            <div className="hidden sm:flex items-center gap-3 ml-4 mr-4">
              <div className="h-6 w-px bg-foreground mx-2" />
              <span className="material-symbols-outlined text-primary">person</span>
              <span className="text-xs text-foreground">
                {session.user.name?.split(' ')[0] || 'Usuario'}
              </span>
            </div>
          ) : (
            // Usuario no logueado: mostrar botones de login/register
            <div className="hidden sm:flex items-center gap-1">
              <div className="h-6 w-px bg-foreground mx-2" />
              <Button variant="text" className="text-xs text-foreground px-2" onClick={() => setLoginDialogOpen(true)}>
                Ingresar
              </Button>
              <div className="h-6 w-px bg-foreground mx-2" />
              <Button variant="text" className="text-xs text-foreground px-2" onClick={() => setRegisterDialogOpen(true)}>
                Registrarse
              </Button>
            </div>
          )}
        </div>

        <div className="flex sm:hidden items-center mr-2 gap-2">
          {/* Menu button for xs/sm screens - opens sidebar */}
          <IconButton 
            variant="basic" 
            className="ml-0" 
            onClick={() => setSidebarOpen(true)} 
            icon="menu"
          />
        </div>

        {/* Login Dialog */}
        <Dialog
          open={loginDialogOpen}
          onClose={() => setLoginDialogOpen(false)}
          title="Iniciar Sesión"
          size="xs"
        >
          <LoginForm
            logoSrc={identity?.urlLogo || "/PropLogo2.png"}
            companyName={identity?.name}
            onRegisterClick={() => {
              setLoginDialogOpen(false);
              setRegisterDialogOpen(true);
            }}
          />
        </Dialog>

        {/* Register Dialog */}
        <Dialog
          open={registerDialogOpen}
          onClose={() => setRegisterDialogOpen(false)}
          title="Crear Cuenta"
          size="md"
        >
          <RegisterForm 
            onClose={() => setRegisterDialogOpen(false)}
            onRegisterClick={() => {
              setRegisterDialogOpen(false);
              setLoginDialogOpen(true);
            }}
          />
        </Dialog>
      </div>
    </React.Fragment>
  );
}
