'use client'
import React, { useState } from "react";
import DropdownList from "@/app/components/DropdownList/DropdownList";
import IconButton from "@/app/components/IconButton/IconButton";

export interface Option {
  id: number;
  label: string;
}

interface SimpleSelectProps {
  options: Option[];
  placeholder: string;
  value?: number | null;
  onChange?: (id: number | null) => void;
  width?: number | string; // Nueva prop para el ancho
  minWidth?: number | string; // Nueva prop para minWidth
  dropUp?: boolean; // Nueva prop para renderizar hacia arriba
}

const SimpleSelect: React.FC<SimpleSelectProps> = ({ 
  options, 
  placeholder, 
  value = null, 
  onChange,
  width = 'auto',
  minWidth = 120,
  dropUp = false
}) => {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const selected = options.find(opt => opt.id === value);

  const containerStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    minWidth: typeof minWidth === 'number' ? `${minWidth}px` : minWidth,
  };

  return (
    <div className="relative" style={containerStyle} data-test-id="simple-select-root">
      <div
        className={`block w-full rounded border-[1px] px-3 py-2 text-sm font-light text-foreground focus:outline-none transition-colors duration-200 border-border ${focused ? 'border-primary' : ''} appearance-none cursor-pointer flex items-center`}
        tabIndex={0}
        onClick={() => setOpen(!open)}
        onBlur={() => { setOpen(false); setFocused(false); }}
        onFocus={() => setFocused(true)}
        data-test-id="simple-select-input"
        style={{ position: 'relative', background: 'var(--color-background)' }}
      >
        <span className={`text-sm font-light ${focused ? 'text-primary' : selected ? 'text-foreground' : 'text-muted-foreground'}`}>
          {selected ? selected.label : placeholder}
        </span>
        <IconButton icon="arrow_drop_down"
          variant="text"
          className={`absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center ${focused ? 'text-primary' : 'text-secondary'}`}
          style={{lineHeight:0, padding: 0, margin: 0}}
          tabIndex={-1}
          aria-label="Desplegar opciones"
          onClick={e => { e.stopPropagation(); setOpen(!open); }}
          data-test-id="simple-select-dropdown-icon"
        />
      </div>
      
      <DropdownList open={open} testId="simple-select-list" dropUp={dropUp}>
        {options.map(opt => (
          <li
            key={opt.id}
            className={require("@/app/components/DropdownList/DropdownList").dropdownOptionClass + " text-neutral-700"}
            onMouseDown={() => { onChange?.(opt.id); setOpen(false); }}
            data-test-id={`simple-select-option-${opt.id}`}
          >
            {opt.label}
          </li>
        ))}
      </DropdownList>
    </div>
  );
};

export default SimpleSelect;
