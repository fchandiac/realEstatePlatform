import Slider from "./ui/Slider";

export default function PortalPage() {
  return (
    <>
      <div className="max-w-4xl mx-auto py-16">
        <h1 className="text-4xl font-bold text-center mb-8 text-primary">Bienvenido a la Plataforma Inmobiliaria</h1>
        <p className="text-lg text-center text-muted-foreground mb-12">
          Esta página está en desarrollo. Pronto podrás explorar propiedades, conocer nuestro equipo y acceder a todos los servicios.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card rounded-lg p-6 border border-border text-center">
            <span className="material-symbols-sharp text-5xl text-primary mb-4">apartment</span>
            <h2 className="text-xl font-semibold mb-2">Propiedades</h2>
            <p className="text-sm text-muted-foreground">Explora propiedades en venta y arriendo.</p>
          </div>
          <div className="bg-card rounded-lg p-6 border border-border text-center">
            <span className="material-symbols-sharp text-5xl text-primary mb-4">groups</span>
            <h2 className="text-xl font-semibold mb-2">Nuestro Equipo</h2>
            <p className="text-sm text-muted-foreground">Conoce a los profesionales que te acompañan.</p>
          </div>
          <div className="bg-card rounded-lg p-6 border border-border text-center">
            <span className="material-symbols-sharp text-5xl text-primary mb-4">support_agent</span>
            <h2 className="text-xl font-semibold mb-2">Servicios</h2>
            <p className="text-sm text-muted-foreground">Accede a tasación, administración y más.</p>
          </div>
        </div>
      </div>
    </>
  );
}
