'use client';
import React from 'react';

interface CheckboxProps {
  checked?: boolean;
  label?: string;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  label,
  disabled = false,
  onChange,
}) => {
  return (
    <label
      className={`flex items-center space-x-2 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div className="relative w-7 h-7 border border-gray-300 rounded">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="opacity-0 absolute inset-0"
          disabled={disabled}
        />
      </div>
      {label && <span className="text-black">{label}</span>}
    </label>
  );
};

export default Checkbox;
