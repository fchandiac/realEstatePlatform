'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/Button/Button';

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const consentCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('cookieConsent='));

    if (!consentCookie) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    // Set cookie for 1 year
    const date = new Date();
    date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `cookieConsent=accepted; ${expires}; path=/`;
    setShowConsent(false);
  };

  const handleReject = () => {
    // Set cookie for 1 year with rejection
    const date = new Date();
    date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `cookieConsent=rejected; ${expires}; path=/`;
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full md:w-auto">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Política de Cookies
          </h2>
          <p className="text-sm text-gray-600">
            Utilizamos cookies para mejorar tu experiencia en nuestro sitio web. Estas cookies nos ayudan a entender cómo utilizas el sitio y a ofrecerte contenido personalizado.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleReject}
            variant="outlined"
            className="flex-1"
          >
            Rechazar
          </Button>
          <Button
            onClick={handleAccept}
            variant="primary"
            className="flex-1"
          >
            Aceptar
          </Button>
        </div>
      </div>
    </div>
  );
}
