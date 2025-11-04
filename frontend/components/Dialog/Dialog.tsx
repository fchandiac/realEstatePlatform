import React, { useState, useEffect } from 'react';

interface ResponsiveWidth {
  xs?: string | number;
  sm?: string | number;
  md?: string | number;
  lg?: string | number;
  xl?: string | number;
}

interface ResponsiveBehavior {
  xs?: {
    center?: boolean;
    position?: 'center' | 'top';
    marginX?: string;
    marginY?: string;
  };
  sm?: {
    center?: boolean;
    position?: 'center' | 'top';
    marginX?: string;
    marginY?: string;
  };
  md?: {
    center?: boolean;
    position?: 'center' | 'top';
    marginX?: string;
    marginY?: string;
  };
  lg?: {
    center?: boolean;
    position?: 'center' | 'top';
    marginX?: string;
    marginY?: string;
  };
  xl?: {
    center?: boolean;
    position?: 'center' | 'top';
    marginX?: string;
    marginY?: string;
  };
}

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  // Preset sizes. 'custom' allows using maxWidth prop.
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  // If provided and size === 'custom', overrides dialog max width. number -> px or string with units
  maxWidth?: number | string;
  // Enable full width behavior on xs (overrides size presets)
  fullWidthOnXs?: boolean;
  // Enable full width on all screens
  fullWidth?: boolean;
  // Minimum width for the dialog
  minWidth?: number | string;
  // Responsive width configuration per breakpoint
  responsiveWidth?: ResponsiveWidth;
  // Custom classes for xs margins (defaults used if not provided)
  xsMarginX?: string;
  xsMarginY?: string;
  // SM horizontal margin override
  smMarginX?: string;
  // SM vertical margin override
  smMarginY?: string;
  // MD horizontal margin override
  mdMarginX?: string;
  // MD vertical margin override
  mdMarginY?: string;
  // LG vertical margin override
  lgMarginY?: string;
  // XL horizontal margin override (string with tailwind or arbitrary)
  xlMarginX?: string;
  // XL vertical margin override
  xlMarginY?: string;
  // Whether the dialog centers vertically (on sm+) or sticks to top
  centerOnScreen?: boolean;
  // Responsive behavior configuration
  responsiveBehavior?: ResponsiveBehavior;
  // scroll behavior: 'body' keeps page scrollable; 'paper' enables internal scroller
  scroll?: 'body' | 'paper';
  // Height control props
  height?: number | string;
  maxHeight?: number | string;
  minHeight?: number | string;
  // Animation duration in milliseconds
  animationDuration?: number;
  // Overflow behavior
  overflowBehavior?: 'visible' | 'hidden' | 'auto';
  // Z-index override
  zIndex?: number;
  // Disable closing on backdrop click
  disableBackdropClick?: boolean;
  // Make dialog persistent (no ESC or backdrop close)
  persistent?: boolean;
  // Extra classes for outer content wrapper
  className?: string;
  // Inline style forwarded to dialog content (useful for child-specific widths)
  contentStyle?: React.CSSProperties;
  // When true, allow children to overflow horizontally
  allowOverflowX?: boolean;
  // Actions to display in the footer
  actions?: React.ReactNode;
  // Hide the actions area (useful when actions are handled internally by children)
  hideActions?: boolean;
}

const presetSizeClasses: Record<'sm' | 'md' | 'lg' | 'xl', string> = {
  sm: 'sm:min-w-[400px] sm:max-w-lg md:min-w-[400px] md:max-w-lg lg:min-w-[400px] lg:max-w-lg',
  md: 'sm:min-w-[480px] sm:max-w-xl md:min-w-[480px] md:max-w-xl lg:min-w-[480px] lg:max-w-xl',
  lg: 'sm:min-w-[560px] sm:max-w-2xl md:min-w-[560px] md:max-w-2xl lg:min-w-[560px] lg:max-w-2xl',
  xl: 'sm:min-w-[640px] sm:max-w-4xl md:min-w-[640px] md:max-w-4xl lg:min-w-[640px] lg:max-w-4xl',
};

