import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outlined" | "text";
  className?: string;
  [key: string]: any;
}

const variantClasses: Record<string, string> = {
  primary: "btn-contained-primary cursor-pointer",
  secondary: "btn-contained-secondary cursor-pointer",
  outlined: "btn-outlined cursor-pointer",
  text: "btn-text cursor-pointer",
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  return (
    <button
      className={`${variantClasses[variant] || variantClasses.primary} ${className}`}
      data-test-id="button-root"
      {...props}
    >
      {children}
    </button>
  );
};
