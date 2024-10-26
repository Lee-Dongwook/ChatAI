'use client';
import React, { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Select } from '@/components/atoms/Select';

interface UserPreferenceFormProps {
  initialTheme: string;
  initialLanguage: string;
  onSave: (theme: string, language: string) => void;
}

export const UserPreferenceForm: React.FC<UserPreferenceFormProps> = ({
  initialTheme,
  initialLanguage,
  onSave,
}) => {
  const [theme, setTheme] = useState(initialTheme);
  const [language, setLanguage] = useState(initialLanguage);

  const themeOptions = [
    { value: 'light', label: 'light' },
    { value: 'dark', label: 'dark' },
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'ko', label: 'Korean' },
  ];

  const handleChangeTheme = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value);
  };

  const handleChangeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Preferences</h2>

      <div className="flex items-center space-x-2">
        <label className="text-sm">Theme:</label>
        <Select
          value={theme}
          onChange={handleChangeTheme}
          options={themeOptions}
        />
      </div>

      <div className="flex items-center space-x-2">
        <label className="text-sm">Language:</label>
        <Select
          value={language}
          onChange={handleChangeLanguage}
          options={languageOptions}
        />
      </div>

      <Button onClick={() => onSave(theme, language)}>Save Preferences</Button>
    </div>
  );
};
