"use client";

import { useState, useCallback } from "react";
import Dialog from "@/components/Dialog/Dialog";
import LoginForm from "./ui/loginForm";
import RegisterForm from "./ui/registerForm";

type PortalLayoutProps = {
  children: React.ReactNode;
};

export default function PortalLayout({ children }: PortalLayoutProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

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

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b border-border bg-white/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-semibold text-primary">Real Estate Platform</span>
          <nav className="flex items-center gap-4">
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
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <Dialog open={isLoginOpen} onClose={closeDialogs} title="Ingresar" size="sm">
        <LoginForm onClose={closeDialogs} />
      </Dialog>

      <Dialog open={isRegisterOpen} onClose={closeDialogs} title="Crear cuenta" size="sm">
        <RegisterForm onClose={closeDialogs} />
      </Dialog>
    </div>
  );
}
