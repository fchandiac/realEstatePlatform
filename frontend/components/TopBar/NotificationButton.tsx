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
  className={`relative  rounded-full transition-colors text-background hover:text-secondary focus:outline-none ${className}`}
      data-test-id={dataTestId}
      aria-label="Notificaciones"
    >
      <span
        className="material-symbols-outlined cursor-pointer"
        style={{ fontSize: 32, width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        aria-hidden
      >
        notifications
      </span>
      {count > 0 && (
        <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center min-w-[18px]">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
};

export default NotificationButton;