'use client'
import React, { useState, useEffect, useRef } from "react";
import DropdownList from "@/app/components/DropdownList/DropdownList";
import IconButton from "@/app/components/IconButton/IconButton";

export interface Option {
  id: number;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder: string;
  value?: number | null;
  onChange?: (id: number | null) => void;
  required?: boolean;
  name?: string;
  ["data-test-id"]?: string;
}

const Select: React.FC<SelectProps> = ({ options, placeholder, value = null, onChange, required = false, name, ...props }) => {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selected = options.find(opt => opt.id === value);
  const shrink = focused || selected;
  const onChangeRef = useRef(onChange);

  // Update ref when onChange changes
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Handle form validation
  useEffect(() => {
    if (required) {
      const hiddenInput = document.querySelector(`input[name="${name || 'select-validation'}"]`) as HTMLInputElement;
      if (hiddenInput) {
        if (value === null || value === undefined) {
          hiddenInput.setCustomValidity('Este campo es requerido');
        } else {
          hiddenInput.setCustomValidity('');
        }
      }
    }
  }, [value, required, name]);

  // Manejo global de teclado para mejor compatibilidad con dialogs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!focused) return;

      if (!open && ["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) {
        e.preventDefault();
        setOpen(true);
        setHighlightedIndex(e.key === "ArrowUp" ? options.length - 1 : 0);
        return;
      }

      if (!open) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex(i => (i < options.length - 1 ? i + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex(i => (i > 0 ? i - 1 : options.length - 1));
      } else if (e.key === "Enter" && highlightedIndex >= 0) {
        e.preventDefault();
        onChangeRef.current?.(options[highlightedIndex].id);
        setOpen(false);
        setHighlightedIndex(-1);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        setHighlightedIndex(-1);
      }
    };

    if (focused) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [focused, open, options, highlightedIndex]);

  // Ref array for options
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    if (open && highlightedIndex >= 0 && optionRefs.current[highlightedIndex]) {
      optionRefs.current[highlightedIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex, open]);

  return (
    <div className="relative w-full" data-test-id={props["data-test-id"] || "select-root"}>
      {/* Input oculto para validación HTML nativa */}
      <input
        type="text"
        value={value !== null && value !== undefined ? value.toString() : ''}
        required={required}
        onChange={() => {}} // Controlado por el div clickeable
        name={name || "select-validation"}
        style={{ 
          position: 'absolute', 
          left: 0, 
          top: 0, 
          width: '100%', 
          height: '100%', 
          opacity: 0, 
          pointerEvents: 'none',
          zIndex: -1
        }}
        tabIndex={-1}
        aria-hidden="true"
      />
      
      <div
        className={`block w-full min-w-[180px] rounded border-[1px] px-3 py-2 text-sm font-light text-foreground focus:outline-none transition-colors duration-200 border-border ${focused ? 'border-primary' : ''} ${value !== null && value !== undefined ? 'pr-16' : 'pr-10'} appearance-none cursor-pointer flex items-center`}
        tabIndex={0}
        onClick={() => setOpen(!open)}
        onBlur={() => { 
          // Solo cerrar si no estamos seleccionando
          if (!isSelecting) {
            setTimeout(() => setOpen(false), 150); 
          }
          setFocused(false); 
        }}
        onFocus={() => setFocused(true)}
        data-test-id="select-input"
        style={{ position: 'relative', background: 'var(--color-background)' }}
        role="combobox"
        aria-expanded={open}
        aria-required={required}
        aria-invalid={required && (value === null || value === undefined)}
      >
        {selected ? (
          <span className="text-sm font-light text-foreground">{selected.label}</span>
        ) : (
          <span className={`text-sm font-light text-gray-400 ${shrink ? 'opacity-0' : 'opacity-100'}`}>
            {placeholder}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
        )}
      </div>
      
      <label
        className={`absolute left-3 top-0 pointer-events-none transition-all duration-300 ease-in-out px-1 font-light text-xs text-foreground` +
          (shrink ? " -translate-y-2 scale-90 opacity-100" : " opacity-0")}
        style={{ backgroundColor: "var(--color-background)" }}
        data-test-id="select-label"
      >
        {placeholder}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {value !== null && value !== undefined && (
        <IconButton
          icon="close_small"
          variant="text"
          className={`absolute right-10 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center ${focused ? 'text-primary' : 'text-secondary'}`}
          style={{lineHeight:0, padding: 0, margin: 0}}
          onClick={() => onChange?.(null)}
          aria-label="Limpiar selección"
          data-test-id="select-clear-btn"
          tabIndex={-1}
        />
      )}
      
      <IconButton
        icon="arrow_drop_down"
        variant="text"
        className={`absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center ${focused ? 'text-primary' : 'text-secondary'}`}
        style={{lineHeight:0, padding: 0, margin: 0}}
        tabIndex={-1}
        aria-label="Desplegar opciones"
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); setOpen(!open); }}
        data-test-id="select-dropdown-icon"
      />
      
      <DropdownList open={open} testId="select-list">
        {options.map((opt, idx) => (
          <li
            key={opt.id}
            ref={el => { optionRefs.current[idx] = el; }}
            className={require("@/app/components/DropdownList/DropdownList").dropdownOptionClass + 
              (highlightedIndex === idx ? " bg-secondary/30" : " text-neutral-700")}
            onMouseDown={() => { 
              setIsSelecting(true);
              onChange?.(opt.id); 
              setOpen(false); 
              setTimeout(() => setIsSelecting(false), 200);
              
              // Trigger form validation manually
              setTimeout(() => {
                const hiddenInput = document.querySelector(`input[name="${name || 'select-validation'}"]`) as HTMLInputElement;
                if (hiddenInput && required) {
                  hiddenInput.setCustomValidity('');
                  const form = hiddenInput.closest('form');
                  if (form) {
                    // Trigger validation event
                    hiddenInput.dispatchEvent(new Event('input', { bubbles: true }));
                  }
                }
              }, 10);
            }}
            onMouseEnter={() => setHighlightedIndex(idx)}
            data-test-id={`select-option-${opt.id}`}
          >
            {opt.label}
          </li>
        ))}
      </DropdownList>
    </div>
  );
}
export default Select;
