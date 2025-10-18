import React from "react";

interface ButtonPillProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outlined";
  className?: string;
  [key: string]: any;
}

const pillVariantClasses: Record<string, string> = {
  primary: "btn-pill-primary cursor-pointer",
  secondary: "btn-pill-secondary cursor-pointer",
  outlined: "btn-pill-outlined cursor-pointer",
};

export const ButtonPill: React.FC<ButtonPillProps> = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  return (
    <button
      className={`${pillVariantClasses[variant] || pillVariantClasses.primary} ${className}`}
      data-test-id="button-pill-root"
      {...props}
    >
      {children}
    </button>
  );
};
