import React from 'react';

interface SpinnerProps {
  size?: number;
  color?: string;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 24,
  color = '#000',
  className = '',
}) => {
  return (
    <svg
      className={`animate-spin ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="status"
      aria-label="Loading"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="4"
        className="opacity-25"
      />
      <path
        fill={color}
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        className="opacity-75"
      />
    </svg>
  );
};
