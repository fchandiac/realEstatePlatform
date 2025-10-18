

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Logo from '../Logo/Logo';
import { Button } from '../Button/Button';

export interface SideBarMenuItem {
  label: string;
  icon?: string; // material-symbols-outlined
  url: string;
}

interface SideBarProps {
  menuItems: SideBarMenuItem[];
  onClose?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador',
  operator: 'Operador',
  inspector: 'Inspector',
  director: 'Director',
};

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'App';
const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || '0.0.0';

const SideBar: React.FC<SideBarProps> = ({ menuItems, className, style, onClose }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const handleNavigate = (url: string) => {
    router.push(url);
    if (typeof onClose === 'function') onClose();
  };
  return (
    <aside
      className={`fixed top-0 left-0 z-50 w-64 h-full bg-primary text-background flex flex-col items-center py-6 shadow-lg ${className ? className : ''}`}
      style={style}
      data-test-id="side-bar-root"
    >
      <Logo className="w-[180px] h-[180px] mb-6" data-test-id="side-bar-logo" />
      <div className="mb-6 text-center">
        <div className="text-xl font-bold" data-test-id="side-bar-app-name">{APP_NAME}</div>
        <div className="text-sm opacity-70" data-test-id="side-bar-app-version">{APP_VERSION}</div>
      </div>
      {/* Sección de datos de usuario */}
      {user && (
        <div className="w-full px-6 mb-6">
          <div className="flex items-center border border-white rounded-lg px-3 py-2 gap-3" style={{ background: 'transparent', borderWidth: '0.3px' }}>
            <span className="material-symbols-outlined text-white text-3xl">person</span>
            <div className="flex flex-col min-w-0">
              <span className="text-base font-bold truncate">{(user as any).userName}</span>
              <span className="text-xs opacity-60 capitalize truncate">{ROLE_LABELS[(user as any).role as keyof typeof ROLE_LABELS] || (user as any).role}</span>
            </div>
          </div>
        </div>
      )}
      <nav className="w-full px-4 flex-1 mt-2">
        <ul className="flex flex-col gap-2">
          {menuItems.map((item, idx) => (
            <li key={item.url + idx}>
              <button
                className="w-full text-left px-4 py-2 rounded hover:bg-background/10 transition-colors font-medium cursor-pointer flex items-center gap-2"
                onClick={() => handleNavigate(item.url)}
                data-test-id={`side-bar-menu-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {item.icon && (
                  <span className="material-symbols-outlined align-middle mr-2">{item.icon}</span>
                )}
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      {/* Divider y botón cerrar sesión al fondo */}
      <div className="w-full mt-auto px-6 pb-2">
        <Button
          variant="outlined"
          className="w-full"
          onClick={() => signOut({ callbackUrl: '/' })}
          data-test-id="side-bar-logout-btn"
        >
          Cerrar sesión
        </Button>
      </div>
    </aside>
  );
};

export default SideBar;
