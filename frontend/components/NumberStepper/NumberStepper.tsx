'use client';
import React, { useState, useRef } from 'react';

interface NumberStepperProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  required?: boolean;
  allowNegative?: boolean;
  allowFloat?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  ["data-test-id"]?: string;
}

export const NumberStepper: React.FC<NumberStepperProps> = ({
  label,
  value,
  onChange,
  step = 1,
  min,
  max,
  required = false,
  allowNegative = true,
  allowFloat = false,
  placeholder,
  className = "",
  disabled = false,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Función para validar y formatear el valor
  const validateAndFormatValue = (newValue: number): number => {
    let validatedValue = newValue;

    // Aplicar límites
    if (min !== undefined && validatedValue < min) {
      validatedValue = min;
    }
    if (max !== undefined && validatedValue > max) {
      validatedValue = max;
    }

    // No permitir negativos si no está permitido
    if (!allowNegative && validatedValue < 0) {
      validatedValue = 0;
    }

    // Redondear si no se permiten floats
    if (!allowFloat) {
      validatedValue = Math.round(validatedValue);
    }

    return validatedValue;
  };

  // Función para incrementar
  const increment = () => {
    if (disabled) return;
    const newValue = value + step;
    const validatedValue = validateAndFormatValue(newValue);
    onChange(validatedValue);
  };

  // Función para decrementar
  const decrement = () => {
    if (disabled) return;
    const newValue = value - step;
    const validatedValue = validateAndFormatValue(newValue);
    onChange(validatedValue);
  };

  // Manejar cambio en el input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const inputValue = e.target.value;
    const numericValue = allowFloat ? parseFloat(inputValue) : parseInt(inputValue);

    if (!isNaN(numericValue)) {
      const validatedValue = validateAndFormatValue(numericValue);
      onChange(validatedValue);
    } else if (inputValue === '' || inputValue === '-') {
      // Permitir valores vacíos o negativos parciales
      onChange(allowNegative && inputValue === '-' ? 0 : 0);
    }
  };

  // focus handlers removed (not used) to satisfy linter

  // Estilos base similares a TextField
  const baseInputClasses = `
    block w-full py-2 text-sm font-light text-foreground appearance-none
    focus:outline-none focus:border-primary
    transition-colors duration-200 px-3 bg-transparent
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
    ${className}
  `;

  const labelClasses = `
    text-sm font-medium text-gray-700
    ${required ? "after:content-['*'] after:text-red-500 after:ml-1" : ""}
  `;

  const buttonClasses = `
    flex items-center justify-center px-3 py-2 bg-transparent hover:bg-gray-50
    focus:outline-none
    transition-colors duration-200
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
  `;

  const containerClasses = `
    flex items-center border-[1px] border-border rounded-md bg-transparent
    ${disabled ? 'bg-gray-100' : ''}
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          input[type="number"]::-webkit-inner-spin-button,
          input[type="number"]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          input[type="number"] {
            -moz-appearance: textfield;
          }
        `
      }} />
      <div className={containerClasses} data-test-id="number-stepper-root">
        {/* Botón decrementar */}
        <button
          type="button"
          onClick={decrement}
          disabled={disabled || (min !== undefined && value <= min)}
          className={`${buttonClasses} rounded-l-md`}
          data-test-id={`${props['data-test-id']}-decrement`}
        >
          <span className="material-symbols-outlined text-gray-600">remove</span>
        </button>

        {/* Input numérico */}
        <input
          ref={inputRef}
          type="number"
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          step={allowFloat ? step : step}
          required={required}
          placeholder={placeholder}
          disabled={disabled}
          className={`${baseInputClasses} rounded-none text-center flex-1`}
          data-test-id={props['data-test-id']}
        />

        {/* Label */}
        <label className={`${labelClasses} px-2`}>
          {label}
        </label>

        {/* Botón incrementar */}
        <button
          type="button"
          onClick={increment}
          disabled={disabled || (max !== undefined && value >= max)}
          className={`${buttonClasses} rounded-r-md`}
          data-test-id={`${props['data-test-id']}-increment`}
        >
          <span className="material-symbols-outlined text-gray-600">add</span>
        </button>
      </div>
    </>
  );
};

export default NumberStepper;