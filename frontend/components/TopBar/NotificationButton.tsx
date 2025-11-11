import React from 'react';

interface NotificationButtonProps {
  count?: number;
  onClick?: () => void;
  className?: string;
  'data-test-id'?: string;
}

const NotificationButton: React.FC<NotificationButtonProps> = ({
  count = 0,
  onClick,
  className = '',
  'data-test-id': dataTestId
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative p-2 rounded-full transition-colors text-background hover:text-accent focus:outline-none ${className}`}
      data-test-id={dataTestId}
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

export default NotificationButton;