"use client";

import { useState, FormEvent } from "react";
import { TextField } from "@/components/TextField/TextField";

interface LoginFormProps {
  onClose?: () => void;
}

export default function LoginForm({ onClose }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: replace with real authentication integration
    console.info("Login attempt", { email, password: password ? "***" : "" });
    if (onClose) onClose();
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
      <button type="submit" className="btn-contained-primary">
        Ingresar
      </button>
    </form>
  );
}
