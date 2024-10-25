/* eslint-disable react/display-name */
import React, { ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { getDoc, Timestamp } from 'firebase/firestore';
import { useUserProfile } from '@/hooks/useUserProfile';
import type { User } from '@/types';
import { createTestQueryClient } from '@/lib/test-utils';

jest.mock('firebase/firestore');

const createWrapper = () => {
  const queryClient = createTestQueryClient();
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useUserProfile', () => {
  it('유저 프로필 Fetch 성공', async () => {
    const mockUserData: User = {
      userId: '1',
      email: 'test@example.com',
      name: 'Test User',
      createdAt: { seconds: 1628880000, nanoseconds: 0 } as Timestamp,
      role: 'user',
      lastLogin: { seconds: 1628880000, nanoseconds: 0 } as Timestamp,
      preference: { theme: 'light', language: 'ko' },
    };

    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => mockUserData,
    });

    const { result } = renderHook(() => useUserProfile('1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockUserData);
    });
  });

  it('유저가 없을 때 에러 발생', async () => {
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => false,
    });

    const { result } = renderHook(() => useUserProfile('2'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBeInstanceOf(Error);
    });
  });
});
