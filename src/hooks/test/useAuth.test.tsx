/* eslint-disable react/display-name */
import { renderHook, act } from '@testing-library/react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../../../firebaseConfig';
import { setDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { setUser, clearUser, setError } from '@/redux/slice/authSlice';
import { useAuth } from '@/hooks/useAuth';
import { createTestQueryClient } from '@/lib/test-utils';
import { QueryClientProvider } from '@tanstack/react-query';

jest.mock('firebase/auth');
jest.mock('firebase/firestore');
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

describe('useAuth', () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    (useDispatch as unknown as jest.Mock).mockReturnValue(dispatch);
    jest.clearAllMocks();
  });

  const createWrapper = () => {
    const queryClient = createTestQueryClient();
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  it('회원가입 성공 시 Firestore에 사용자 정보 저장', async () => {
    const mockUser = { uid: 'user1', email: 'test@test.com' };
    const mockDocRef = {};

    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: mockUser,
    });
    (setDoc as jest.Mock).mockResolvedValueOnce(undefined);
    (doc as jest.Mock).mockReturnValue(mockDocRef);

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.signUp.mutate({
        email: 'test@test.com',
        password: 'password',
      });
    });

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      auth,
      'test@test.com',
      'password'
    );

    expect(setDoc).toHaveBeenCalledWith(
      mockDocRef,
      expect.objectContaining({
        userId: 'user1',
        email: 'test@test.com',
      })
    );

    expect(dispatch).toHaveBeenCalledWith(setUser(expect.any(Object)));
  });

  it('로그인 성공 시 Firestore에 lastLogin 업데이트', async () => {
    const mockUser = { uid: 'user1', email: 'test@test.com' };
    const mockDocRef = {};
    const mockTimestamp = { seconds: 16288880000, nanosceonds: 0 };

    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: mockUser,
    });
    (updateDoc as jest.Mock).mockResolvedValueOnce(undefined);
    (doc as jest.Mock).mockReturnValue(mockDocRef);
    (serverTimestamp as jest.Mock).mockReturnValue(mockTimestamp);

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.login.mutate({
        email: 'test@test.com',
        password: 'password',
      });
    });

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      auth,
      'test@test.com',
      'password'
    );

    expect(updateDoc).toHaveBeenCalledWith(mockDocRef, {
      lastLogin: mockTimestamp,
    });

    expect(dispatch).toHaveBeenCalledWith(setUser(expect.any(Object)));
  });

  it('로그아웃 성공 시 사용자 정보 초기화', async () => {
    (signOut as jest.Mock).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.logOut.mutate();
    });

    expect(signOut).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(clearUser());
  });

  it('회원가입 실패 시 오류 처리', async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(
      new Error('회원가입 실패')
    );

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.signUp.mutate({
        email: 'test@test.com',
        password: 'password',
      });
    });

    expect(dispatch).toHaveBeenCalledWith(setError('회원가입 실패'));
  });

  it('로그인 실패 시 오류 처리', async () => {
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(
      new Error('로그인 실패')
    );

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.login.mutate({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    expect(dispatch).toHaveBeenCalledWith(setError('로그인 실패'));
  });
});
