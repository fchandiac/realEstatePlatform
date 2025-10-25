'use client'
import React, { useState, useRef, useEffect } from "react";
import DropdownList, { dropdownOptionClass } from "@/components/DropdownList/DropdownList";
import IconButton from "@/components/IconButton/IconButton";

export interface Option {
  id: number;
  label: string;
}

interface AutoCompleteProps<T = Option> {
  options: T[];
  label?: string;
  placeholder?: string;
  value?: T | null;
  onChange?: (option: T | null) => void;
  name?: string;
  required?: boolean;
  getOptionLabel?: (option: T) => string;
  getOptionValue?: (option: T) => any;
  ["data-test-id"]?: string;
}

const AutoComplete = <T = Option,>({
  options,
  label,
  placeholder,
  value = null,
  onChange,
  name,
  required,
  getOptionLabel,
  getOptionValue,
  ...props
}: AutoCompleteProps<T>) => {
  // Helper functions with defaults for backward compatibility
  const defaultGetOptionLabel = (option: T): string => {
    if (typeof option === 'string') return option;
    if (option && typeof option === 'object' && 'label' in option) {
      return (option as any).label;
    }
    return String(option);
  };

  const defaultGetOptionValue = (option: T): any => {
    if (typeof option === 'string') return option;
    if (option && typeof option === 'object' && 'id' in option) {
      return (option as any).id;
    }
    return option;
  };

  const getLabel = getOptionLabel || defaultGetOptionLabel;
  const getValue = getOptionValue || defaultGetOptionValue;
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [inputValue, setInputValue] = useState(value ? getLabel(value) : "");
  const [focused, setFocused] = useState(false);
  const [open, setOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [validationTriggered, setValidationTriggered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const shrink = focused || inputValue.length > 0;
  const filteredOptions = options.filter(opt => getLabel(opt).toLowerCase().includes(inputValue.toLowerCase()));

  // Manejo global de teclado para mejor compatibilidad con dialogs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!focused) return;

      if (!open && ["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) {
        e.preventDefault();
        setOpen(true);
        setHighlightedIndex(e.key === "ArrowUp" ? filteredOptions.length - 1 : 0);
        return;
      }

      if (!open || filteredOptions.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setIsNavigating(true);
        setHighlightedIndex(i => (i < filteredOptions.length - 1 ? i + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setIsNavigating(true);
        setHighlightedIndex(i => (i > 0 ? i - 1 : filteredOptions.length - 1));
      } else if (e.key === "Enter" && highlightedIndex >= 0) {
        e.preventDefault();
        handleSelect(filteredOptions[highlightedIndex]);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        setIsNavigating(false);
        setHighlightedIndex(-1);
      }
    };

    if (focused) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [focused, open, filteredOptions, highlightedIndex, isNavigating]);

  const handleSelect = (option: T) => {
    setInputValue(getLabel(option));
    setOpen(false);
    setIsNavigating(false);
    onChange?.(option);
  };

  const handleClear = () => {
    setInputValue(""); // Clear the input text
    setOpen(false); // Close the dropdown
    setHighlightedIndex(-1); // Reset the highlighted index
    onChange?.(null); // Clear the selected option

    if (inputRef.current) {
      inputRef.current.value = ""; // Ensure the input field is cleared
      inputRef.current.focus(); // Focus the input after clearing
    }
  };

  const handleValidation = () => {
    if (required && (!value || (inputValue && !value))) {
      setValidationTriggered(true);
      setOpen(false); // Prevent dropdown from opening when validation fails
    } else {
      setValidationTriggered(false);
    }
  };

  return (
    <div className="relative w-full pt-2" data-test-id={props["data-test-id"] || "auto-complete-root"}>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onFocus={() => { setFocused(true); setOpen(true); setIsNavigating(false); }}
        onBlur={() => {
          setFocused(false);
          handleValidation();
          if (!isNavigating) {
            setTimeout(() => setOpen(false), 150);
          }
          setHighlightedIndex(-1);
        }}
        onChange={e => { setInputValue(e.target.value); setOpen(true); setHighlightedIndex(-1); }}
        className={`block w-full min-w-[180px] rounded border-[1px] px-3 py-2 text-sm font-light text-foreground focus:outline-none transition-colors duration-200 border-border ${focused ? 'border-primary' : ''} ${value ? 'pr-16' : 'pr-10'}`}
        style={{ backgroundColor: "var(--color-background)" }}
        placeholder={
          shrink
            ? ''
            : `${placeholder ?? label}${required ? ' *' : ''}`
        }
        autoComplete="off"
        data-test-id="auto-complete-input"
        name={name}
        required={required}
      />
      <label
        className={`absolute left-3 top-1 pointer-events-none transition-all duration-300 ease-in-out px-1 font-light text-xs text-foreground` +
          (shrink ? " -translate-y-2 scale-90 opacity-100" : " opacity-0")}
        style={{ backgroundColor: "var(--color-background)" }}
        onClick={() => inputRef.current?.focus()}
        data-test-id="auto-complete-label"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {value && (
        <IconButton
          icon="close_small"
          variant="text"
          className={`absolute right-6 top-1/2 transform -translate-y-1/2 w-6 h-6 flex items-center justify-center ${focused ? 'text-primary' : 'text-secondary'}`}
          style={{lineHeight:0, padding: 0, margin: 0}}
          onClick={handleClear}
          aria-label="Limpiar selección"
          data-test-id="auto-complete-clear-icon"
          tabIndex={-1}
        />
      )}

      <IconButton
        icon="arrow_drop_down"
        variant="text"
        className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 flex items-center justify-center ${focused ? 'text-primary' : 'text-secondary'}`}
        style={{lineHeight:0, padding: 0, margin: 0}}
        tabIndex={-1}
        aria-label="Desplegar opciones"
        onClick={() => {
          if (!open) setOpen(true);
          if (!inputValue) inputRef.current?.focus();
        }}
        data-test-id="auto-complete-dropdown-icon"
      />
      <DropdownList open={open && filteredOptions.length > 0} testId="auto-complete-list">
        {filteredOptions.map((opt, idx) => (
          <li
            key={getValue(opt)}
            className={dropdownOptionClass + (highlightedIndex === idx ? " bg-primary/30" : " text-neutral-700")}
            onMouseDown={() => handleSelect(opt)}
            onMouseEnter={() => setHighlightedIndex(idx)}
            data-test-id={`auto-complete-option-${getValue(opt)}`}
          >
            {getLabel(opt)}
          </li>
        ))}
      </DropdownList>
    </div>
  );
};

export default AutoComplete;
