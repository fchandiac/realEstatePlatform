'use client';

import { useState } from 'react';

export type AlertType = 'success' | 'error' | 'info' | 'warning';

export interface AlertState {
  type: AlertType;
  message: string;
}

export const useAlert = (timeout = 5000) => {
  const [alert, setAlert] = useState<AlertState | null>(null);

  const showAlert = (type: AlertType, message: string) => {
    setAlert({ type, message });
    const timer = setTimeout(() => {
      setAlert(null);
    }, timeout);
    // No es necesario limpiar el timeout aquí si el hook vive con el componente
  };

  const hideAlert = () => {
    setAlert(null);
  };

  return { alert, showAlert, hideAlert };
};
