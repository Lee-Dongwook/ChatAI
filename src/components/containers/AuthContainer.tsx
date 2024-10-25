'use client';
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthForm } from '@/components/molecules/AuthForm';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import { Button } from '@/components/atoms/Button';

export const AuthContainer: React.FC = () => {
  const { signUp, login, logOut } = useAuth();
  const { isAuthenticated, error } = useSelector(
    (state: RootState) => state.auth
  );

  const handleSignUp = (email: string, password: string) => {
    signUp.mutate({ email, password });
  };
  const handleLogin = (email: string, password: string) => {
    login.mutate({ email, password });
  };

  return (
    <div className="p-4">
      {isAuthenticated ? (
        <div>
          <h1>반갑습니다!</h1>
          <Button onClick={() => logOut.mutate()}>Logout</Button>
        </div>
      ) : (
        <div>
          <h2>Login</h2>
          <AuthForm
            onSubmit={handleLogin}
            isLoading={login.isPending}
            errorMessage={error as string}
            submitText="Log In"
          />
          <h2>Sign Up</h2>
          <AuthForm
            onSubmit={handleSignUp}
            isLoading={signUp.isPending}
            errorMessage={error as string}
            submitText="Sign Up"
          />
        </div>
      )}
    </div>
  );
};
