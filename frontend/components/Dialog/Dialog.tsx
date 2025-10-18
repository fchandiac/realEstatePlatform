import React, { useState, useEffect } from "react";

/**
 * Dial  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-center transition-all duration-200 ${
        isVisible ? 'bg-black/70 opacity-100' : 'bg-black/0 opacity-0'
      } ${scroll === 'body' ? 'overflow-y-auto pt-8 pb-8' : ''}`}
      onClick={onClose}
      data-test-id="dialog-root"
    >
      <div
        className={`bg-white rounded-lg shadow-lg p-6 ${sizeClasses[size]} w-full relative ${
          scroll === 'body' ? 'max-h-none my-0' : 'flex flex-col'
        } transition-all duration-200 transform ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={e => e.stopPropagation()}
        data-test-id="dialog-content"
      >* Props:
 * - open: boolean - Controla si el dialog está abierto
 * - onClose: () => void - Función para cerrar el dialog
 * - title?: string - Título opcional del dialog
 * - children: React.ReactNode - Contenido del dialog
 * - size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' - Tamaño responsivo (default: 'md')
 * - scroll?: 'body' | 'paper' - Controla dónde ocurre el scroll del CONTENIDO (default: 'paper')
 *   - 'paper': el contenido largo hace scroll dentro del dialog (app scroll SIEMPRE bloqueado) [RECOMENDADO]
 *   - 'body': el contenido largo hace scroll en el overlay del dialog (app scroll SIEMPRE bloqueado)
 *
 * Tamaños disponibles:
 * - xs: min 320px, max 448px (md) / 384px (sm) / 448px (md)
 * - sm: min 400px, max 512px (lg) / 448px (md) / 512px (lg)
 * - md: min 480px, max 576px (xl) / 512px (lg) / 576px (xl)
 * - lg: min 560px, max 672px (2xl) / 576px (xl) / 672px (2xl)
 * - xl: min 640px, max 1024px (4xl) / 672px (2xl) / 1024px (4xl)
 * - md: min 400px, max 512px (lg) / 448px (md) / 384px (sm)
 * - lg: min 480px, max 576px (xl) / 512px (lg) / 384px (sm)
 * - xl: min 560px, max 672px (2xl) / 576px (xl) / 384px (sm)
 */

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  scroll?: 'body' | 'paper';
}

const Dialog: React.FC<DialogProps> = ({ open, onClose, title, children, size = 'md', scroll = 'paper' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Mapeo de tamaños responsivos
  const sizeClasses = {
    xs: 'min-w-[320px] max-w-md sm:max-w-sm md:max-w-md',
    sm: 'min-w-[400px] max-w-lg sm:max-w-md md:max-w-lg',
    md: 'min-w-[480px] max-w-xl sm:max-w-lg md:max-w-xl',
    lg: 'min-w-[560px] max-w-2xl sm:max-w-xl md:max-w-2xl',
    xl: 'min-w-[640px] max-w-4xl sm:max-w-2xl md:max-w-4xl',
  };

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      // SIEMPRE bloquear scroll del body cuando hay un dialog abierto
      document.body.style.overflow = 'hidden';
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      // Restaurar scroll del body
      document.body.style.overflow = 'unset';
      setTimeout(() => setShouldRender(false), 200);
    }
  }, [open]);

  if (!shouldRender) return null;
  
  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-200 ${
        isVisible ? 'bg-black/70 opacity-100' : 'bg-black/0 opacity-0'
      } ${scroll === 'body' ? 'overflow-y-auto flex items-start justify-center pt-16 pb-8' : 'flex items-center justify-center'}`}
      onClick={onClose}
      data-test-id="dialog-root"
    >
      <div
        className={`bg-white rounded-lg shadow-lg p-6 ${sizeClasses[size]} w-full relative ${
          scroll === 'body' ? 'max-h-none mb-8' : 'flex flex-col max-h-[90vh]'
        } transition-all duration-200 transform ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={e => e.stopPropagation()}
        data-test-id="dialog-content"
      >
        {title && title !== "" && (
          <h2 className="title p-1 w-full" data-test-id="dialog-title">{title}</h2>
        )}
        <div className={`w-full ${scroll === 'paper' ? 'flex-1 overflow-y-auto' : ''}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Dialog;
