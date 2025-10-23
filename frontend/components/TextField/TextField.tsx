import React, { useState, useRef, useEffect } from "react";

interface TextFieldProps {
  label: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  name?: string;
  placeholder?: string;
  startIcon?: string;
  endIcon?: string;
  className?: string;
  variante?: "normal" | "contrast";
  rows?: number;
  readOnly?: boolean;
  style?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
  placeholderColor?: string;
  ["data-test-id"]?: string;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  value,
  onChange,
  type = "text",
  name,
  placeholder,
  startIcon,
  endIcon,
  className = "",
  variante = "normal",
  rows,
  required = false,
  readOnly = false,
  labelStyle,
  placeholderColor,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const passwordToggleLabel = showPassword ? "Ocultar contraseña" : "Mostrar contraseña";

  // Función para formatear DNI chileno
  const formatDNI = (value: string): string => {
    // Remover todo lo que no sea número o 'k'/'K'
    let cleanValue = value.replace(/[^0-9kK]/g, '');
    
    // Convertir 'K' a minúscula
    cleanValue = cleanValue.toLowerCase();
    
    if (cleanValue.length === 0) return '';
    if (cleanValue.length === 1) return cleanValue;
    
    // Formatos específicos para DNI chileno:
    // • XX.XXX.XXX-X (9 dígitos: 8 números + 1 dígito verificador)
    // • X.XXX.XXX-X (8 dígitos: 7 números + 1 dígito verificador) 
    // • XX.XXX.XXX-k (8 dígitos + k: 8 números + 'k')
    // • X.XXX.XXX-k (7 dígitos + k: 7 números + 'k')
    
    if (cleanValue.length === 9 && !cleanValue.includes('k')) {
      // XX.XXX.XXX-X (8 dígitos + 1 DV)
      const numbers = cleanValue.slice(0, 8);
      const dv = cleanValue.slice(8);
      return numbers.slice(0, 2) + '.' + numbers.slice(2, 5) + '.' + numbers.slice(5) + '-' + dv;
    } else if (cleanValue.length === 8 && !cleanValue.includes('k')) {
      // X.XXX.XXX-X (7 dígitos + 1 DV)
      const numbers = cleanValue.slice(0, 7);
      const dv = cleanValue.slice(7);
      return numbers.slice(0, 1) + '.' + numbers.slice(1, 4) + '.' + numbers.slice(4) + '-' + dv;
    } else if (cleanValue.length === 9 && cleanValue.endsWith('k')) {
      // XX.XXX.XXX-k (8 dígitos + 'k')
      const numbers = cleanValue.slice(0, 8);
      return numbers.slice(0, 2) + '.' + numbers.slice(2, 5) + '.' + numbers.slice(5) + '-k';
    } else if (cleanValue.length === 8 && cleanValue.endsWith('k')) {
      // X.XXX.XXX-k (7 dígitos + 'k')
      const numbers = cleanValue.slice(0, 7);
      return numbers.slice(0, 1) + '.' + numbers.slice(1, 4) + '.' + numbers.slice(4) + '-k';
    } else {
      // Para otras longitudes, devolver sin formato especial
      return cleanValue;
    }
  };

  // Función para formatear moneda chilena
  const formatCurrency = (value: string): string => {
    // Remover todo lo que no sea número
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length === 0) return '';
    
    // Convertir a número
    const numericValue = parseInt(numbers);
    
