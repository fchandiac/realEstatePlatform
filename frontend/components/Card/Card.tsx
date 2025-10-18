import React from "react";

interface CardProps {
  height?: string | number; // e.g. '20rem' or 320
  topArea?: React.ReactNode;
  topAreaHeight?: string | number; // e.g. '40%' or '80px'
  content?: React.ReactNode;
  actionsArea?: React.ReactNode;
  className?: string;
  ["data-test-id"]?: string;
}

const Card: React.FC<CardProps> = ({
  height = '20rem',
  topArea,
  topAreaHeight = '40%',
  content,
  actionsArea,
  className = '',
  ...props
}) => {
  const dataTestId = props["data-test-id"];
  return (
    <div
      className={`bg-background rounded-lg border flex flex-col justify-between overflow-hidden w-full ${className}`}
      style={{ height, borderColor: 'var(--color-border)', borderWidth: '1px' }}
      data-test-id={dataTestId || 'card-root'}
    >
      {/* Top Area */}
      <div style={{ height: topAreaHeight }} className="flex items-center justify-center">
        {topArea}
      </div>
      {/* Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center py-2">
        {content}
      </div>
      {/* Actions Area */}
  <div className="w-full flex bg-secondary/30 justify-end items-center px-2 py-1 gap-2">
        {actionsArea}
      </div>
    </div>
  );
};

export default Card;
