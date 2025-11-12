"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { TextField } from "@/components/TextField/TextField";
import { useAuth } from "@/app/providers";
import Logo from "@/components/Logo/Logo";
import { Button } from "@/components/Button/Button";

interface LoginFormProps {
  onClose?: () => void;
  logoSrc?: string;
  companyName?: string;

}

export default function LoginForm({ onClose, logoSrc, companyName }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();

  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await login(email, password);

      // Support both our login return ({ success: true }) and NextAuth shape ({ ok: true })
      const ok = (result as any)?.success === true || (result as any)?.ok === true;
      if (!ok) {
        const err = (result as any)?.error ?? "Credenciales inválidas";
        setError(err);
        return;
      }

      if (onClose) onClose();

      // Poll session until role appears (up to ~2s)
      const maxAttempts = 10;
      for (let i = 0; i < maxAttempts; i++) {
        try {
          const res = await fetch('/api/auth/session');
          if (res.ok) {
            const session = await res.json();
            const role = session?.user?.role;
            if (role) {
              if (role === 'ADMIN' || role === 'AGENT') {
                router.push('/backOffice');
                return;
              }
              break; // role present but not admin/agent
            }
          }
        } catch (sessErr) {
          // ignore and retry
        }
        await delay(200);
      }

      // fallback: refresh page
      router.refresh();
    } catch (unknownError) {
      console.error("Error en login", unknownError);
      setError("Ocurrió un error inesperado. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4" data-test-id="portal-login-form">
      {logoSrc && (

        <div>
          <div className="flex justify-center mb-4">
            <Logo src={logoSrc} className="w-48 h-20 md:w-64 md:h-24" aspect={{ w: 4, h: 1 }} />

          </div>
          <div className="text-center text-sm text-foreground text-xl">
            {companyName || "nuestro portal"}
          </div>
        </div>

      )}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Correo electrónico"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="nombre@correo.com"
          className="w-full"
          data-test-id="portal-login-email"
        />
        <TextField
          label="Contraseña"
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
          className="w-full"
          data-test-id="portal-login-password"
        />
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <Button
          variant="primary"
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-4"
        >
          {isSubmitting ? "Ingresando..." : "Ingresar"}
        </Button>
      </form>
    </div>
  );
}
