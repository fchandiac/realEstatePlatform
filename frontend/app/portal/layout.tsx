"use client";

import { useState, useCallback, useEffect, useMemo, useTransition } from "react";
import Dialog from "@/components/Dialog/Dialog";
import LoginForm from "./ui/loginForm";
import RegisterForm from "./ui/registerForm";
import { useAuth } from "@/app/providers";

type PortalLayoutProps = {
  children: React.ReactNode;
};

export default function PortalLayout({ children }: PortalLayoutProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoggingOut, startLogout] = useTransition();
  const { user, status, isAuthenticated, logout } = useAuth();

  const displayName = useMemo(
    () => user?.name ?? user?.email ?? "Usuario",
    [user?.name, user?.email],
  );

  const openLogin = useCallback(() => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  }, []);

  const openRegister = useCallback(() => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  }, []);

  const closeDialogs = useCallback(() => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoginOpen(false);
      setIsRegisterOpen(false);
    }
  }, [isAuthenticated]);

  const handleLogout = useCallback(() => {
    startLogout(async () => {
      await logout();
    });
  }, [logout, startLogout]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b border-border bg-white/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-semibold text-primary">Real Estate Platform</span>
          <nav className="flex items-center gap-4">
            {status === "loading" ? (
              <span className="text-sm text-muted-foreground">Validando sesión...</span>
            ) : isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">{displayName}</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn-text"
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? "Cerrando..." : "Cerrar sesión"}
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={openLogin}
                  className="btn-text"
                >
                  Ingresar
                </button>
                <button
                  type="button"
                  onClick={openRegister}
                  className="btn-text"
                >
                  Registrarse
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <Dialog open={isLoginOpen && !isAuthenticated} onClose={closeDialogs} title="Ingresar" size="sm">
        <LoginForm onClose={closeDialogs} />
      </Dialog>

      <Dialog open={isRegisterOpen && !isAuthenticated} onClose={closeDialogs} title="Crear cuenta" size="sm">
        <RegisterForm onClose={closeDialogs} />
      </Dialog>
    </div>
  );
}