const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  title,
  children,
  size = 'md',
  maxWidth,
  fullWidthOnXs = true,
  fullWidth = false,
  minWidth,
  responsiveWidth,
  xsMarginX = 'mx-4',
  xsMarginY = 'my-0',
  smMarginX = 'sm:mx-8',
  smMarginY = 'sm:mb-0',
  mdMarginX = 'md:mx-12',
  mdMarginY = 'md:mb-4',
  lgMarginY = 'lg:mb-4',
  xlMarginX = 'xl:mx-[200px]',
  xlMarginY = 'xl:mb-4',
  centerOnScreen = false,
  responsiveBehavior,
  scroll = 'paper',
  height,
  maxHeight,
  minHeight,
  animationDuration = 200,
  overflowBehavior = 'auto',
  zIndex = 50,
  disableBackdropClick = false,
  persistent = false,
  className = '',
  contentStyle,
  allowOverflowX = false,
  actions,
  hideActions = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      setTimeout(() => setShouldRender(false), animationDuration);
    }
  }, [open, animationDuration]);

  // Bloquear/restaurar scroll del body cuando el dialog se abre/cierra
  useEffect(() => {
    if (open) {
      // Guardar el overflow original del body
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      // Restaurar al desmontar o cerrar
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open]);

  // Handle ESC key
  useEffect(() => {
    if (!open || persistent) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose, persistent]);

  if (!shouldRender) return null;

  // Build responsive width classes
  const buildResponsiveWidthClasses = () => {
    if (!responsiveWidth) return '';

    const classes: string[] = [];
    Object.entries(responsiveWidth).forEach(([breakpoint, value]) => {
      if (value) {
        const widthValue = typeof value === 'number' ? `${value}px` : value;
        if (breakpoint === 'xs') {
          classes.push(`min-w-[${widthValue}] max-w-[${widthValue}]`);
        } else {
          classes.push(`${breakpoint}:min-w-[${widthValue}] ${breakpoint}:max-w-[${widthValue}]`);
        }
      }
    });
    return classes.join(' ');
  };

  // Build responsive behavior classes
  const buildResponsiveBehaviorClasses = () => {
    if (!responsiveBehavior) return '';

    const classes: string[] = [];
    Object.entries(responsiveBehavior).forEach(([breakpoint, config]) => {
      if (config) {
        const prefix = breakpoint === 'xs' ? '' : `${breakpoint}:`;
        if (config.marginX) classes.push(`${prefix}${config.marginX}`);
        if (config.marginY) classes.push(`${prefix}${config.marginY}`);
      }
    });
    return classes.join(' ');
  };

  // Determine positioning classes - default is centered
  const getPositioningClasses = () => {
    // Default behavior: center the dialog
    if (!responsiveBehavior && centerOnScreen) {
      return 'items-center justify-center';
    }

    if (!responsiveBehavior && !centerOnScreen) {
      return 'items-start justify-center pt-16';
    }

    // If responsive behavior is defined, use it
    // For simplicity, we'll use a basic responsive approach
    // In a real app, you'd want to use a proper breakpoint hook
    return 'items-center justify-center sm:items-center sm:justify-center';
  };

  const baseXsMargins = `${xsMarginX} ${xsMarginY} ${smMarginX} ${smMarginY} ${mdMarginX} ${mdMarginY} ${lgMarginY} ${xlMarginX} ${xlMarginY}`;
  const preset =
    size === 'custom' ? '' : (size === 'xs' ? '' : presetSizeClasses[size as 'sm' | 'md' | 'lg' | 'xl']);

  const computedMaxWidth =
    size === 'custom' && maxWidth
      ? typeof maxWidth === 'number'
        ? `${maxWidth}px`
        : maxWidth
      : undefined;

  const rootScrollClasses =
    scroll === 'body'
      ? `overflow-y-auto flex ${getPositioningClasses()} pb-8`
      : `flex ${getPositioningClasses()}`;

  const contentClass = [
    'bg-white rounded-lg shadow-lg p-4 sm:p-6',
    fullWidth ? 'w-full mx-4 sm:mx-6 md:mx-8' : baseXsMargins,
    preset,
    buildResponsiveWidthClasses(),
    buildResponsiveBehaviorClasses(),
    'relative',
    scroll === 'body' ? 'max-h-none mb-8' : 'flex flex-col max-h-[90vh]',
    'transition-all',
    isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const contentWrapperStyle: React.CSSProperties = {
    width: fullWidth ? '100%' : 'auto',
    maxWidth: computedMaxWidth || undefined,
    minWidth: minWidth ? (typeof minWidth === 'number' ? `${minWidth}px` : minWidth) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
    maxHeight: maxHeight ? (typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight) : undefined,
    minHeight: minHeight ? (typeof minHeight === 'number' ? `${minHeight}px` : minHeight) : undefined,
    overflow: overflowBehavior,
    transitionDuration: `${animationDuration}ms`,
    ...contentStyle,
  };

  const backdropStyle: React.CSSProperties = {
    zIndex,
    transitionDuration: `${animationDuration}ms`,
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !disableBackdropClick && !persistent) {
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Dialog'}
      className={`fixed inset-0 transition-all bg-black/70 ${isVisible ? 'opacity-100' : 'opacity-0'} ${rootScrollClasses}`}
      style={backdropStyle}
      onClick={handleBackdropClick}
      data-test-id="dialog-root"
    >
      <div
        className={contentClass}
        style={contentWrapperStyle}
        onClick={(e) => e.stopPropagation()}
        data-test-id="dialog-content"
      >
        {title && title !== '' && (
          <h2 className="title p-1 w-full" data-test-id="dialog-title">
            {title}
          </h2>
        )}

        <div
          className={`w-full pt-2 ${scroll === 'paper' ? 'flex-1 overflow-y-auto' : ''}`}
          data-test-id="dialog-body"
        >
          {children}
        </div>

        {/* Actions area - conditionally rendered */}
        {!hideActions && actions && (
          <div className="w-full pt-4 border-t border-gray-200 mt-4" data-test-id="dialog-actions">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dialog;
