'use client';
import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  disabled,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-blue-500 text-white p-2 rounded ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
};
