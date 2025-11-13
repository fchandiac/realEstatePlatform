'use client'
import React, { useState, useContext } from 'react';
import SideBar, { SideBarMenuItem } from './SideBar';
import NotificationButton from './NotificationButton';

interface TopBarProps {
  title?: string;
  logoSrc?: string;
  className?: string;
  onMenuClick?: () => void;
  SideBarComponent?: React.ComponentType<{ onClose: () => void }>;
  menuItems?: SideBarMenuItem[]; // if provided, TopBar will render SideBar internally
  // New props for user profile and notifications
  showUserButton?: boolean;
  onUserClick?: () => void;
  userName?: string;
  showNotifications?: boolean;
  notificationCount?: number;
  onNotificationsClick?: () => void;
}

interface SideBarControl {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

const SideBarContext = React.createContext<SideBarControl>({
  open: () => {},
  close: () => {},
  isOpen: false,
});

export function useSideBar() {
  return useContext(SideBarContext);
}

const TopBar: React.FC<TopBarProps> = ({
  title = 'title',
  logoSrc,
  className,
  SideBarComponent,
  menuItems,
  showUserButton = false,
  onUserClick,
  userName,
  showNotifications = false,
  notificationCount = 0,
  onNotificationsClick
}) => {
  const [showSidebar, setShowSidebar] = useState(false);

  const open = () => setShowSidebar(true);
  const close = () => setShowSidebar(false);

  return (
    <SideBarContext.Provider value={{ open, close, isOpen: showSidebar }}>
      <div data-test-id="top-bar-root">
  <header className={`w-full flex items-center justify-between px-4 pt-2 bg-background border-b-[5px] border-accent fixed top-0 left-0 z-40 ${className}`}>
          <div className="flex items-center gap-3">
            {logoSrc && (
              <img
                src={logoSrc}
                alt="Logo"
                className="h-10 w-10 object-contain"
                data-test-id="top-bar-logo"
              />
            )}
            <span className="text-lg font-bold text-foreground" data-test-id="top-bar-title">{title}</span>
          </div>

          {/* Right side elements */}
          <div className="flex items-center gap-2">
            {/* User name */}
            {userName && (
              <span className="text-sm font-weight-300 text-foreground" data-test-id="top-bar-user-name">
                {userName}
              </span>
            )}

            {/* Notification button */}
            {showNotifications && (
              <NotificationButton
                count={notificationCount}
                onClick={onNotificationsClick}
                data-test-id="top-bar-notifications"
              />
            )}

            {/* User button */}
            {showUserButton && (
              <button
                type="button"
                onClick={onUserClick}
                className="rounded-full transition-colors text-foreground hover:text-secondary focus:outline-none"
                data-test-id="top-bar-user-button"
                aria-label="Perfil de usuario"
              >
                <span
                  className="material-symbols-outlined cursor-pointer"
                  style={{ fontSize: 32, width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                  aria-hidden
                >
                  person
                </span>
              </button>
            )}

            {/* Menu button */}
            <button
              type="button"
              onClick={open}
              className=" rounded-full transition-colors text-foreground hover:text-secondary focus:outline-none"
              data-test-id="top-bar-menu-button"
              aria-label="Abrir menú"
            >
              <span
                className="material-symbols-outlined cursor-pointer"
                style={{ fontSize: 36, width: 36, height: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                aria-hidden
              >
                menu
              </span>
            </button>
          </div>
        </header>

        {showSidebar && (
          <>
            <div
              className="fixed inset-0 z-50 bg-transparent"
              onClick={close}
            />

            {/* If a SideBarComponent prop is provided use it, otherwise render internal SideBar when menuItems exist */}
            {SideBarComponent ? (
              <SideBarComponent onClose={close} />
            ) : menuItems ? (
              <SideBar menuItems={menuItems} onClose={close} logoUrl={logoSrc} />
            ) : null}
          </>
        )}
      </div>
    </SideBarContext.Provider>
  );
};

export default TopBar;
