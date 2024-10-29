import { renderHook, act, waitFor } from '@testing-library/react';
import { useUpdateUserProfile } from '@/hooks/useUpdateUserProfile';
import { getDoc, updateDoc, type Timestamp } from 'firebase/firestore';
import { uploadBytes, getDownloadURL } from 'firebase/storage';
import { useDispatch } from 'react-redux';
import { setUser, setError } from '@/redux/slice/authSlice';
import type { User } from '@/types';

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

describe('useUpdatedUserProfile 테스트', () => {
  const mockUserId = 'user123';
  const mockName = 'New Name';
  const mockFile = new File(['profile'], 'profile.png', { type: 'image/png' });
  const dispatch = jest.fn();

  beforeEach(() => {
    (useDispatch as unknown as jest.Mock).mockReturnValue(dispatch);
    jest.clearAllMocks();
  });

  it('성공적으로 프로필을 업데이트 한다.', async () => {
    const mockUserData: User = {
      userId: mockUserId,
      name: 'test user',
      email: 'test@example.com',
      createdAt: { seconds: 1628880000, nanoseconds: 0 } as Timestamp,
      role: 'user',
      lastLogin: { seconds: 1628880000, nanoseconds: 0 } as Timestamp,
      preference: { theme: 'light', language: 'ko' },
    };

    (getDoc as jest.Mock).mockResolvedValueOnce({
      exists: () => true,
      data: () => mockUserData,
    });

    (uploadBytes as jest.Mock).mockResolvedValueOnce(undefined);
    (getDownloadURL as jest.Mock).mockResolvedValueOnce(
      'https://example.com/profile.png'
    );
    (updateDoc as jest.Mock).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useUpdateUserProfile(mockUserId));

    await act(async () => {
      result.current.updateProfile({
        name: mockName,
        profilePicture: mockFile,
      });
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(getDoc).toHaveBeenCalledWith(expect.anything());
    expect(uploadBytes).toHaveBeenCalledWith(expect.anything(), mockFile);
    expect(getDownloadURL).toHaveBeenCalledWith(expect.anything());
    expect(updateDoc).toHaveBeenCalledWith(expect.anything(), {
      name: mockName,
      profilePicture: 'https://example.com/profile.png',
    });

    expect(dispatch).toHaveBeenCalledWith(
      setUser({
        ...mockUserData,
        name: mockName,
        profilePicture: 'https://example.com/profile.png',
      })
    );
  });

  it('유저가 없을 때 에러를 반환해야 한다.', async () => {
    (getDoc as jest.Mock).mockResolvedValueOnce({
      exists: () => false,
    });

    const { result } = renderHook(() => useUpdateUserProfile(mockUserId));

    await act(async () => {
      result.current.updateProfile({
        name: mockName,
      });
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(dispatch).toHaveBeenCalledWith(setError('User not found'));
  });

  it('업데이트 실패 시 에러를 반환해야 한다.', async () => {
    const errorMessage = 'Failed to update profile';
    (getDoc as jest.Mock).mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ userId: mockUserId }),
    });
    (updateDoc as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useUpdateUserProfile(mockUserId));

    await act(async () => {
      result.current.updateProfile({
        name: mockName,
      });
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(dispatch).toHaveBeenCalledWith(setError(errorMessage));
  });
});
