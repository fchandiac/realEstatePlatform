'use client';

import React, { useEffect, useState } from "react";

interface DotProgressProps {
  /** Tamaño de cada dot en px */
  size?: number;
  /** Espaciado entre dots en px */
  gap?: number;
  /** Color principal (activo) */
  colorPrimary?: string;
  /** Color neutral (inactivo) */
  colorNeutral?: string;
  className?: string;
  /** Intervalo de animación en ms */
  interval?: number;
}

const DEFAULT_SIZE = 16;
const DEFAULT_GAP = 8;
const DEFAULT_PRIMARY = "var(--color-primary)";
const DEFAULT_NEUTRAL = "var(--color-neutral)";
const DEFAULT_INTERVAL = 350;

const DotProgress: React.FC<DotProgressProps> = ({
  size = DEFAULT_SIZE,
  gap = DEFAULT_GAP,
  colorPrimary = DEFAULT_PRIMARY,
  colorNeutral = DEFAULT_NEUTRAL,
  className = "",
  interval = DEFAULT_INTERVAL,
}) => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % 5);
    }, interval);
    return () => clearInterval(timer);
  }, [interval]);

  return (
    <div className={`flex items-center ${className}`} style={{ gap }} data-test-id="dot-progress-root">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            backgroundColor: i === active ? colorPrimary : colorNeutral,
            display: "inline-block",
            transition: "background-color 0.2s",
            animation: i === active ? "dotPulse 1s infinite ease-in-out" : undefined,
          }}
        />
      ))}
      <style>{`
        @keyframes dotPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default DotProgress;
