"use client";
import PortalTopBar from "./ui/PortalTopBar";
import PortalFooter from "./ui/PortalFooter";
import Wsp from "./ui/Wsp";
import NavBar from "./ui/NavBar";
import CookieConsent from "./ui/CookieConsent";

type PortalLayoutProps = {
  children: React.ReactNode;
};

export default function PortalLayout({ children }: PortalLayoutProps) {


  return (

    <div className="min-h-screen flex flex-col relative">
      <CookieConsent />
      <PortalTopBar
      // onMenuClick={() => setSidebarOpen(true)} 

      />

      {/* Contenedor para NavBar que será sticky bajo el Slider */}
      <div className="sticky top-16 z-40 bg-background shadow-[0_4px_8px_-4px_rgba(0,0,0,0.12)]">
        <NavBar />
      </div>
      
      {/* <VisitorSideBar open={sidebarOpen} onClose={() => setSidebarOpen(false)} /> */}
      <main className="flex-1">
        {children}
      </main>
      <PortalFooter />
      <Wsp />
    </div>
  );
}


