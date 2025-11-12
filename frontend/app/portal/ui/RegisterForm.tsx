"use client";

import { useState, FormEvent } from "react";
import { TextField } from "@/components/TextField/TextField";

interface RegisterFormProps {
  onClose?: () => void;
}

export default function RegisterForm({ onClose }: RegisterFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // TODO: integrate with registration flow
    console.info("Register attempt", {
      fullName,
      email,
      password: password ? "***" : "",
    });

    if (onClose) onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" data-test-id="portal-register-form">
      <TextField
        label="Nombre completo"
        required
        value={fullName}
        onChange={(event) => setFullName(event.target.value)}
        placeholder="Nombre y apellido"
        className="w-full"
        data-test-id="portal-register-fullname"
      />
      <TextField
        label="Correo electrónico"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="nombre@correo.com"
        className="w-full"
        data-test-id="portal-register-email"
      />
      <TextField
        label="Contraseña"
        type="password"
        required
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="••••••••"
        className="w-full"
        data-test-id="portal-register-password"
      />
      <TextField
        label="Confirmar contraseña"
        type="password"
        required
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        placeholder="••••••••"
        className="w-full"
        data-test-id="portal-register-password-confirm"
      />
      <button type="submit" className="btn-contained-primary">
        Registrarse
      </button>
    </form>
  );
}
