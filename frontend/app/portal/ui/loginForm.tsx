"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { TextField } from "@/components/TextField/TextField";
import { useAuth } from "@/app/providers";

interface LoginFormProps {
  onClose?: () => void;
}

export default function LoginForm({ onClose }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.error);
        return;
      }
      if (onClose) onClose();
      router.refresh();
    } catch (unknownError) {
      console.error("Error en login", unknownError);
      setError("Ocurrió un error inesperado. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" data-test-id="portal-login-form">
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
      <button
        type="submit"
        className="btn-contained-primary disabled:opacity-60 disabled:cursor-not-allowed"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
