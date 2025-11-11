'use client'
import React, { useState, useContext } from 'react';
import SideBar, { SideBarMenuItem } from './SideBar';
import Logo from '../Logo/Logo';

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

// Reusable notification button component
interface NotificationButtonProps {
  count?: number;
  onClick?: () => void;
  className?: string;
}

const NotificationButton: React.FC<NotificationButtonProps> = ({ count = 0, onClick, className = '' }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative p-2 rounded-full transition-colors text-background hover:text-accent focus:outline-none ${className}`}
      aria-label="Notificaciones"
    >
      <span
        className="material-symbols-outlined cursor-pointer"
        style={{ fontSize: 24, width: 24, height: 24, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        aria-hidden
      >
        notifications
      </span>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
};

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
  <header className={`w-full flex items-center justify-between px-4 py-2 bg-primary border-b-[5px] border-accent fixed top-0 left-0 z-40 ${className}`}>
          <div className="flex items-center gap-2">
            <Logo src={logoSrc} className="w-10 h-10" data-test-id="top-bar-logo" />
            <span className="ml-2 text-lg font-bold text-background" data-test-id="top-bar-title">{title}</span>
          </div>

          {/* Right side elements */}
          <div className="flex items-center gap-2">
            {/* Notification button */}
            {showNotifications && (
              <NotificationButton
                count={notificationCount}
                onClick={onNotificationsClick}
                data-test-id="top-bar-notifications"
              />
            )}

            {/* User name */}
            {userName && (
              <span className="text-sm font-medium text-background" data-test-id="top-bar-user-name">
                {userName}
              </span>
            )}

            {/* User button */}
            {showUserButton && (
              <button
                type="button"
                onClick={onUserClick}
                className="p-2 rounded-full transition-colors text-background hover:text-accent focus:outline-none"
                data-test-id="top-bar-user-button"
                aria-label="Perfil de usuario"
              >
                <span
                  className="material-symbols-outlined cursor-pointer"
                  style={{ fontSize: 24, width: 24, height: 24, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
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
          </div>
        </header>

        {showSidebar && (
          <>
            <div
              className="fixed inset-0 z-50 bg-black opacity-60"
              onClick={close}
            />

            {/* If a SideBarComponent prop is provided use it, otherwise render internal SideBar when menuItems exist */}
            {SideBarComponent ? (
              <SideBarComponent onClose={close} />
            ) : menuItems ? (
              <SideBar menuItems={menuItems} onClose={close} />
            ) : null}
          </>
        )}
      </div>
    </SideBarContext.Provider>
  );
};

export default TopBar;
