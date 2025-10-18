'use client';
import React, { useState } from 'react';
import NumberStepper from './NumberStepper';

export default function NumberStepperPage() {
  const [value1, setValue1] = useState(0);
  const [value2, setValue2] = useState(10.5);
  const [value3, setValue3] = useState(5);
  const [value4, setValue4] = useState(0);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">NumberStepper Component</h1>

      <div className="space-y-6">
        {/* Ejemplo básico con enteros */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Enteros básicos</h2>
          <NumberStepper
            label="Cantidad"
            value={value1}
            onChange={setValue1}
            step={1}
            min={0}
            max={100}
            data-test-id="quantity-stepper"
          />
          <p className="text-sm text-gray-600 mt-1">Valor: {value1}</p>
        </div>

        {/* Ejemplo con floats */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Decimales</h2>
          <NumberStepper
            label="Precio"
            value={value2}
            onChange={setValue2}
            step={0.5}
            min={0}
            max={1000}
            allowFloat={true}
            data-test-id="price-stepper"
          />
          <p className="text-sm text-gray-600 mt-1">Valor: {value2}</p>
        </div>

        {/* Ejemplo con valores negativos permitidos */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Con negativos</h2>
          <NumberStepper
            label="Temperatura"
            value={value3}
            onChange={setValue3}
            step={1}
            min={-50}
            max={50}
            allowNegative={true}
            data-test-id="temperature-stepper"
          />
          <p className="text-sm text-gray-600 mt-1">Valor: {value3}°C</p>
        </div>

        {/* Ejemplo requerido */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Campo requerido</h2>
          <NumberStepper
            label="Edad"
            value={value4}
            onChange={setValue4}
            step={1}
            min={0}
            max={120}
            required={true}
            data-test-id="age-stepper"
          />
          <p className="text-sm text-gray-600 mt-1">Valor: {value4}</p>
        </div>
      </div>
    </div>
  );
}