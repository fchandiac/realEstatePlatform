"use client";

import { useState, useCallback, useEffect, useMemo, useTransition } from "react";
import Dialog from "@/components/Dialog/Dialog";
import LoginForm from "./ui/LoginForm";
import RegisterForm from "./ui/RegisterForm";
import { useAuth } from "@/app/providers";
import PortalTopBar from "./ui/PortalTopBar";
import PortalFooter from "./ui/PortalFooter";
import Wsp from "./ui/Wsp";

type PortalLayoutProps = {
  children: React.ReactNode;
};

export default function PortalLayout({ children }: PortalLayoutProps) {


  return (

    <div className="min-h-screen flex flex-col relative">
      <PortalTopBar
      // onMenuClick={() => setSidebarOpen(true)} 

      />
      {/* <VisitorSideBar open={sidebarOpen} onClose={() => setSidebarOpen(false)} /> */}
      <main className="flex-1">
        {children}
      </main>
      <PortalFooter />
      <Wsp />
    </div>
  );
}


