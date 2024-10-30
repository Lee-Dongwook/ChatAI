'use client';
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{ value: string; label: string }>;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  className,
  ...props
}) => {
  return (
    <select
      className={`w-48 border border-gray-300 rounded-lg p-2 ${className}`}
      {...props}
    >
      {options &&
        options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
    </select>
  );
};
