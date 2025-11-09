"use client";
import PortalTopBar from "./ui/PortalTopBar";
import PortalFooter from "./ui/PortalFooter";
import Wsp from "./ui/Wsp";
import Slider from "./ui/Slider";
import NavBar from "./ui/NavBar";

type PortalLayoutProps = {
  children: React.ReactNode;
};

export default function PortalLayout({ children }: PortalLayoutProps) {


  return (

    <div className="min-h-screen flex flex-col relative">
      <PortalTopBar
      // onMenuClick={() => setSidebarOpen(true)} 

      />

          <NavBar />
      {/* <VisitorSideBar open={sidebarOpen} onClose={() => setSidebarOpen(false)} /> */}
      <main className="flex-1">
        {children}
      </main>
      <PortalFooter />
      <Wsp />
    </div>
  );
}


