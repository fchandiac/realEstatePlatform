import React, { useState, useEffect } from "react";
import IconButton from "@/components/IconButton/IconButton";
import { Button } from "@/components/Button/Button";
import Dialog from "@/components/Dialog/Dialog";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { getIdentity } from "@/app/actions/identity";

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

export default function PortalTopBar({ onMenuClick, nombreEmpresa = "Plataforma Inmobiliaria", uf = 34879 }: TopBarProps) {
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [identity, setIdentity] = useState<Identity | null>(null);

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

  const handleLogin = async (username: string, password: string) => {
    setLoading(true);
    try {
      // Aquí iría la lógica de login
      console.log('Login attempt:', { username, password });
      // Por ahora solo cerramos el dialog
      setLoginDialogOpen(false);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data: RegisterData) => {
    setLoading(true);
    try {
      // Aquí iría la lógica de registro
      console.log('Register attempt:', data);
      // Por ahora solo cerramos el dialog
      setRegisterDialogOpen(false);
    } catch (error) {
      console.error('Register error:', error);
    } finally {
      setLoading(false);
    }
  };

  const openLoginDialog = () => {
    setRegisterDialogOpen(false);
    setLoginDialogOpen(true);
  };

  const openRegisterDialog = () => {
    setLoginDialogOpen(false);
    setRegisterDialogOpen(true);
  };

  return (
    <div
      className="flex items-center justify-between h-16 w-full bg-background sm:px-8 md:px-24 box-border sticky top-0 left-0 z-50"
      data-test-id="topBar"
    >
      {/* Izquierda: icono imagen y nombre empresa */}
      <div className="flex items-center gap-3 ml-4" data-test-id="topBarLogo">
        <img
          src={identity?.urlLogo || "/PropLogo2.png"}
          alt="Logo"
          style={{ width: "40px", height: "40px", objectFit: "contain" }}
          data-test-id="topBarLogo"
        />
        <span className="sm:text-base md:text-2xl font-medium text-foreground whitespace-nowrap">
          {identity?.name || nombreEmpresa}
        </span>
      </div>

      {/* Centro: contacto y teléfono */}
      <div className="hidden md:flex flex-col items-center justify-center flex-1">
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
        {/* Hide this UF on small screens; show compact UF next to menu instead */}
        <span className="hidden sm:inline text-main text-xs font-normal whitespace-nowrap">
          UF hoy: {formatCLP(uf)}
        </span>
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
      </div>

      <div className="flex sm:hidden items-center mr-2 gap-2">
        {/* Compact UF visible only on small screens, placed next to menu */}
        <span className="text-main text-xs font-normal whitespace-nowrap">
          UF: {formatCLP(uf)}
        </span>
        <IconButton variant="text" className="ml-0" onClick={onMenuClick} icon={""}>
          <span className="material-symbols-outlined">menu</span>
        </IconButton>
      </div>

      {/* Login Dialog */}
      <Dialog
        open={loginDialogOpen}
        onClose={() => setLoginDialogOpen(false)}
        title="Iniciar Sesión"
        size="sm"
      >
        <LoginForm />
      </Dialog>

      {/* Register Dialog */}
      <Dialog
        open={registerDialogOpen}
        onClose={() => setRegisterDialogOpen(false)}
        title="Crear Cuenta"
        size="md"
      >
        <RegisterForm />
      </Dialog>
    </div>
  );
}
