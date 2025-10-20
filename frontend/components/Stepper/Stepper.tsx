import React from 'react';

interface StepperProps {
  steps: string[];
  activeStep: number;
  onStepChange: (step: number) => void;
}

const Stepper: React.FC<StepperProps> = ({ steps, activeStep, onStepChange }) => {
  return (
    <div className="flex items-center justify-center mb-6">
      {steps.map((label, idx) => (
        <React.Fragment key={label}>
          <button
            type="button"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none
              ${idx === activeStep ? 'bg-primary text-white' : 'bg-background text-primary border border-primary'}
            `}
            onClick={() => onStepChange(idx)}
            disabled={idx > activeStep + 1}
          >
            {label}
          </button>
          {idx < steps.length - 1 && (
            <span className="mx-2 text-secondary">→</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Stepper;
