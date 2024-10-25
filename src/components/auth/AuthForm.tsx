'use client';
import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

interface AuthFormProps {
  onSubmit: (email: string, password: string) => void;
  isLoading: boolean;
  errorMessage?: string;
  submitText: string;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  onSubmit,
  isLoading,
  errorMessage,
  submitText,
}: AuthFormProps) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = () => {
    onSubmit(email, password);
  };

  return (
    <div className="flex flex-col gap-4">
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? 'Loading...' : submitText}
      </Button>
      {errorMessage && <ErrorMessage message={errorMessage} />}
    </div>
  );
};
