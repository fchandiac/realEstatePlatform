import React, { useState, useEffect } from 'react';

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
  // Custom classes for xs margins (defaults used if not provided)
  xsMarginX?: string;
  xsMarginY?: string;
  // XL horizontal margin override (string with tailwind or arbitrary)
  xlMarginX?: string;
  // Whether the dialog centers vertically (on sm+) or sticks to top
  centerOnScreen?: boolean;
  // scroll behavior: 'body' keeps page scrollable; 'paper' enables internal scroller
  scroll?: 'body' | 'paper';
  // Extra classes for outer content wrapper
  className?: string;
  // Inline style forwarded to dialog content (useful for child-specific widths)
  contentStyle?: React.CSSProperties;
  // When true, allow children to overflow horizontally
  allowOverflowX?: boolean;
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
  xsMarginX = 'mx-4',
  xsMarginY = 'my-2',
  xlMarginX = 'xl:mx-[200px]',
  centerOnScreen = false,
  scroll = 'paper',
  className = '',
  contentStyle,
  allowOverflowX = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      setTimeout(() => setShouldRender(false), 220);
    }
  }, [open]);

  if (!shouldRender) return null;

  const baseXsMargins = `${xsMarginX} ${xsMarginY} sm:mx-0 sm:my-0 ${xlMarginX}`;
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
      ? 'overflow-y-auto flex items-start justify-center pt-16 pb-8'
      : 'flex items-center justify-center';

  const contentClass = [
    'bg-white rounded-lg shadow-lg p-4 sm:p-6',
    fullWidthOnXs ? baseXsMargins : `sm:mx-0 sm:my-0 ${xlMarginX}`,
    preset,
    'relative',
    scroll === 'body' ? 'max-h-none mb-8' : 'flex flex-col max-h-[90vh]',
    isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const contentWrapperStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: computedMaxWidth || undefined,
    ...contentStyle,
    overflowX: allowOverflowX ? 'visible' : undefined,
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Dialog'}
      className={`fixed inset-0 z-50 transition-all duration-200 bg-black/70 ${isVisible ? 'opacity-100' : 'opacity-0'} ${rootScrollClasses}`}
      onClick={onClose}
      data-test-id="dialog-root"
    >
      <div
        className={`${contentClass} ${centerOnScreen ? '' : ''}`}
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
      </div>
    </div>
  );
};

export default Dialog;
