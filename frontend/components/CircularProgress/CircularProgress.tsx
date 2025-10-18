import React from "react";

interface CircularProgressProps {
  size?: number;
  thickness?: number;
  className?: string;
}

// Usa tailwind para animación y color
const CircularProgress: React.FC<CircularProgressProps> = ({ size = 40, thickness = 4, className = "" }) => {
  return (
    <span
      className={`inline-block animate-spin ${className}`}
      style={{ width: size, height: size }}
      data-test-id="circular-progress-root"
    >
      <svg
        className="block"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          className="text-neutral opacity-20"
          cx={size / 2}
          cy={size / 2}
          r={(size - thickness) / 2}
          fill="none"
          stroke="currentColor"
          strokeWidth={thickness}
        />
        <path
          className="text-primary"
          fill="none"
          stroke="currentColor"
          strokeWidth={thickness}
          strokeLinecap="round"
          d={`M ${size / 2} ${thickness / 2}
            a ${(size - thickness) / 2} ${(size - thickness) / 2} 0 1 1 0 ${size - thickness}
            `}
        />
      </svg>
    </span>
  );
};

export default CircularProgress;
