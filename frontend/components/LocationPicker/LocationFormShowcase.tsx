import React, { useState } from "react";
import { TextField } from "../TextField/TextField";


const LocationFormShowcase: React.FC = () => {
  const [formValues, setFormValues] = useState<{ nombre: string; email: string; lat: number | null; lng: number | null }>({
    nombre: "",
    email: "",
    lat: null,
    lng: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  return (
    <form
      className="flex flex-col gap-4 p-4 bg-background w-full max-w-md"
      onSubmit={e => {
        e.preventDefault();
        setSubmitting(true);
        setTimeout(() => setSubmitting(false), 1200);
      }}
    >
      <TextField
        label="Nombre"
        value={formValues.nombre}
        onChange={e => setFormValues(v => ({ ...v, nombre: e.target.value }))}
        required
        name="nombre"
      />
      <TextField
        label="Email"
        value={formValues.email}
        onChange={e => setFormValues(v => ({ ...v, email: e.target.value }))}
        required
        name="email"
        type="email"
      />
  
      <div className="flex justify-end mt-4">
        <button type="submit" className="btn-contained-primary" disabled={submitting}>
          {submitting ? "Enviando..." : "Enviar"}
        </button>
      </div>
      {errors.length > 0 && (
        <div className="flex flex-col gap-2 mt-2">
          {errors.map((err, i) => (
            <div key={i} className="text-red-500 text-sm">{err}</div>
          ))}
        </div>
      )}
    </form>
  );
};

export default LocationFormShowcase;
