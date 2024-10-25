import React from 'react';
import { AuthContainer } from '@/components/auth/AuthContainer';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthContainer />
    </div>
  );
};
