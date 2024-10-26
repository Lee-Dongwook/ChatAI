import React from 'react';

interface InputProps {
  type: 'text' | 'email' | 'password' | 'file';
  placeholder?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  type,
  placeholder,
  value,
  onChange,
  className,
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={type !== 'file' ? value : undefined}
      onChange={onChange}
      className={`border p-2 rounded ${className}`}
    />
  );
};