    // Formatear como moneda chilena
    return numericValue.toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    });
  };

  const handleDNIChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatDNI(rawValue);
    
    // Crear un evento sintético con el valor formateado
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: formattedValue
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange(syntheticEvent);
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatCurrency(rawValue);
    
    // Crear un evento sintético con el valor formateado
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: formattedValue
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange(syntheticEvent);
  };

  const shrink = focused || value.length > 0;
  const [showPlaceholder, setShowPlaceholder] = useState(!shrink);

  // Unique class for placeholder styling when placeholderColor is provided
  const placeholderClassRef = React.useRef<string | null>(null);
  if (placeholderColor && !placeholderClassRef.current) {
    placeholderClassRef.current = `tf-ph-${Math.random().toString(36).slice(2,9)}`;
  }

  useEffect(() => {
    if (!shrink) {
  const timeout = setTimeout(() => setShowPlaceholder(true), 250);
      return () => clearTimeout(timeout);
    } else {
      setShowPlaceholder(false);
    }
  }, [shrink]);

  // Estilos para variante contrast
  const contrastInput = variante === "contrast"
    ? "border-background text-background focus:border-primary bg-transparent"
    : "text-foreground border-border focus:border-primary bg-transparent";
  const contrastLabel = variante === "contrast"
  ? "bg-foreground text-background"
  : "bg-background text-foreground";

  return (
  <div className={`relative ${className}`} data-test-id="text-field-root"> 
      {typeof startIcon === 'string' && startIcon.length > 0 && (
        <span
          className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-xl text-secondary pointer-events-none flex items-center justify-center z-10"
          style={{ fontSize: 20, width: 20, height: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          
        >
          {startIcon}
        </span>
      )}
      {typeof rows === "number" ? (
        <textarea
          name={name}
          value={value}
          rows={rows}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={onChange}
          className={`${placeholderClassRef.current ?? ''} block w-full min-w-[180px] rounded border-[1px] pr-4 py-2 text-sm font-light text-foreground border-border focus:outline-none transition-colors duration-200 ${(startIcon ? " pl-9" : " px-3")} ${contrastInput} z-0`}
          placeholder={shrink || !showPlaceholder ? "" : (placeholder ?? label) + (required ? ' *' : '')}
          required={required}
          readOnly={readOnly}
          autoComplete="off"
          style={{ backgroundColor: "var(--color-background)", resize: 'none', ...(props.style || {}) }}
          data-test-id={props["data-test-id"]}
          {...props}
        />
      ) : (
        <div className="relative">
          <input
            ref={inputRef}
            type={type === "password" ? (showPassword ? "text" : "password") : (type === "dni" || type === "currency" ? "text" : type)}
            name={name}
            value={value}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={type === "dni" ? handleDNIChange : type === "currency" ? handleCurrencyChange : onChange}
            className={`${placeholderClassRef.current ?? ''} block w-full min-w-[180px] rounded border-[1px] py-2 text-sm font-light text-foreground border-border focus:outline-none transition-colors duration-200 ${(startIcon ? " pl-9" : " px-3")} ${(endIcon || type === "password") ? " pr-10" : " pr-3"} ${contrastInput} z-0`}
            style={{ backgroundColor: "var(--color-background)", ...(props.style || {}) }}
            placeholder={shrink || !showPlaceholder ? "" : (placeholder ?? label) + (required ? ' *' : '')}
            required={required}
            readOnly={readOnly}
            autoComplete="off"
            maxLength={type === "dni" ? 12 : undefined}
            data-test-id={props["data-test-id"]}
            {...(type === "dni" || type === "currency" ? {} : props)}
          />
          {type === "password" && (
            <button
              type="button"
              className={`absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${focused ? "text-primary" : "text-secondary"}`}
              style={{ padding: 0 }}
              onMouseDown={(event) => {
                event.preventDefault();
              }}
              onClick={() => {
                setShowPassword((prev) => !prev);
                inputRef.current?.focus();
              }}
              aria-label={passwordToggleLabel}
              aria-pressed={showPassword}
              data-test-id="password-visibility-toggle"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 20, width: 20, height: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                aria-hidden
              >
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          )}
        </div>
      )}
      {/* Inject scoped placeholder style if requested */}
      {placeholderColor && placeholderClassRef.current && (
        <style>{`input.${placeholderClassRef.current}::placeholder, textarea.${placeholderClassRef.current}::placeholder { color: ${placeholderColor} }`}</style>
      )}
  <label
    className={`absolute left-3 top-0 pointer-events-none transition-all duration-300 ease-in-out px-1 font-light text-xs rounded-t-md ${contrastLabel} z-10 ${shrink ? " -translate-y-2 scale-90 opacity-100" : " opacity-0"}`}
    style={{ ...(labelStyle || {}), backgroundColor: "var(--color-background)", color: labelStyle?.color || "var(--color-foreground)", zIndex: 10 }}
    onClick={() => inputRef.current?.focus()}
    data-test-id="text-field-label"
  >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {typeof endIcon === 'string' && endIcon.length > 0 && (
        <span
          className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-xl text-secondary pointer-events-none flex items-center justify-center z-10"
          style={{ fontSize: 20, width: 20, height: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
         
        >
          {endIcon}
        </span>
      )}
    </div>
  );
};
