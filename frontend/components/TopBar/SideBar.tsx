import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Logo from '../Logo/Logo';
import { Button } from '../Button/Button';

export interface SideBarMenuItem {
  id?: string;
  label: string;
  url?: string;
  children?: SideBarMenuItem[];
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

  // Track which parent items are open using their id or label
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({});

  const toggleOpen = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNavigate = (url?: string) => {
    if (!url) return;
    try {
      router.push(url);
    } catch (e) {
      // noop
    }
    if (typeof onClose === 'function') onClose();
  };

  const renderMenuItem = (item: SideBarMenuItem, idx: number) => {
    const id = item.id ?? `${item.label}-${idx}`;
    const hasChildren = Array.isArray(item.children) && item.children.length > 0;

    if (hasChildren) {
      const isOpen = !!openIds[id];
      return (
        <li key={id}>
          <button
            className="block p-2 rounded-lg text-white/90 hover:bg-white/10 transition-colors duration-200 font-medium w-full flex justify-between items-center text-sm"
            onClick={() => toggleOpen(id)}
            aria-expanded={isOpen}
            data-test-id={`side-bar-parent-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <span>{item.label}</span>
            <svg
              className={`h-4 w-4 transform transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <ul className={`pl-6 space-y-1 mt-1 ${isOpen ? '' : 'hidden'}`}>
            {item.children!.map((child, cIdx) => (
              <li key={(child.id ?? `${child.label}-${cIdx}`)}>
                <button
                  className="w-full text-left px-4 py-2 rounded hover:bg-white/10 transition-colors font-medium cursor-pointer text-sm"
                  onClick={() => handleNavigate(child.url)}
                  data-test-id={`side-bar-child-${child.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {child.label}
                </button>
              </li>
            ))}
          </ul>
        </li>
      );
    }

    return (
      <li key={id}>
        <button
          className="w-full text-left px-4 py-2 rounded hover:bg-white/10 transition-colors font-medium cursor-pointer text-sm"
          onClick={() => handleNavigate(item.url)}
          data-test-id={`side-bar-menu-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {item.label}
        </button>
      </li>
    );
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
        <ul className="flex flex-col gap-2 w-full">
          {menuItems.map((item, idx) => renderMenuItem(item, idx))}
        </ul>
      </nav>

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
