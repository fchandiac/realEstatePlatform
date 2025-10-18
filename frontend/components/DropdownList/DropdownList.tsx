// Option row style for dropdown
export const dropdownOptionClass = "px-3 py-2 cursor-pointer text-sm font-light rounded transition-colors duration-200 hover:bg-secondary/30 hover:rounded-none";
import React from "react";

interface DropdownListProps {
  open: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  testId?: string;
  dropUp?: boolean;
}

const DropdownList: React.FC<DropdownListProps> = ({ open, children, className = "", style, testId, dropUp = false }) => {
  if (!open) return null;
  const dropStyle = dropUp ? { bottom: '100%', top: 'auto', marginBottom: '0.25rem', marginTop: 0 } : { marginTop: '0.25rem' };
  return (
    <ul
  className={`absolute z-[60] w-full rounded shadow-lg max-h-56 overflow-auto ${className}`}
  style={{ background: "var(--color-background)", ...style, ...dropStyle }}
      data-test-id={testId || "dropdown-list"}
    >
      {children}
    </ul>
  );
};

export default DropdownList;
