"use client";

import { useState } from 'react';
import Dialog from '@/components/Dialog/Dialog';
import { Button } from '@/components/Button/Button';

export default function DialogDemo() {
  const [dialogs, setDialogs] = useState({
    basic: false,
    responsive: false,
    heightControl: false,
    fullWidth: false,
    persistent: false,
    customAnimation: false,
  });

  const openDialog = (key: keyof typeof dialogs) => {
    setDialogs(prev => ({ ...prev, [key]: true }));
  };

  const closeDialog = (key: keyof typeof dialogs) => {
    setDialogs(prev => ({ ...prev, [key]: false }));
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Dialog Component Demo</h1>
        <p className="text-lg text-gray-600 mb-8 text-center">
          Prueba todas las nuevas características responsivas del componente Dialog
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dialog Básico */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Dialog Básico</h2>
            <p className="text-gray-600 mb-4">Diálogo simple con configuración por defecto</p>
            <Button onClick={() => openDialog('basic')} className="w-full">
              Abrir Dialog Básico
            </Button>
          </div>

          {/* Dialog Responsive */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Dialog Responsive</h2>
            <p className="text-gray-600 mb-4">Anchos diferentes por breakpoint</p>
            <Button onClick={() => openDialog('responsive')} className="w-full">
              Abrir Dialog Responsive
            </Button>
          </div>

          {/* Control de Altura */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Control de Altura</h2>
            <p className="text-gray-600 mb-4">Altura fija y máxima controlada</p>
            <Button onClick={() => openDialog('heightControl')} className="w-full">
              Abrir con Control de Altura
            </Button>
          </div>

          {/* Full Width */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Full Width</h2>
            <p className="text-gray-600 mb-4">Ancho completo en todas las pantallas</p>
            <Button onClick={() => openDialog('fullWidth')} className="w-full">
              Abrir Full Width
            </Button>
          </div>

          {/* Persistent */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Persistent</h2>
            <p className="text-gray-600 mb-4">No se cierra con ESC ni backdrop</p>
            <Button onClick={() => openDialog('persistent')} className="w-full">
              Abrir Dialog Persistent
            </Button>
          </div>

          {/* Animación Personalizada */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Animación Lenta</h2>
            <p className="text-gray-600 mb-4">Animación más lenta (1 segundo)</p>
            <Button onClick={() => openDialog('customAnimation')} className="w-full">
              Abrir con Animación Lenta
            </Button>
          </div>
        </div>

        {/* Dialog Básico */}
        <Dialog
          open={dialogs.basic}
          onClose={() => closeDialog('basic')}
          title="Dialog Básico"
        >
          <div className="space-y-4">
            <p>Este es un diálogo básico con la configuración por defecto.</p>
            <p>Se adapta automáticamente a diferentes tamaños de pantalla.</p>
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => closeDialog('basic')}>
                Cancelar
              </Button>
              <Button onClick={() => closeDialog('basic')}>
                Aceptar
              </Button>
            </div>
          </div>
        </Dialog>

        {/* Dialog Responsive */}
        <Dialog
          open={dialogs.responsive}
          onClose={() => closeDialog('responsive')}
          title="Dialog Responsive"
          responsiveWidth={{
            xs: '90vw',
            sm: '400px',
            md: '500px',
            lg: '600px',
            xl: '700px'
          }}
          responsiveBehavior={{
            xs: { center: true, marginX: 'mx-4', marginY: 'my-4' },
            sm: { center: true, marginX: 'mx-8' },
            lg: { center: false, position: 'top', marginX: 'mx-12' }
          }}
        >
          <div className="space-y-4">
            <p>Este diálogo cambia su ancho según el breakpoint:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>XS (móvil):</strong> 90vw con márgenes mx-4</li>
              <li><strong>SM (tablet):</strong> 400px centrado</li>
              <li><strong>MD:</strong> 500px centrado</li>
              <li><strong>LG (desktop):</strong> 600px en la parte superior</li>
              <li><strong>XL:</strong> 700px en la parte superior</li>
            </ul>
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => closeDialog('responsive')}>
                Cerrar
              </Button>
            </div>
          </div>
        </Dialog>

        {/* Control de Altura */}
        <Dialog
          open={dialogs.heightControl}
          onClose={() => closeDialog('heightControl')}
          title="Control de Altura"
          height="400px"
          maxHeight="80vh"
          minHeight="300px"
          scroll="paper"
        >
          <div className="space-y-4">
            <p>Este diálogo tiene control preciso de altura:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>Altura fija:</strong> 400px</li>
              <li><strong>Altura máxima:</strong> 80vh</li>
              <li><strong>Altura mínima:</strong> 300px</li>
              <li><strong>Scroll interno:</strong> paper mode</li>
            </ul>
            <div className="space-y-2">
              {Array.from({ length: 20 }, (_, i) => (
                <p key={i} className="text-sm text-gray-600">
                  Línea de contenido {i + 1} para probar el scroll interno del diálogo.
                </p>
              ))}
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => closeDialog('heightControl')}>
                Cerrar
              </Button>
            </div>
          </div>
        </Dialog>

        {/* Full Width */}
        <Dialog
          open={dialogs.fullWidth}
          onClose={() => closeDialog('fullWidth')}
          title="Full Width Dialog"
          fullWidth={true}
          maxHeight="60vh"
        >
          <div className="space-y-4">
            <p>Este diálogo ocupa todo el ancho disponible en todas las pantallas.</p>
            <p>Útil para formularios grandes o contenido que necesita mucho espacio horizontal.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded">
                <h3 className="font-semibold">Columna 1</h3>
                <p className="text-sm">Contenido de ejemplo</p>
              </div>
              <div className="bg-green-50 p-4 rounded">
                <h3 className="font-semibold">Columna 2</h3>
                <p className="text-sm">Contenido de ejemplo</p>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => closeDialog('fullWidth')}>
                Cerrar
              </Button>
            </div>
          </div>
        </Dialog>

        {/* Persistent */}
        <Dialog
          open={dialogs.persistent}
          onClose={() => closeDialog('persistent')}
          title="Dialog Persistent"
          persistent={true}
          disableBackdropClick={true}
        >
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
              <p className="font-semibold text-yellow-800">⚠️ Dialog Persistent</p>
              <p className="text-sm text-yellow-700">
                Este diálogo no se puede cerrar haciendo clic fuera ni presionando ESC.
                Debes usar el botón de cerrar.
              </p>
            </div>
            <p>Útil para confirmaciones importantes o procesos que no deben interrumpirse.</p>
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => closeDialog('persistent')}>
                Cerrar
              </Button>
            </div>
          </div>
        </Dialog>

        {/* Animación Personalizada */}
        <Dialog
          open={dialogs.customAnimation}
          onClose={() => closeDialog('customAnimation')}
          title="Animación Lenta"
          animationDuration={1000}
          size="lg"
        >
          <div className="space-y-4">
            <p>Este diálogo tiene una animación más lenta (1 segundo) para abrir/cerrar.</p>
            <p>La duración de animación se puede personalizar según las necesidades de UX.</p>
            <div className="bg-purple-50 p-4 rounded">
              <p className="text-sm text-purple-700">
                <strong>Propiedad:</strong> animationDuration={1000}
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => closeDialog('customAnimation')}>
                Cerrar
              </Button>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
}