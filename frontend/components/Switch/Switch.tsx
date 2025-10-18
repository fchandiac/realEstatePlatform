import React, { useState } from "react";

interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  labelPosition?: 'left' | 'right';
  ["data-test-id"]?: string;
}

const Switch: React.FC<SwitchProps> = ({ checked = false, onChange, label, labelPosition = 'left', ...props }) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    setIsChecked(!isChecked);
    onChange?.(!isChecked);
  };

  return (
    <label className="flex items-center gap-2 cursor-pointer select-none" data-test-id={props["data-test-id"] || "switch-root"}>
      {labelPosition === 'left' && label && (
        <span className="text-sm font-light">{label}</span>
      )}
  <span
    className={`relative w-10 h-6 flex items-center rounded-full transition-colors duration-200 group`}
    style={{ boxShadow: 'inset 0 0 0 4px var(--color-neutral)', background: 'var(--color-background)' }}
    onClick={handleToggle}
    role="switch"
    aria-checked={isChecked}
    tabIndex={0}
  >
    <span
      className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-200${isChecked ? ' translate-x-4 bg-primary' : ' border bg-background group-hover:bg-accent/60'}`}
      style={isChecked ? {} : { borderColor: 'var(--color-neutral)', borderWidth: '1px' }}
    />
  </span>
      {labelPosition === 'right' && label && (
        <span className="text-sm font-light">{label}</span>
      )}
    </label>
  );
};

export default Switch;
