
'use client'
import React, { useState } from 'react';
import SideBar from './SideBar';
import Logo from '../Logo/Logo';





interface TopBarProps {
  title?: string;
  logoSrc?: string;
  className?: string;
  onMenuClick?: () => void;
  SideBarComponent?: React.ComponentType<{ onClose: () => void }>;
}


const TopBar: React.FC<TopBarProps> = ({ title = 'title', logoSrc, className, SideBarComponent }) => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div data-test-id="top-bar-root">
      <header className={`w-full flex items-center justify-between px-4 py-2 bg-primary border-b border-border fixed top-0 left-0 z-40 ${className}`}> 
        <div className="flex items-center gap-2">
          <Logo src={logoSrc} className="w-10 h-10" data-test-id="top-bar-logo" />
          <span className="ml-2 text-lg font-bold text-background" data-test-id="top-bar-title">{title}</span>
        </div>
  <button
    type="button"
    onClick={() => setShowSidebar(true)}
    className="p-2 rounded-full transition-colors text-background hover:text-accent focus:outline-none"
    data-test-id="top-bar-menu-button"
    aria-label="Abrir menú"
  >
    <span
      className="material-symbols-outlined cursor-pointer"
      style={{ fontSize: 28, width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      aria-hidden
    >
      menu
    </span>
  </button>
      </header>
      {showSidebar && SideBarComponent && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black opacity-60"
            onClick={() => setShowSidebar(false)}
          />
          <SideBarComponent onClose={() => setShowSidebar(false)} />
        </>
      )}
    </div>
  );
};

export default TopBar;
